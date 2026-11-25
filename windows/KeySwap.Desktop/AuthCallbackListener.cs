using System.Net;
using System.Net.Sockets;
using System.Text;

namespace KeySwap.Desktop;

internal sealed class AuthCallbackListener : IDisposable
{
    private const int CallbackPort = 54123;
    private const string CallbackPath = "/auth/callback";
    private readonly TcpListener _listener = new(IPAddress.Loopback, CallbackPort);
    private CancellationTokenSource? _cancellation;

    public event Action<string?, string?>? CallbackReceived;

    public string Start()
    {
        if (_cancellation is null)
        {
            _listener.Start();
            _cancellation = new CancellationTokenSource();
            _ = ListenAsync(_cancellation.Token);
        }

        return $"http://127.0.0.1:{CallbackPort}{CallbackPath}";
    }

    private async Task ListenAsync(CancellationToken cancellationToken)
    {
        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                using var client = await _listener.AcceptTcpClientAsync(cancellationToken);
                await HandleRequestAsync(client, cancellationToken);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (ObjectDisposedException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception exception) when (!cancellationToken.IsCancellationRequested)
        {
            CallbackReceived?.Invoke(null, $"The local email-confirmation listener stopped: {exception.Message}");
        }
    }

    private async Task HandleRequestAsync(TcpClient client, CancellationToken cancellationToken)
    {
        using var stream = client.GetStream();
        using var reader = new StreamReader(
            stream,
            Encoding.ASCII,
            detectEncodingFromByteOrderMarks: false,
            bufferSize: 1024,
            leaveOpen: true);

        var requestLine = await reader.ReadLineAsync(cancellationToken);
        while (!string.IsNullOrEmpty(await reader.ReadLineAsync(cancellationToken)))
        {
        }

        var parts = requestLine?.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts is not { Length: >= 2 } || parts[0] != "GET" ||
            !parts[1].StartsWith("/", StringComparison.Ordinal) ||
            !Uri.TryCreate(new Uri($"http://127.0.0.1:{CallbackPort}"), parts[1], out var uri) ||
            uri.AbsolutePath != CallbackPath)
        {
            await WriteResponseAsync(stream, "404 Not Found", "This is not a KeySwap confirmation URL.", cancellationToken);
            return;
        }

        var code = GetQueryValue(uri, "code");
        var error = GetQueryValue(uri, "error_description") ?? GetQueryValue(uri, "error");
        if (code is { Length: > 0 and <= 8192 } && !code.Any(char.IsControl))
        {
            await WriteResponseAsync(
                stream,
                "200 OK",
                "Email confirmation received. Return to KeySwap to finish signing in; you may close this tab.",
                cancellationToken);
            CallbackReceived?.Invoke(code, null);
            return;
        }

        if (!string.IsNullOrWhiteSpace(error) && error.Length <= 2048)
        {
            await WriteResponseAsync(
                stream,
                "200 OK",
                "Email confirmation could not be completed. Return to KeySwap for details.",
                cancellationToken);
            CallbackReceived?.Invoke(null, error);
            return;
        }

        await WriteResponseAsync(
            stream,
            "400 Bad Request",
            "This confirmation link is incomplete. Return to KeySwap and request a new email.",
            cancellationToken);
    }

    private static string? GetQueryValue(Uri uri, string name)
    {
        foreach (var part in uri.Query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var pair = part.Split('=', 2);
            var key = Uri.UnescapeDataString(pair[0].Replace('+', ' '));
            if (!string.Equals(key, name, StringComparison.Ordinal))
                continue;

            return pair.Length == 2
                ? Uri.UnescapeDataString(pair[1].Replace('+', ' '))
                : string.Empty;
        }

        return null;
    }

    private static async Task WriteResponseAsync(
        NetworkStream stream,
        string status,
        string message,
        CancellationToken cancellationToken)
    {
        var body = Encoding.UTF8.GetBytes(
            $"<!doctype html><meta charset=\"utf-8\"><title>KeySwap</title><p>{WebUtility.HtmlEncode(message)}</p>");
        var headers = Encoding.ASCII.GetBytes(
            $"HTTP/1.1 {status}\r\nContent-Type: text/html; charset=utf-8\r\n" +
            $"Content-Length: {body.Length}\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n");
        await stream.WriteAsync(headers, cancellationToken);
        await stream.WriteAsync(body, cancellationToken);
        await stream.FlushAsync(cancellationToken);
    }

    public void Dispose()
    {
        _cancellation?.Cancel();
        _listener.Stop();
        _cancellation?.Dispose();
    }
}
