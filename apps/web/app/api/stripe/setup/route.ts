import { NextResponse } from 'next/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

export async function POST() {
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Create Essentiel product + prices
  const essentielProduct = await stripe.products.create({
    name: 'GreenEcoGenius — Plan Essentiel',
    description:
      'Bilan carbone Scope 1 & 2, dashboard ESG, rapport GHG Protocol, 50 lots tracés/mois',
  });

  const essentielMonthly = await stripe.prices.create({
    product: essentielProduct.id,
    unit_amount: 14900,
    currency: 'eur',
    recurring: { interval: 'month' },
  });

  const essentielAnnual = await stripe.prices.create({
    product: essentielProduct.id,
    unit_amount: 148800,
    currency: 'eur',
    recurring: { interval: 'year' },
  });

  // Create Avancé product + prices
  const avanceProduct = await stripe.products.create({
    name: 'GreenEcoGenius — Plan Avancé',
    description:
      'Bilan carbone Scope 1, 2 & 3, rapport CSRD/GRI, recommandations IA, lots illimités, API',
  });

  const avanceMonthly = await stripe.prices.create({
    product: avanceProduct.id,
    unit_amount: 44900,
    currency: 'eur',
    recurring: { interval: 'month' },
  });

  const avanceAnnual = await stripe.prices.create({
    product: avanceProduct.id,
    unit_amount: 448800,
    currency: 'eur',
    recurring: { interval: 'year' },
  });

  // Update database
  const adminClient = getSupabaseServerAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient as any)
    .from('subscription_plans')
    .update({
      stripe_product_id: essentielProduct.id,
      stripe_price_id_monthly: essentielMonthly.id,
      stripe_price_id_annual: essentielAnnual.id,
    })
    .eq('name', 'essentiel');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient as any)
    .from('subscription_plans')
    .update({
      stripe_product_id: avanceProduct.id,
      stripe_price_id_monthly: avanceMonthly.id,
      stripe_price_id_annual: avanceAnnual.id,
    })
    .eq('name', 'avance');

  return NextResponse.json({
    essentiel: {
      product: essentielProduct.id,
      monthly: essentielMonthly.id,
      annual: essentielAnnual.id,
    },
    avance: {
      product: avanceProduct.id,
      monthly: avanceMonthly.id,
      annual: avanceAnnual.id,
    },
  });
}
