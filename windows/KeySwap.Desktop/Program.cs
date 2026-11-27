using System.Windows.Forms;

namespace KeySwap.Desktop;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        using var appMutex = new Mutex(true, @"Local\KeySwap.Desktop.Singleton", out var isFirstInstance);
        if (!isFirstInstance)
        {
            MessageBox.Show(
                "KeySwap is already running. Use the existing window to manage system-wide remapping.",
                "KeySwap",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
            return;
        }

        ApplicationConfiguration.Initialize();
        Application.Run(new MainForm());
    }
}
