import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno';
import { requireAal2User } from '../_shared/auth.ts';
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

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return handleOptions(request);
  try {
    rejectUnexpectedOrigin(request);
    if (request.method !== 'POST') return jsonResponse(request, { error: 'Method not allowed' }, 405);

    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const authorization = await requireAal2User(request);
    if (!authorization.user)
      return jsonResponse(request, { error: authorization.error }, authorization.status);
    const { user } = authorization;

    const admin = createClient(supabaseUrl, requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: subscription, error } = await admin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw new Error('Could not check subscription status');
    if (!subscription?.stripe_customer_id) {
      return jsonResponse(request, { error: 'No Stripe customer is linked to this account' }, 404);
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: requiredEnv('APP_BASE_URL')
    });
    return jsonResponse(request, { url: portal.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Billing portal could not be opened';
    console.error('create-portal-session failed:', message);
    return jsonResponse(request, { error: message }, 400);
  }
});
