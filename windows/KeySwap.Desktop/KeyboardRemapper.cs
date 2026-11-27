using System.ComponentModel;
using System.Runtime.InteropServices;

namespace KeySwap.Desktop;

internal sealed class KeyboardRemapper : IDisposable
{
    private const int WhKeyboardLl = 13;
    private const int WmKeyDown = 0x0100;
    private const int WmKeyUp = 0x0101;
    private const int WmSysKeyDown = 0x0104;
    private const int WmSysKeyUp = 0x0105;
    private const uint LlkhfInjected = 0x0010;
    private const uint LlkhfLowerIlInjected = 0x0002;
    private const uint LlkhfAltDown = 0x0020;
    private const uint KeyeventfKeyup = 0x0002;
    private const uint KeyeventfUnicode = 0x0004;
    private const uint InputKeyboard = 1;

    private static readonly IReadOnlyDictionary<string, uint> ScanCodes =
        new Dictionary<string, uint>(StringComparer.Ordinal)
        {
            ["Backquote"] = 0x29,
            ["Digit1"] = 0x02, ["Digit2"] = 0x03, ["Digit3"] = 0x04, ["Digit4"] = 0x05,
            ["Digit5"] = 0x06, ["Digit6"] = 0x07, ["Digit7"] = 0x08, ["Digit8"] = 0x09,
            ["Digit9"] = 0x0A, ["Digit0"] = 0x0B, ["Minus"] = 0x0C, ["Equal"] = 0x0D,
            ["KeyQ"] = 0x10, ["KeyW"] = 0x11, ["KeyE"] = 0x12, ["KeyR"] = 0x13,
            ["KeyT"] = 0x14, ["KeyY"] = 0x15, ["KeyU"] = 0x16, ["KeyI"] = 0x17,
            ["KeyO"] = 0x18, ["KeyP"] = 0x19, ["BracketLeft"] = 0x1A, ["BracketRight"] = 0x1B,
            ["KeyA"] = 0x1E, ["KeyS"] = 0x1F, ["KeyD"] = 0x20, ["KeyF"] = 0x21,
            ["KeyG"] = 0x22, ["KeyH"] = 0x23, ["KeyJ"] = 0x24, ["KeyK"] = 0x25,
            ["KeyL"] = 0x26, ["Semicolon"] = 0x27, ["Quote"] = 0x28, ["Backslash"] = 0x2B,
            ["KeyZ"] = 0x2C, ["KeyX"] = 0x2D, ["KeyC"] = 0x2E, ["KeyV"] = 0x2F,
            ["KeyB"] = 0x30, ["KeyN"] = 0x31, ["KeyM"] = 0x32, ["Comma"] = 0x33,
            ["Period"] = 0x34, ["Slash"] = 0x35, ["Space"] = 0x39
        };
    private static readonly HashSet<string> AllowedIds = new(
        ScanCodes.Keys.Concat(new[]
        {
            "Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
            "Print", "Scroll", "Pause", "Backspace", "Tab", "CapsLock", "Enter", "ShiftLeft",
            "ShiftRight", "ControlLeft", "ControlRight", "MetaLeft", "MetaRight", "AltLeft",
            "AltRight", "ContextMenu"
        }),
        StringComparer.Ordinal);

    private readonly LowLevelKeyboardProc _hookCallback;
    private readonly HashSet<uint> _suppressedKeys = [];
    private Dictionary<uint, KeyOutput> _mapping = [];
    private IntPtr _hook;

    public KeyboardRemapper()
    {
        _hookCallback = HandleKeyboardEvent;
    }

    public bool IsActive => _hook != IntPtr.Zero;

