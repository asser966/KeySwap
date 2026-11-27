import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno';
import { requiredEnv } from '../_shared/http.ts';

const stripe = new Stripe(requiredEnv('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia',
  httpClient: Stripe.createFetchHttpClient()
});

const admin = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function saveSubscription(
  subscription: Stripe.Subscription,
  eventCreated: number,
  fallbackUserId?: string
) {
  const userId = subscription.metadata.supabase_user_id || fallbackUserId;
  if (!userId) {
    console.warn('Ignoring subscription event without KeySwap user metadata');
    return;
  }
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;
  const { error } = await admin.rpc('apply_stripe_subscription_event', {
    p_user_id: userId,
    p_stripe_customer_id: customerId,
    p_stripe_subscription_id: subscription.id,
    p_status: subscription.status,
    p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    p_cancel_at_period_end: subscription.cancel_at_period_end,
    p_event_created: eventCreated
  });
  if (error) throw new Error('Could not update the subscription record');
}

Deno.serve(async request => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('Missing Stripe signature', { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      requiredEnv('STRIPE_WEBHOOK_SECRET'),
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch {
    console.error('stripe-webhook signature verification failed');
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const checkout = event.data.object as Stripe.Checkout.Session;
      if (checkout.mode === 'subscription' && checkout.subscription) {
        const subscriptionId = typeof checkout.subscription === 'string'
          ? checkout.subscription
          : checkout.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await saveSubscription(
          subscription,
          event.created,
          checkout.metadata?.supabase_user_id ?? undefined
        );
      }
    } else if ([
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted'
    ].includes(event.type)) {
      const eventSubscription = event.data.object as Stripe.Subscription;
      const currentSubscription = await stripe.subscriptions.retrieve(eventSubscription.id);
      await saveSubscription(currentSubscription, event.created);
    }

    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook could not be processed';
    console.error('stripe-webhook processing failed:', message);
    return new Response('Webhook processing failed', { status: 500 });
  }
});
