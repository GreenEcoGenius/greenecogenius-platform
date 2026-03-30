'use server';

import { redirect } from 'next/navigation';

import { authActionClient } from '@kit/next/safe-action';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import featureFlagsConfig from '~/config/feature-flags.config';

import { PersonalAccountCheckoutSchema } from '../schema/personal-account-checkout.schema';
import { createUserBillingService } from './user-billing.service';

/**
 * @name enabled
 * @description This feature flag is used to enable or disable personal account billing.
 */
const enabled = featureFlagsConfig.enablePersonalAccountBilling;

/**
 * @name createPersonalAccountCheckoutSession
 * @description Creates a checkout session for a personal account.
 */
export const createPersonalAccountCheckoutSession = authActionClient
  .inputSchema(PersonalAccountCheckoutSchema)
  .action(async ({ parsedInput: data }) => {
    if (!enabled) {
      throw new Error('Personal account billing is not enabled');
    }

    console.log('[BILLING DEBUG] Step 1: Input received', JSON.stringify(data));
    console.log('[BILLING DEBUG] Step 2: STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY);
    console.log('[BILLING DEBUG] Step 2: STRIPE_SECRET_KEY starts with sk_:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_'));
    console.log('[BILLING DEBUG] Step 2: STRIPE_WEBHOOK_SECRET present:', !!process.env.STRIPE_WEBHOOK_SECRET);
    console.log('[BILLING DEBUG] Step 2: STRIPE_WEBHOOK_SECRET starts with whsec_:', process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_'));

    try {
      const client = getSupabaseServerClient();
      console.log('[BILLING DEBUG] Step 3: Supabase client created');

      const service = createUserBillingService(client);
      console.log('[BILLING DEBUG] Step 4: Billing service created');

      const result = await service.createCheckoutSession(data);
      console.log('[BILLING DEBUG] Step 5: Checkout session created successfully');

      return result;
    } catch (error) {
      console.error('[BILLING DEBUG] Error caught:', error);
      console.error('[BILLING DEBUG] Error name:', (error as Error).name);
      console.error('[BILLING DEBUG] Error message:', (error as Error).message);

      if ((error as Error).name === 'ZodError') {
        console.error('[BILLING DEBUG] ZodError issues:', JSON.stringify((error as { issues?: unknown[] }).issues));
      }

      throw error;
    }
  });

/**
 * @name createPersonalAccountBillingPortalSession
 * @description Creates a billing Portal session for a personal account
 */
export const createPersonalAccountBillingPortalSession =
  authActionClient.action(async () => {
    if (!enabled) {
      throw new Error('Personal account billing is not enabled');
    }

    const client = getSupabaseServerClient();
    const service = createUserBillingService(client);

    // get url to billing portal
    const url = await service.createBillingPortalSession();

    redirect(url);
  });
