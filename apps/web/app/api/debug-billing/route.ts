import { NextResponse } from 'next/server';

import * as z from 'zod';

export async function GET() {
  const checks: Record<string, unknown> = {};

  // Check env vars
  checks.STRIPE_SECRET_KEY_present = !!process.env.STRIPE_SECRET_KEY;
  checks.STRIPE_SECRET_KEY_prefix = process.env.STRIPE_SECRET_KEY?.substring(0, 7) + '...';
  checks.STRIPE_SECRET_KEY_length = process.env.STRIPE_SECRET_KEY?.length;
  checks.STRIPE_WEBHOOK_SECRET_present = !!process.env.STRIPE_WEBHOOK_SECRET;
  checks.STRIPE_WEBHOOK_SECRET_prefix = process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) + '...';
  checks.STRIPE_WEBHOOK_SECRET_length = process.env.STRIPE_WEBHOOK_SECRET?.length;
  checks.NEXT_PUBLIC_BILLING_PROVIDER = process.env.NEXT_PUBLIC_BILLING_PROVIDER;
  checks.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_present = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  // Replicate the same Zod schema as StripeServerEnvSchema
  const StripeServerEnvSchema = z
    .object({
      secretKey: z.string({ error: 'Missing STRIPE_SECRET_KEY' }).min(1),
      webhooksSecret: z.string({ error: 'Missing STRIPE_WEBHOOK_SECRET' }).min(1),
    })
    .refine(
      (schema) => {
        return schema.secretKey.startsWith('sk_') || schema.secretKey.startsWith('rk_');
      },
      { path: ['STRIPE_SECRET_KEY'], message: "Must start with 'sk_' or 'rk_'" },
    )
    .refine(
      (schema) => {
        return schema.webhooksSecret.startsWith('whsec_');
      },
      { path: ['STRIPE_WEBHOOK_SECRET'], message: "Must start with 'whsec_'" },
    );

  const result = StripeServerEnvSchema.safeParse({
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhooksSecret: process.env.STRIPE_WEBHOOK_SECRET,
  });

  if (result.success) {
    checks.stripe_env_schema = 'PASS';
  } else {
    checks.stripe_env_schema = 'FAIL';
    checks.stripe_env_issues = result.error.issues;
  }

  // Try Stripe API call if schema passes
  if (result.success) {
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(result.data.secretKey, {
        apiVersion: '2026-02-25.clover' as Parameters<typeof Stripe>[1]['apiVersion'],
      });

      const balance = await stripe.balance.retrieve();
      checks.stripe_api = 'OK';
      checks.stripe_currency = balance.available?.[0]?.currency;
    } catch (e) {
      checks.stripe_api_error = (e as Error).message;
    }
  }

  return NextResponse.json(checks, { status: 200 });
}
