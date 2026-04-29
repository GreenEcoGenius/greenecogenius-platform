import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { ContractSignatureService } from '~/lib/signature/contract-signature-service';

export async function POST(req: NextRequest) {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_MARKETPLACE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_MARKETPLACE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 },
    );
  }

  let event: import('stripe').Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const adminClient = getSupabaseServerAdminClient();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data
        .object as import('stripe').Stripe.PaymentIntent;
      const transactionId = paymentIntent.metadata?.transaction_id;

      if (!transactionId) break; // Not a marketplace payment

      // Update transaction
      // 
      await adminClient
        .from('marketplace_transactions')
        .update({
          payment_status: 'succeeded',
          status: 'paid',
          stripe_payment_intent_id: paymentIntent.id,
          stripe_charge_id: paymentIntent.latest_charge
            ? String(paymentIntent.latest_charge)
            : null,
          paid_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      // Get transaction details for wallet update
      // 
      const { data: tx } = await adminClient
        .from('marketplace_transactions')
        .select('seller_account_id, seller_amount, listing_id')
        .eq('id', transactionId)
        .single();

      if (tx) {
        // Add to seller's pending balance
        // 
        const { data: wallet } = await adminClient
          .from('wallet_balances')
          .select('id')
          .eq('account_id', tx.seller_account_id)
          .single();

        if (wallet) {
          // 
          await adminClient.rpc('increment_wallet_pending', {
            p_account_id: tx.seller_account_id,
            p_amount: tx.seller_amount,
          });
        } else {
          // Create wallet with pending balance
          // 
          await adminClient.from('wallet_balances').insert({
            account_id: tx.seller_account_id,
            pending_balance: tx.seller_amount,
            currency: 'eur',
          });
        }

        // Mark listing as sold
        // 
        await adminClient
          .from('listings')
          .update({ status: 'sold' })
          .eq('id', tx.listing_id);
      }

      // Log event
      // 
      await adminClient.from('transaction_events').insert({
        transaction_id: transactionId,
        event_type: 'payment_succeeded',
        actor_role: 'platform',
        metadata: {
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
        },
      });


      // ── Auto-send contract for signature via DocuSign ──
      try {
        if (ContractSignatureService.isConfigured()) {
          await ContractSignatureService.sendForSignature({
            adminClient,
            transactionId,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (adminClient as any).from('transaction_events').insert({
            transaction_id: transactionId,
            event_type: 'contract_sent',
            actor_role: 'platform',
            metadata: { trigger: 'auto_after_payment' },
          });
        }
      } catch (contractErr) {
        // Non-blocking: log but don't fail the webhook
        console.error('[webhook] Auto-send contract failed:', contractErr);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (adminClient as any).from('transaction_events').insert({
          transaction_id: transactionId,
          event_type: 'contract_send_failed',
          actor_role: 'platform',
          metadata: {
            error: contractErr instanceof Error ? contractErr.message : String(contractErr),
          },
        });
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data
        .object as import('stripe').Stripe.PaymentIntent;
      const transactionId = paymentIntent.metadata?.transaction_id;

      if (!transactionId) break;

      // 
      await adminClient
        .from('marketplace_transactions')
        .update({
          payment_status: 'failed',
          status: 'cancelled',
        })
        .eq('id', transactionId);

      // 
      await adminClient.from('transaction_events').insert({
        transaction_id: transactionId,
        event_type: 'payment_failed',
        actor_role: 'platform',
        metadata: {
          payment_intent_id: paymentIntent.id,
          failure_message:
            paymentIntent.last_payment_error?.message ?? 'Unknown error',
        },
      });

      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as import('stripe').Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id;

      if (!paymentIntentId) break;

      // 
      const { data: tx } = await adminClient
        .from('marketplace_transactions')
        .select('id, seller_account_id, seller_amount')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (tx) {
        // 
        await adminClient
          .from('marketplace_transactions')
          .update({
            payment_status: 'refunded',
            status: 'refunded',
          })
          .eq('id', tx.id);

        // 
        await adminClient.from('transaction_events').insert({
          transaction_id: tx.id,
          event_type: 'refund_issued',
          actor_role: 'platform',
          metadata: { charge_id: charge.id },
        });
      }

      break;
    }

    // ========================================
    // SUBSCRIPTION EVENTS
    // ========================================

    case 'checkout.session.completed': {
      const session = event.data
        .object as import('stripe').Stripe.Checkout.Session;

      // Only handle subscription checkouts
      if (session.mode !== 'subscription') break;

      const accountId = session.metadata?.account_id;
      const planId = session.metadata?.plan_id;
      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;
      const customerId =
        typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id;

      if (accountId && planId && subscriptionId) {
        // 
        await adminClient.from('organization_subscriptions').upsert(
          {
            account_id: accountId,
            plan_id: planId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: 'trialing',
          },
          { onConflict: 'account_id' },
        );
      }
      break;
    }

    case 'customer.subscription.updated': {
      // 
      const subscription = event.data.object as any;
      const stripeSubId = subscription.id as string;
      const status = subscription.status as string;

      const mappedStatus =
        status === 'active'
          ? 'active'
          : status === 'trialing'
            ? 'trialing'
            : status === 'past_due'
              ? 'past_due'
              : status === 'canceled' || status === 'unpaid'
                ? 'cancelled'
                : 'active';

      const updateData: Record<string, unknown> = { status: mappedStatus };

      if (subscription.current_period_start) {
        updateData.current_period_start = new Date(
          subscription.current_period_start * 1000,
        ).toISOString();
      }
      if (subscription.current_period_end) {
        updateData.current_period_end = new Date(
          subscription.current_period_end * 1000,
        ).toISOString();
      }

      // 
      await adminClient
        .from('organization_subscriptions')
        .update(updateData)
        .eq('stripe_subscription_id', stripeSubId);

      break;
    }

    case 'customer.subscription.deleted': {
      // 
      const subscription = event.data.object as any;

      // 
      await adminClient
        .from('organization_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      break;
    }

    case 'invoice.payment_succeeded': {
      // 
      const invoice = event.data.object as any;
      const stripeSubId = invoice.subscription
        ? String(invoice.subscription)
        : null;

      if (stripeSubId) {
        // 
        await adminClient
          .from('organization_subscriptions')
          .update({ status: 'active' })
          .eq('stripe_subscription_id', stripeSubId);
      }
      break;
    }

    case 'invoice.payment_failed': {
      // 
      const invoice = event.data.object as any;
      const stripeSubId = invoice.subscription
        ? String(invoice.subscription)
        : null;

      if (stripeSubId) {
        // 
        await adminClient
          .from('organization_subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', stripeSubId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
