'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { authActionClient } from '@kit/next/safe-action';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  ContractSignatureService,
} from '~/lib/signature/contract-signature-service';
import {
  DocuSignConsentRequiredError,
  DocuSignNotConfiguredError,
} from '~/lib/signature/docusign-client';

const SendForSignatureSchema = z.object({
  transactionId: z.string().uuid(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const any_ = (v: unknown) => v as any;

export const sendContractForSignature = authActionClient
  .inputSchema(SendForSignatureSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    // 1. Authorize: the caller must be either the buyer or the seller on
    //    this transaction. We use the RLS-enforced server client for the
    //    authorization read so a user cannot trigger signature on someone
    //    else's transaction even if they guess the id.
    const client = getSupabaseServerClient();

    const { data: tx, error: loadError } = await any_(client)
      .from('marketplace_transactions')
      .select('id, buyer_account_id, seller_account_id, status')
      .eq('id', parsedInput.transactionId)
      .single();

    if (loadError || !tx) {
      throw new Error('Transaction introuvable ou acces refuse.');
    }

    if (
      tx.buyer_account_id !== user.id &&
      tx.seller_account_id !== user.id
    ) {
      throw new Error('Seuls le vendeur ou l\'acheteur peuvent declencher la signature.');
    }

    // 2. Do the actual work with the admin client (writes to storage bucket
    //    that has no authenticated INSERT policy + needs service role).
    const adminClient = getSupabaseServerAdminClient();

    try {
      const result = await ContractSignatureService.sendForSignature({
        adminClient,
        transactionId: parsedInput.transactionId,
      });

      revalidatePath(`/home/transactions/${parsedInput.transactionId}`);
      revalidatePath('/home/marketplace');

      return { success: true, ...result };
    } catch (err) {
      if (err instanceof DocuSignConsentRequiredError) {
        throw new Error(
          `Consentement DocuSign requis. L'administrateur doit visiter ${err.consentUrl} une seule fois pour autoriser le compte de service.`,
        );
      }
      if (err instanceof DocuSignNotConfiguredError) {
        throw new Error(err.message);
      }
      throw err;
    }
  });
