using System.Diagnostics;
using System.Text.Json;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using System.Windows.Forms;

namespace KeySwap.Desktop;

internal sealed class MainForm : Form
{
    private const string BridgeScript = """
      (() => {
        let nextRequestId = 0;
        const pending = new Map();
        window.chrome.webview.addEventListener("message", event => {
          const response = event.data;
          const request = pending.get(response.requestId);
          if (!request) return;
          pending.delete(response.requestId);
          clearTimeout(request.timeout);
          if (response.error) request.reject(new Error(response.error));
          else request.resolve(response.result);
        });
        const request = (type, payload = {}) => new Promise((resolve, reject) => {
          const requestId = `keyswa-${++nextRequestId}`;
          const timeout = setTimeout(() => {
            pending.delete(requestId);
            reject(new Error("The desktop app did not respond."));
          }, 120000);
          pending.set(requestId, { resolve, reject, timeout });
          window.chrome.webview.postMessage({ requestId, type, ...payload });
        });
        window.keySwapDesktop = Object.freeze({
          applyLayout: layout => request("apply-layout", { layout }),
          stopRemapping: () => request("stop-remapping"),
          getRemapStatus: () => request("get-status"),
          getAuthRedirectUrl: () => request("get-auth-redirect-url"),
          openExternalAuthUrl: (url, projectUrl) => request("open-auth-url", { url, projectUrl }),
          receiveAuthCallback: callback => window.dispatchEvent(
            new CustomEvent("keyswauthcallback", { detail: callback })
          )
        });
      })();
      """;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private readonly WebView2 _browser = new() { Dock = DockStyle.Fill };
    private readonly KeyboardRemapper _remapper = new();
    private readonly AuthCallbackListener _authCallbackListener = new();

    public MainForm()
    {
        Text = "KeySwap";
        Width = 1180;
        Height = 820;
        MinimumSize = new Size(800, 620);
        StartPosition = FormStartPosition.CenterScreen;
        Controls.Add(_browser);
        _authCallbackListener.CallbackReceived += HandleAuthCallback;
        Shown += InitializeBrowser;
        FormClosing += (_, _) =>
        {
            _authCallbackListener.Dispose();
            _remapper.Dispose();
        };
    }