    public void Apply(IReadOnlyCollection<KeyAssignment> keys)
    {
        if (keys.Count != 77)
            throw new InvalidDataException("The app did not provide a complete 77-key layout.");

        var seenIds = new HashSet<string>(StringComparer.Ordinal);
        var next = new Dictionary<uint, KeyOutput>();
        foreach (var key in keys)
        {
            if (!seenIds.Add(key.Id))
                throw new InvalidDataException("The keyboard layout contains duplicate key positions.");
            if (!AllowedIds.Contains(key.Id))
                throw new InvalidDataException("The keyboard layout contains an unknown key position.");
            if (key.Main.Length > 12 || key.Alt.Length > 12 ||
                key.Main.Any(char.IsControl) || key.Alt.Any(char.IsControl))
                throw new InvalidDataException("Key assignments must be printable text of at most 12 characters.");

            if (!ScanCodes.TryGetValue(key.Id, out var scanCode))
                continue;

            var legend = key.Id == "Space" && key.Main == "Space" ? " " : key.Main;
            var main = legend.ToLowerInvariant();
            var shifted = key.Alt.Length > 0 ? key.Alt : legend.ToUpperInvariant();
            next.Add(scanCode, new KeyOutput(
                main,
                main.ToUpperInvariant(),
                shifted,
                shifted.ToLowerInvariant()));
        }

        if (next.Count != ScanCodes.Count)
            throw new InvalidDataException("The keyboard layout is missing one or more typeable key positions.");

        if (_hook != IntPtr.Zero)
        {
            _mapping = next;
            return;
        }

        var previous = _mapping;
        _mapping = next;
        try
        {
            EnableHook();
        }
        catch
        {
            _mapping = previous;
            throw;
        }
    }

    public void Pause()
    {
        if (_hook == IntPtr.Zero)
            return;

        if (!UnhookWindowsHookEx(_hook))
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows could not pause keyboard remapping.");
        _hook = IntPtr.Zero;
        _suppressedKeys.Clear();
    }

    public void Resume()
    {
        if (_mapping.Count > 0)
            EnableHook();
    }

    private void EnableHook()
    {
        if (_hook != IntPtr.Zero)
            return;
        _hook = SetWindowsHookEx(WhKeyboardLl, _hookCallback, GetModuleHandle(null), 0);
        if (_hook == IntPtr.Zero)
        {
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows could not enable the keyboard remapping hook.");
        }
    }

    public void Stop()
    {
        if (_hook != IntPtr.Zero && !UnhookWindowsHookEx(_hook))
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Windows could not stop the keyboard remapping hook.");

        _hook = IntPtr.Zero;
        _mapping = [];
        _suppressedKeys.Clear();
    }

    public void Dispose()
    {
        if (_hook != IntPtr.Zero)
            UnhookWindowsHookEx(_hook);
        _hook = IntPtr.Zero;
        _mapping = [];
        _suppressedKeys.Clear();
    }

    private IntPtr HandleKeyboardEvent(int code, IntPtr message, IntPtr dataPointer)
    {
        if (code < 0)
            return CallNextHookEx(_hook, code, message, dataPointer);

        try
        {
            var data = Marshal.PtrToStructure<KeyboardHookData>(dataPointer);
            if ((data.Flags & (LlkhfInjected | LlkhfLowerIlInjected)) != 0 ||
                (data.Flags & 0x01) != 0 ||
                !_mapping.TryGetValue(data.ScanCode, out var output))
                return CallNextHookEx(_hook, code, message, dataPointer);

            var eventType = message.ToInt32();
            if (eventType is WmKeyUp or WmSysKeyUp)
            {
                return _suppressedKeys.Remove(data.ScanCode)
                    ? new IntPtr(1)
                    : CallNextHookEx(_hook, code, message, dataPointer);
            }

            if (eventType is not (WmKeyDown or WmSysKeyDown))
                return CallNextHookEx(_hook, code, message, dataPointer);

            if (_suppressedKeys.Contains(data.ScanCode))
            {
                if ((data.Flags & LlkhfAltDown) == 0 &&
                    !HasShortcutModifier() &&
                    !SendMappedText(output))
                    return CallNextHookEx(_hook, code, message, dataPointer);
                return new IntPtr(1);
            }

            if ((data.Flags & LlkhfAltDown) != 0 || HasShortcutModifier())
                return CallNextHookEx(_hook, code, message, dataPointer);

            if (!SendMappedText(output))
                return CallNextHookEx(_hook, code, message, dataPointer);
            _suppressedKeys.Add(data.ScanCode);
            return new IntPtr(1);
        }
        catch
        {
            return CallNextHookEx(_hook, code, message, dataPointer);
        }
    }

