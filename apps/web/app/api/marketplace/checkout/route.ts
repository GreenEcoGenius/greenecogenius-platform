import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import appConfig from '~/config/app.config';

const CheckoutSchema = z.object({
  listingId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CheckoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { listingId } = parsed.data;
  const adminClient = getSupabaseServerAdminClient();

  // Fetch the listing
  const { data: listing } = await client
    .from('listings')
    .select('*, material_categories(name_fr)')
    .eq('id', listingId)
    .eq('status', 'active')
    .single();

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  // Don't allow buying own listing
  if (listing.account_id === user.id) {
    return NextResponse.json(
      { error: 'Cannot buy your own listing' },
      { status: 400 },
    );
  }

  // Check seller has a connected Stripe account
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sellerConnect } = await (adminClient as any)
    .from('stripe_connected_accounts')
    .select('stripe_account_id, onboarding_complete, charges_enabled')
    .eq('account_id', listing.account_id)
    .single();

  if (!sellerConnect?.onboarding_complete || !sellerConnect?.charges_enabled) {
    return NextResponse.json(
      { error: 'Seller has not completed payment setup' },
      { status: 400 },
    );
  }

  // Get commission rate from config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: config } = await (adminClient as any)
    .from('marketplace_config')
    .select('commission_rate')
    .limit(1)
    .single();

  const commissionRate = config?.commission_rate ?? 0.2;

  // Calculate amounts (in cents)
  const pricePerUnit = listing.price_per_unit ?? 0;
  const materialAmount = Math.round(pricePerUnit * listing.quantity * 100);
  const rawTransport = (listing as Record<string, unknown>).transport_price;
  const transportAmount =
    typeof rawTransport === 'number' ? Math.round(rawTransport * 100) : 0;

  const totalAmount = materialAmount + transportAmount;

  if (totalAmount <= 0) {
    return NextResponse.json(
      { error: 'This listing has no price set' },
      { status: 400 },
    );
  }

  const platformFee = Math.round(totalAmount * Number(commissionRate));
  const sellerAmount = totalAmount - platformFee;

  // Create the marketplace transaction record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: transaction, error: txError } = await (adminClient as any)
    .from('marketplace_transactions')
    .insert({
      listing_id: listingId,
      seller_account_id: listing.account_id,
      buyer_account_id: user.id,
      total_amount: totalAmount,
      platform_fee: platformFee,
      seller_amount: sellerAmount,
      transport_amount: transportAmount,
      currency: listing.currency.toLowerCase(),
      commission_rate: commissionRate,
      status: 'pending_payment',
      payment_status: 'pending',
    })
    .select('id')
    .single();

  if (txError || !transaction) {
    console.error('Failed to create transaction:', txError);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 },
    );
  }

  // Log event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient as any).from('transaction_events').insert({
    transaction_id: transaction.id,
    event_type: 'payment_created',
    actor_account_id: user.id,
    actor_role: 'buyer',
    metadata: { listing_id: listingId, total_amount: totalAmount },
  });

  // Create Stripe PaymentIntent — Separate Charges and Transfers
  // Money goes to platform first, transferred to seller after delivery confirmation
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  type LineItem = {
    price_data: {
      currency: string;
      product_data: { name: string; description?: string };
      unit_amount: number;
    };
    quantity: number;
  };

  const lineItems: LineItem[] = [];

  if (materialAmount > 0) {
    lineItems.push({
      price_data: {
        currency: listing.currency.toLowerCase(),
        product_data: {
          name: listing.title,
          description: `${listing.quantity} ${listing.unit} — ${listing.material_categories?.name_fr ?? ''}`,
        },
        unit_amount: materialAmount,
      },
      quantity: 1,
    });
  }

  if (transportAmount > 0) {
    lineItems.push({
      price_data: {
        currency: listing.currency.toLowerCase(),
        product_data: {
          name: 'Frais de transport / collecte',
          description: `Transport pour ${listing.title}`,
        },
        unit_amount: transportAmount,
      },
      quantity: 1,
    });
  }

  const returnUrl = new URL(
    `/home/marketplace/${listingId}/confirmation?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transaction.id}`,
    appConfig.url,
  ).toString();

  // Use Checkout Session (NOT PaymentIntent directly) for embedded UI
  // Money stays on platform account — no transfer_data here (Separate Charges pattern)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ui_mode: 'embedded',
    line_items: lineItems,
    customer_email: user.email,
    client_reference_id: user.id,
    return_url: returnUrl,
    payment_intent_data: {
      transfer_group: transaction.id,
      metadata: {
        transaction_id: transaction.id,
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: listing.account_id,
        seller_stripe_account: sellerConnect.stripe_account_id,
        seller_amount: sellerAmount.toString(),
        platform_fee: platformFee.toString(),
      },
    },
    metadata: {
      transaction_id: transaction.id,
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.account_id,
    },
  });

  // Store PaymentIntent ID
  if (session.payment_intent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('marketplace_transactions')
      .update({
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id,
      })
      .eq('id', transaction.id);
  }

  return NextResponse.json({
    checkoutToken: session.client_secret,
    transactionId: transaction.id,
  });
}
