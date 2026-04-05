'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@kit/next/safe-action';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { evaluateAccountCompliance } from '~/lib/compliance/compliance-engine';
import { ExternalActivitiesService } from '~/lib/services/external-activities-service';

import {
  CreateExternalActivitySchema,
  DeleteExternalActivitySchema,
} from '../external-activity.schema';

export const createExternalActivity = authActionClient
  .inputSchema(CreateExternalActivitySchema)
  .action(async ({ parsedInput: input, ctx: { user } }) => {
    const client = getSupabaseServerClient();

    const activity = await ExternalActivitiesService.create(
      client,
      user.id,
      input,
    );

    // Recalculate compliance so the new activity immediately reflects in the
    // ISO 26000 / CSRD / B Corp / Lucie / devoir-vigilance scores.
    try {
      const adminClient = getSupabaseServerAdminClient();
      await evaluateAccountCompliance(adminClient, user.id);
    } catch {
      // Non-blocking — the user can still recalc manually from /home/compliance
    }

    revalidatePath('/home/external-activities');
    revalidatePath('/home/compliance');

    return { success: true, id: activity.id };
  });

export const deleteExternalActivity = authActionClient
  .inputSchema(DeleteExternalActivitySchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const client = getSupabaseServerClient();

    await ExternalActivitiesService.delete(client, user.id, parsedInput.id);

    try {
      const adminClient = getSupabaseServerAdminClient();
      await evaluateAccountCompliance(adminClient, user.id);
    } catch {
      // Non-blocking
    }

    revalidatePath('/home/external-activities');
    revalidatePath('/home/compliance');

    return { success: true };
  });
