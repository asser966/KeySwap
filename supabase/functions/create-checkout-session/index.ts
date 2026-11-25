import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno';
import {
  handleOptions,
  jsonResponse,
  rejectUnexpectedOrigin,
  requiredEnv
} from '../_shared/http.ts';

const stripe = new Stripe(requiredEnv('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia',
  httpClient: Stripe.createFetchHttpClient()
});

function authenticatedUser(request: Request) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) throw new Error('Sign in to continue');
  const supabase = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return supabase.auth.getUser();
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  try {
    rejectUnexpectedOrigin(request);
    if (request.method !== 'POST') return jsonResponse(request, { error: 'Method not allowed' }, 405);

    const { data: { user }, error: authError } = await authenticatedUser(request);
    if (authError || !user) return jsonResponse(request, { error: 'Sign in to continue' }, 401);

    const admin = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: existing, error: subscriptionError } = await admin
      .from('subscriptions')
      .select('status, stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (subscriptionError) throw new Error('Could not check subscription status');
    if (existing && ['active', 'trialing'].includes(existing.status)) {
      return jsonResponse(request, { error: 'An active Pro subscription already exists' }, 409);
    }

    const price = await stripe.prices.retrieve(requiredEnv('STRIPE_PRICE_ID'));
    if (!price.active || price.type !== 'recurring') {
      throw new Error('STRIPE_PRICE_ID must refer to an active recurring Stripe price');
    }

    const appUrl = new URL(requiredEnv('APP_BASE_URL'));
    const successUrl = new URL(appUrl);
    successUrl.searchParams.set('billing', 'success');
    const cancelUrl = new URL(appUrl);
    cancelUrl.searchParams.set('billing', 'cancelled');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id },
      subscription_data: { metadata: { supabase_user_id: user.id } },
      ...(existing?.stripe_customer_id
        ? { customer: existing.stripe_customer_id }
        : { customer_email: user.email ?? undefined })
    });

    if (!session.url) throw new Error('Stripe did not return a checkout URL');
    return jsonResponse(request, { url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout could not be started';
    console.error('create-checkout-session failed:', message);
    return jsonResponse(request, { error: message }, 400);
  }
});
