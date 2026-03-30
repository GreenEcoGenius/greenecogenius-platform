import 'server-only';
import { StripeServerEnvSchema } from '../schema/stripe-server-env.schema';

const STRIPE_API_VERSION = '2026-02-25.clover';

/**
 * @description returns a Stripe instance
 */
export async function createStripeClient() {
  const { default: Stripe } = await import('stripe');

  // Parse the environment variables and validate them
  const rawEnv = {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhooksSecret: process.env.STRIPE_WEBHOOK_SECRET,
  };

  const result = StripeServerEnvSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error('[Stripe] Env validation failed:', JSON.stringify(result.error.issues));
    console.error('[Stripe] secretKey present:', !!rawEnv.secretKey, 'starts with sk_:', rawEnv.secretKey?.startsWith('sk_'));
    console.error('[Stripe] webhooksSecret present:', !!rawEnv.webhooksSecret, 'starts with whsec_:', rawEnv.webhooksSecret?.startsWith('whsec_'));

    throw result.error;
  }

  const stripeServerEnv = result.data;

  return new Stripe(stripeServerEnv.secretKey, {
    apiVersion: STRIPE_API_VERSION,
  });
}
