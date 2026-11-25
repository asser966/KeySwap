# KeySwap

KeySwap is a keyboard layout studio with a browser editor and a Windows desktop
app. Choose US, UK, German, French, Spanish, Italian, Dutch (US-International), Swedish, or
Brazilian Portuguese legends on the 77-key ANSI canvas; press a physical key
to highlight its position, select a key to edit its main or alternate legend,
or select two keys in sequence to swap their assignments. Choose Midnight,
Sage, Paper, Ocean, Amethyst, Ember, Slate, Rose, or High contrast styling.
Arabic 101 uses right-to-left legends while keeping physical key positions
left-to-right. Layouts and theme preferences are saved locally on the device.

Regional legends are shown on ANSI physical positions. Layouts designed for
ISO/ABNT2 keyboards are represented on the same ANSI canvas, so keys unique to
those physical standards are not added.

Open `index.html` in a modern browser to use the visual editor. The browser
preview does not change typing in other apps. On Windows, build and run the
desktop app to apply the selected layout system-wide:

1. Install the .NET 10 SDK and the Microsoft Edge WebView2 Runtime
   (https://developer.microsoft.com/microsoft-edge/webview2/).
2. From the repository root, run
   `.\windows\package-windows.cmd`.
3. Extract `artifacts\KeySwap-win-x64.zip` and run `KeySwap.exe`.
4. Choose a language or edit key assignments, then click **Apply system-wide**
   and confirm the Windows prompt. Click **Stop remapping** or close KeySwap to
   restore the normal mapping.

The Windows app uses a temporary low-level keyboard hook and Unicode key
injection; it does not modify the registry, install a keyboard driver, or
change Windows language settings. The hook applies only while the app runs.
Control, Alt, and Windows shortcuts pass through unchanged. Only letters,
digits, punctuation, and Space are
remapped; Escape, Tab, Backspace, Enter, modifier, function, and navigation
keys keep their normal behavior. The editor's alternate legend is mapped to
Shift. AltGr/third-level symbols are not modeled.
Windows secure screens (such as UAC prompts) and elevated applications may
ignore injected text. The app package is self-contained for .NET but requires
the WebView2 Runtime.

For browser account features, serve the web version from an HTTP(S) origin (not
`file://`) and use that exact origin for Supabase Auth redirects and
`APP_BASE_URL`.

## Accounts and subscriptions

The app is wired to Supabase Auth (email/password), Supabase Edge Functions,
and Stripe Checkout/Billing Portal. The login/signup UI and local keyboard
editor work without credentials, but real accounts, cloud saves, and billing
remain disabled until a Supabase project and Stripe product are configured.
Browser sign-up uses Supabase's PKCE email-confirmation flow. The Windows app
uses the same Supabase account and a temporary loopback callback at
`http://127.0.0.1:54123/auth/callback`; keep KeySwap open and open the email
confirmation or OAuth link on the same device. Google, Microsoft, and GitHub
sign-in use the default browser in the Windows app and return through that
callback.
Stripe return flows remain web-version features and are not available in the
portable desktop bundle.
The repository contains no provider credentials and none should be committed.

1. Create a Supabase project, enable email/password sign-in and TOTP MFA, and
   set the Site URL to your production web origin. Add the browser's redirect
   pattern to Auth > URL Configuration. For local web testing, use
   `http://127.0.0.1:8765/**`; for production, use
   `https://<your-domain>/**`. Add
   `http://127.0.0.1:54123/auth/callback` to the same allow-list for Windows
   email confirmation and OAuth returns.
2. To enable social sign-in, configure Google, Azure (Microsoft), and GitHub
   under Auth > Providers. Register the provider callback URL shown by
   Supabase with each provider and keep their client credentials in Supabase's
   provider settings, never in `config.js`. Microsoft sign-in uses Supabase's
   `azure` provider and requests the `email` scope. A provider button supports
   both new account creation and returning-user login. Until the project config
   and provider are set up, social sign-in remains unavailable or shows the
   provider's setup error.
3. Put the Supabase project URL and **publishable/anon key** in `config.js`:
   ```js
   window.KEYSWAP_CONFIG = Object.freeze({
     supabaseUrl: 'https://<project-ref>.supabase.co',
     supabaseAnonKey: '<publishable-or-anon-key>'
   });
   ```
   For a packaged Windows app, make the same edit in `wwwroot/config.js` in
   the extracted app folder instead (or set it before packaging). This key is
   intended for client use; never put the service-role key or a Stripe secret
   in either file.
4. Link the Supabase CLI to the project with
   `supabase link --project-ref <project-ref>`, then apply the migration with
   `supabase db push`. The migrations create user-owned saved layouts,
   subscriptions, RLS policies requiring AAL2 for protected cloud actions, and
   a database trigger that enforces the five-layout free cap.
5. Create an active recurring price in Stripe and enable the Stripe customer
   portal. Deploy the Edge Functions with
   `supabase functions deploy create-checkout-session`,
   `supabase functions deploy create-portal-session`, and
   `supabase functions deploy stripe-webhook`, then configure the Stripe
   webhook endpoint
   `https://<project-ref>.supabase.co/functions/v1/stripe-webhook` for
   `checkout.session.completed` and
   `customer.subscription.created`, `updated`, and `deleted`.
6. Add these values to Supabase Edge Function secrets using the dashboard or a
   trusted local CLI session: `APP_BASE_URL` (the exact app origin),
   `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` (the recurring Price ID), and
   `STRIPE_WEBHOOK_SECRET`. Supabase supplies `SUPABASE_URL`,
   `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions.

Sign-up and sign-in stay disabled until a Supabase project URL and publishable
key are configured; with the blank checked-in config, they cannot authenticate.
Enable the email provider for password sign-up/login in the Supabase dashboard.
The browser version must be served from HTTP(S), not
opened as `file://`. Desktop email confirmation works only while KeySwap is
running and the configured loopback port is available; errors are shown in
the app rather than treating an incomplete confirmation as success.
After email, Google, Microsoft, or GitHub sign-in, users must enroll an
authenticator app or verify an existing TOTP code before saved layouts and
billing are available.
The QR setup secret is held only in the open page while enrollment is pending;
it is never written to browser storage or logs. Enable TOTP under Supabase
Auth > MFA and leave at least one factor slot available. OAuth provider
credentials and Stripe secrets belong only in Supabase's provider settings
and Edge Function secrets, respectively.

The browser disables cloud actions when Supabase isn't configured. It also
prevents the sixth free save in the UI, while the database trigger independently
enforces that limit for direct API requests. Stripe subscription status is
updated only from verified webhook events. The browser loads the Supabase
client from its public CDN only when account configuration is present, so those
features require network access.