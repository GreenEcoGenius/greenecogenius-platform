import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

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

  // Calculate total
  const pricePerUnit = listing.price_per_unit ?? 0;
  const totalAmount = Math.round(pricePerUnit * listing.quantity * 100); // in cents
  const rawTransport = (listing as Record<string, unknown>).transport_price;
  const transportAmount =
    typeof rawTransport === 'number' ? Math.round(rawTransport * 100) : 0;

  if (totalAmount <= 0 && transportAmount <= 0) {
    return NextResponse.json(
      { error: 'This listing has no price set' },
      { status: 400 },
    );
  }

  // Create Stripe checkout session directly
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  type LineItem = {
    price_data: {
      currency: string;
      product_data: { name: string; description: string };
      unit_amount: number;
    };
    quantity: number;
  };

  const lineItems: LineItem[] = [];

  if (totalAmount > 0) {
    lineItems.push({
      price_data: {
        currency: listing.currency.toLowerCase(),
        product_data: {
          name: listing.title,
          description: `${listing.quantity} ${listing.unit} — ${listing.material_categories?.name_fr ?? ''}`,
        },
        unit_amount: totalAmount,
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
    `/home/marketplace/${listingId}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    appConfig.url,
  ).toString();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ui_mode: 'embedded',
    line_items: lineItems,
    customer_email: user.email,
    client_reference_id: user.id,
    return_url: returnUrl,
    metadata: {
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.account_id,
    },
  });

  return NextResponse.json({ checkoutToken: session.client_secret });
}
