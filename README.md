# KeySwap

KeySwap is a keyboard layout studio with a browser editor and a Windows desktop
app. Choose US, UK, German, French, Spanish, Italian, Dutch (US-International), Swedish, or
Brazilian Portuguese legends on the 77-key ANSI canvas; press a physical key
to highlight its position, select a key to edit its main or alternate legend,
or select two keys in sequence to swap their assignments. Choose Midnight,
Sage, Paper, Ocean, Amethyst, or Ember styling. Arabic 101 uses right-to-left
legends while keeping physical key positions left-to-right. Layouts and theme
preferences are saved locally on the device.

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
The portable Windows desktop bundle is local-first; account confirmation and
Stripe return links require the separately served web version and are not
available in the desktop bundle.
The repository contains no provider credentials and none should be committed.

1. Create a Supabase project, enable email/password sign-in, and add the app's
   origin to the Auth URL configuration and redirect allow-list.
2. Put the Supabase project URL and **publishable/anon key** in `config.js`.
   This key is intended for browser use; never put the service-role key or a
   Stripe secret in that file.
3. Link the Supabase CLI to the project with
   `supabase link --project-ref <project-ref>`, then apply the migration with
   `supabase db push`. It creates user-owned saved layouts, subscriptions, RLS
   policies, and a database trigger that enforces the five-layout free cap.
4. Create an active recurring price in Stripe and enable the Stripe customer
   portal. Deploy the Edge Functions with
   `supabase functions deploy create-checkout-session`,
   `supabase functions deploy create-portal-session`, and
   `supabase functions deploy stripe-webhook`, then configure the Stripe
   webhook endpoint
   `https://<project-ref>.supabase.co/functions/v1/stripe-webhook` for
   `checkout.session.completed` and
   `customer.subscription.created`, `updated`, and `deleted`.
5. Add these values to Supabase Edge Function secrets using the dashboard or a
   trusted local CLI session: `APP_BASE_URL` (the exact app origin),
   `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` (the recurring Price ID), and
   `STRIPE_WEBHOOK_SECRET`. Supabase supplies `SUPABASE_URL`,
   `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions.

The browser disables cloud actions when Supabase isn't configured. It also
prevents the sixth free save in the UI, while the database trigger independently
enforces that limit for direct API requests. Stripe subscription status is
updated only from verified webhook events. The browser loads the Supabase
client from its public CDN only when account configuration is present, so those
features require network access.