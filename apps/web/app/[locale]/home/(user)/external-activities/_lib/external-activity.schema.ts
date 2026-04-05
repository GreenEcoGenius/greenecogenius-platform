import { z } from 'zod';

export const ExternalActivityCategoryEnum = z.enum([
  'governance',
  'social',
  'environment',
  'procurement',
  'community',
]);

export const CreateExternalActivitySchema = z.object({
  category: ExternalActivityCategoryEnum,
  subcategory: z.string().min(1).max(100),
  title: z.string().min(2).max(200),
  description: z.string().max(2000).nullish(),
  quantitative_value: z.number().finite().nullish(),
  quantitative_unit: z.string().max(50).nullish(),
  qualitative_value: z.string().max(2000).nullish(),
  document_url: z.string().max(500).nullish(),
  date_start: z.string().nullish(),
  date_end: z.string().nullish(),
});

export type CreateExternalActivityInput = z.infer<
  typeof CreateExternalActivitySchema
>;

export const DeleteExternalActivitySchema = z.object({
  id: z.string().uuid(),
});
