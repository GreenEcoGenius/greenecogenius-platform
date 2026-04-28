import { z } from 'zod';

/**
 * Centralized Zod schemas for API route validation.
 *
 * Each schema corresponds to a specific route or group of routes.
 * Import the relevant schema in the route handler and call `.safeParse(body)`.
 */

// ─── ESG ──────────────────────────────────────────────────────────────────────

export const EsgReportingYearSchema = z.object({
  reporting_year: z.number().int().min(2000).max(2100),
});

export const EsgYearQuerySchema = z.object({
  year: z.string().regex(/^\d{4}$/, 'year must be a 4-digit string'),
});

export const EsgDataAutoFillSchema = z.object({
  reporting_year: z.number().int().min(2000).max(2100),
  sector: z.string().min(1).max(200).optional(),
});

export const EsgCalculateSchema = z.object({
  natural_gas_kwh: z.number().min(0).default(0),
  fuel_liters: z.number().min(0).default(0),
  fuel_type: z.string().default('diesel'),
  other_kg_co2: z.number().min(0).default(0),
  electricity_kwh: z.number().min(0).default(0),
  electricity_source: z.string().default('grid_fr'),
  heating_kwh: z.number().min(0).default(0),
  business_travel_km: z.number().min(0).default(0),
  travel_mode: z.string().default('car'),
  commuting_employees: z.number().int().min(0).default(0),
  commuting_avg_km: z.number().min(0).default(0),
  purchased_goods_eur: z.number().min(0).default(0),
  waste_tonnes: z.number().min(0).default(0),
  nb_employees: z.number().int().min(0).default(0),
  platform_co2_avoided: z.number().min(0).default(0),
  platform_tonnes_recycled: z.number().min(0).default(0),
  reporting_year: z.number().int().min(2000).max(2100),
  account_id: z.string().uuid().optional(),
});

export const EsgBenchmarkingQuerySchema = z.object({
  year: z.string().regex(/^\d{4}$/).optional(),
  sector: z.string().min(1).max(200).optional(),
});

// ─── Carbon ───────────────────────────────────────────────────────────────────

export const CarbonDashboardQuerySchema = z.object({
  year: z.string().regex(/^\d{4}$/).optional(),
});

export const CarbonVerifyHashSchema = z.object({
  hash: z.string().min(1).max(128),
});

// ─── Stripe ───────────────────────────────────────────────────────────────────

export const StripeCommissionCalculateSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('eur'),
});

export const StripePayoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('eur'),
});

// ─── External Activities ──────────────────────────────────────────────────────

export const ExternalActivityAnalyzeSchema = z.object({
  description: z.string().min(1).max(5000),
  category: z.string().max(200).optional(),
});

// ─── Normes ───────────────────────────────────────────────────────────────────

export const NormesPdfSchema = z.object({
  normId: z.string().min(1).max(200),
  locale: z.enum(['fr', 'en']).default('fr'),
});

// ─── Blockchain ───────────────────────────────────────────────────────────────

export const BlockchainRegisterSchema = z.object({
  lotId: z.string().min(1).max(200),
  data: z.record(z.unknown()),
});