    private static bool HasShortcutModifier() =>
        IsKeyDown(0x11) || IsKeyDown(0x12) || IsKeyDown(0x5B) || IsKeyDown(0x5C);

    private static bool IsShiftDown() => IsKeyDown(0x10);
    private static bool IsKeyDown(int virtualKey) => (GetAsyncKeyState(virtualKey) & 0x8000) != 0;
    private static bool IsCapsLockOn() => (GetKeyState(0x14) & 1) != 0;

    private static bool SendMappedText(KeyOutput output)
    {
        var shifted = IsShiftDown();
        var capsLock = IsCapsLockOn();
        var value = (shifted, capsLock) switch
        {
            (false, false) => output.Main,
            (false, true) => output.CapsMain,
            (true, false) => output.Shifted,
            _ => output.CapsShifted
        };

        if (value.Length == 0)
            return true;

        var input = new Input[value.Length * 2];
        for (var index = 0; index < value.Length; index++)
        {
            var codeUnit = value[index];
            input[index * 2] = CreateUnicodeInput(codeUnit, false);
            input[index * 2 + 1] = CreateUnicodeInput(codeUnit, true);
        }

        var sent = SendInput((uint)input.Length, input, Marshal.SizeOf<Input>());
        return sent == input.Length;
    }

    private static Input CreateUnicodeInput(char codeUnit, bool keyUp) => new()
    {
        Type = InputKeyboard,
        Union = new InputUnion
        {
            Keyboard = new KeyboardInput
            {
                ScanCode = codeUnit,
                Flags = KeyeventfUnicode | (keyUp ? KeyeventfKeyup : 0)
            }
        }
    };

    private sealed record KeyOutput(string Main, string CapsMain, string Shifted, string CapsShifted);

    private delegate IntPtr LowLevelKeyboardProc(int code, IntPtr message, IntPtr data);

    [StructLayout(LayoutKind.Sequential)]
    private struct KeyboardHookData
    {
        public uint VirtualKey;
        public uint ScanCode;
        public uint Flags;
        public uint Time;
        public UIntPtr ExtraInfo;
    }

    [StructLayout(LayoutKind.Explicit, Size = 40)]
    private struct Input
    {
        [FieldOffset(0)]
        public uint Type;

        [FieldOffset(8)]
        public InputUnion Union;
    }

    [StructLayout(LayoutKind.Explicit, Size = 32)]
    private struct InputUnion
    {
        [FieldOffset(0)]
        public KeyboardInput Keyboard;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct KeyboardInput
    {
        public ushort VirtualKey;
        public ushort ScanCode;
        public uint Flags;
        public uint Time;
        public UIntPtr ExtraInfo;
    }

    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int hookId, LowLevelKeyboardProc callback, IntPtr module, uint threadId);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hook);

    [DllImport("user32.dll")]
    private static extern IntPtr CallNextHookEx(IntPtr hook, int code, IntPtr message, IntPtr data);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern uint SendInput(uint count, Input[] inputs, int inputSize);

    [DllImport("user32.dll")]
    private static extern short GetAsyncKeyState(int virtualKey);

    [DllImport("user32.dll")]
    private static extern short GetKeyState(int virtualKey);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string? moduleName);
}

internal sealed record KeyAssignment(string Id, string Main, string Alt);
