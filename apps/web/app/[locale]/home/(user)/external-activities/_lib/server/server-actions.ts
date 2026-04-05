'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@kit/next/safe-action';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { ExternalActivitiesService } from '~/lib/services/external-activities-service';

import {
  CreateExternalActivitySchema,
  DeleteExternalActivitySchema,
} from '../external-activity.schema';

export const createExternalActivity = authActionClient
  .inputSchema(CreateExternalActivitySchema)
  .action(async ({ parsedInput: input }) => {
    const client = getSupabaseServerClient();
    const { data: user, error } = await requireUser(client);
    if (error || !user) throw new Error('Unauthorized');

    const activity = await ExternalActivitiesService.create(
      client,
      user.id,
      input,
    );

    revalidatePath('/home/external-activities');
    revalidatePath('/home/compliance');

    return { success: true, id: activity.id };
  });

export const deleteExternalActivity = authActionClient
  .inputSchema(DeleteExternalActivitySchema)
  .action(async ({ parsedInput }) => {
    const client = getSupabaseServerClient();
    const { data: user, error } = await requireUser(client);
    if (error || !user) throw new Error('Unauthorized');

    await ExternalActivitiesService.delete(client, user.id, parsedInput.id);

    revalidatePath('/home/external-activities');
    revalidatePath('/home/compliance');

    return { success: true };
  });