    private async void InitializeBrowser(object? sender, EventArgs e)
    {
        try
        {
            var webRoot = Path.Combine(AppContext.BaseDirectory, "wwwroot");
            if (!File.Exists(Path.Combine(webRoot, "index.html")))
                throw new FileNotFoundException("The KeySwap web interface is missing from this app package.");

            await _browser.EnsureCoreWebView2Async();
            var core = _browser.CoreWebView2;
            core.Settings.AreDevToolsEnabled = false;
            core.SetVirtualHostNameToFolderMapping(
                "keyswa.example",
                webRoot,
                CoreWebView2HostResourceAccessKind.Allow);
            await core.AddScriptToExecuteOnDocumentCreatedAsync(BridgeScript);
            core.WebMessageReceived += HandleWebMessage;
            core.Navigate("https://keyswa.example/index.html");
        }
        catch (Exception error)
        {
            MessageBox.Show(
                this,
                $"KeySwap could not start its Windows web view. Install the Microsoft Edge WebView2 Runtime and reopen the app.\n\n{error.Message}",
                "KeySwap startup error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
            Close();
        }
    }

    private void HandleWebMessage(object? sender, CoreWebView2WebMessageReceivedEventArgs eventArgs)
    {
        string? requestId = null;
        try
        {
            using var message = JsonDocument.Parse(eventArgs.WebMessageAsJson);
            var root = message.RootElement;
            requestId = root.GetProperty("requestId").GetString();
            var type = root.GetProperty("type").GetString();

            object result = type switch
            {
                "get-status" => GetStatus(),
                "get-auth-redirect-url" => _authCallbackListener.Start(),
                "open-auth-url" => OpenExternalAuthUrl(root),
                "stop-remapping" => StopRemapping(),
                "apply-layout" => ApplyLayout(root.GetProperty("layout")),
                _ => throw new InvalidDataException("Unknown desktop action.")
            };

            Respond(requestId, result, null);
        }
        catch (Exception error)
        {
            if (!string.IsNullOrEmpty(requestId))
                Respond(requestId, null, error.Message);
        }
    }

    private static object OpenExternalAuthUrl(JsonElement request)
    {
        var urlValue = request.GetProperty("url").GetString();
        var projectUrlValue = request.GetProperty("projectUrl").GetString();
        if (!Uri.TryCreate(urlValue, UriKind.Absolute, out var authUri) ||
            !Uri.TryCreate(projectUrlValue, UriKind.Absolute, out var projectUri) ||
            authUri.Scheme != projectUri.Scheme ||
            !string.Equals(authUri.Host, projectUri.Host, StringComparison.OrdinalIgnoreCase) ||
            authUri.Port != projectUri.Port ||
            authUri.AbsolutePath != "/auth/v1/authorize" ||
            !string.IsNullOrEmpty(authUri.UserInfo) ||
            !string.IsNullOrEmpty(authUri.Fragment))
            throw new InvalidDataException("Supabase returned an invalid sign-in URL.");

        Process.Start(new ProcessStartInfo(authUri.ToString()) { UseShellExecute = true });
        return new { opened = true };
    }

    private void HandleAuthCallback(string? code, string? error)
    {
        if (IsDisposed || Disposing)
            return;

        if (InvokeRequired)
        {
            BeginInvoke(new Action(() => _ = ForwardAuthCallbackAsync(code, error)));
            return;
        }

        _ = ForwardAuthCallbackAsync(code, error);
    }

    private async Task ForwardAuthCallbackAsync(string? code, string? error)
    {
        try
        {
            if (_browser.CoreWebView2 is null)
                throw new InvalidOperationException("The KeySwap account page is not ready.");

            var callback = JsonSerializer.Serialize(new { code, error });
            await _browser.CoreWebView2.ExecuteScriptAsync(
                $"window.keySwapDesktop?.receiveAuthCallback({callback});");
        }
        catch (Exception exception)
        {
            MessageBox.Show(
                this,
                $"Could not return from email confirmation to KeySwap.\n\n{exception.Message}",
                "KeySwap sign-in",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
        }
    }

    private object GetStatus() => new
    {
        active = _remapper.IsActive,
        message = _remapper.IsActive
            ? "System-wide remapping is active. Re-apply after editing to sync changes."
            : "System-wide remapping is off."
    };

    private object StopRemapping()
    {
        _remapper.Stop();
        return new { active = false, message = "System-wide remapping is off." };
    }

    private object ApplyLayout(JsonElement layout)
    {
        var language = layout.GetProperty("language").GetString();
        var keysElement = layout.GetProperty("keys");
        if (string.IsNullOrWhiteSpace(language) || language.Length > 16 ||
            keysElement.ValueKind != JsonValueKind.Array)
            throw new InvalidDataException("The keyboard layout data is invalid.");

        var keys = new List<KeyAssignment>();
        foreach (var item in keysElement.EnumerateArray())
        {
            keys.Add(new KeyAssignment(
                item.GetProperty("id").GetString() ?? "",
                item.GetProperty("main").GetString() ?? "",
                item.GetProperty("alt").GetString() ?? ""));
        }

        var wasActive = _remapper.IsActive;
        if (wasActive)
            _remapper.Pause();

        DialogResult consent;
        try
        {
            consent = MessageBox.Show(
                this,
                "Apply the selected key assignments across Windows apps until you stop remapping or close KeySwap?",
                "Confirm system-wide keyboard remapping",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning,
                MessageBoxDefaultButton.Button2);
        }
        catch
        {
            if (wasActive)
                _remapper.Resume();
            throw;
        }
        if (consent != DialogResult.Yes)
        {
            if (wasActive)
                _remapper.Resume();
            return new
            {
                active = _remapper.IsActive,
                message = _remapper.IsActive
                    ? "The current mapping remains active; no new layout was applied."
                    : "No system-wide mapping was applied."
            };
        }

        try
        {
            _remapper.Apply(keys);
        }
        catch
        {
            if (wasActive)
                _remapper.Resume();
            throw;
        }
        return new
        {
            active = true,
            message = $"System-wide {language} layout is active. Re-apply after editing to sync changes."
        };
    }

    private void Respond(string? requestId, object? result, string? error)
    {
        if (string.IsNullOrEmpty(requestId) || _browser.CoreWebView2 is null)
            return;

        var response = JsonSerializer.Serialize(new { requestId, result, error }, JsonOptions);
        _browser.CoreWebView2.PostWebMessageAsJson(response);
    }
}
