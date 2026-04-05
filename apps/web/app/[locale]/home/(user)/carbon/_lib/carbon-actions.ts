'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import type { CarbonFormData } from '~/lib/services/carbon-calculator';
import { calculateCarbonFootprint } from '~/lib/services/carbon-calculator';

export async function saveCarbonAssessment(formData: CarbonFormData) {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;
  if (!userId) throw new Error('Not authenticated');

  const result = calculateCarbonFootprint(formData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = client as any;

  await c.from('carbon_assessments').insert({
    account_id: userId,
    reporting_year: formData.profile.reporting_year,
    reporting_period: formData.profile.reporting_period,
    company_profile: formData.profile,
    scope1_data: formData.scope1,
    scope2_data: formData.scope2,
    scope3_data: formData.scope3,
    scope1_total: result.scope1.total,
    scope2_total: result.scope2.total,
    scope3_total: result.scope3.total,
    total: result.total,
    intensity_per_employee: result.intensity_per_employee,
    intensity_per_revenue: result.intensity_per_revenue,
    completed: true,
  });

  revalidatePath('/home/carbon');
  return result;
}
