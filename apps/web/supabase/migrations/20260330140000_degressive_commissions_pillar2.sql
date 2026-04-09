-- ============================================================
-- DEGRESSIVE COMMISSIONS + PILLAR 2 PREPARATION
-- GreenEcoGenius / Le Comptoir Circulaire
-- ============================================================

-- 1. Replace marketplace_config with commission_config
-- (keep marketplace_config for backwards compat, add new table)

CREATE TABLE IF NOT EXISTS public.commission_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT FALSE,
  commission_type TEXT NOT NULL DEFAULT 'degressive'
    CHECK (commission_type IN ('flat', 'degressive')),

  -- For flat mode
  flat_rate DECIMAL(5,4), -- e.g. 0.0500 = 5%

  -- For degressive mode (JSONB array of tiers, amounts in CENTS)
  tiers JSONB DEFAULT '[
    {"min": 0, "max": 1000000, "rate": 0.08},
    {"min": 1000001, "max": 5000000, "rate": 0.05},
    {"min": 5000001, "max": null, "rate": 0.03}
  ]'::jsonb,

  -- Validity period (for promos)
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ, -- NULL = no expiration

  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: launch promo (5% flat for 6 months)
INSERT INTO public.commission_config (name, is_active, commission_type, flat_rate, valid_from, valid_until, description)
VALUES (
  'launch_promo',
  TRUE,
  'flat',
  0.0500,
  NOW(),
  NOW() + INTERVAL '6 months',
  'Offre de lancement : 5% flat pendant les 6 premiers mois'
) ON CONFLICT (name) DO NOTHING;

-- Seed: standard degressive (activated after promo)
INSERT INTO public.commission_config (name, is_active, commission_type, tiers, description)
VALUES (
  'standard',
  FALSE,
  'degressive',
  '[
    {"min": 0, "max": 1000000, "rate": 0.08},
    {"min": 1000001, "max": 5000000, "rate": 0.05},
    {"min": 5000001, "max": null, "rate": 0.03}
  ]'::jsonb,
  'Grille standard dégressive : 8% (0-10k€) / 5% (10k-50k€) / 3% (50k€+)'
) ON CONFLICT (name) DO NOTHING;

-- 2. Add commission_config_id to marketplace_transactions
ALTER TABLE public.marketplace_transactions
  ADD COLUMN IF NOT EXISTS commission_config_id UUID REFERENCES public.commission_config(id);

-- 3. Add new wallet columns
ALTER TABLE public.wallet_balances
  ADD COLUMN IF NOT EXISTS total_commission_paid INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_withdrawn INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_transactions INTEGER NOT NULL DEFAULT 0;

-- 4. Add timestamp columns to marketplace_transactions
ALTER TABLE public.marketplace_transactions
  ADD COLUMN IF NOT EXISTS in_transit_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- ============================================================
-- PILLAR 2 — Subscription Plans (read-only for now)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  pillar TEXT NOT NULL DEFAULT 'pillar_2',

  -- Pricing (in cents)
  monthly_price INTEGER,
  annual_price INTEGER,

  -- Limits
  max_traced_lots_per_month INTEGER,
  includes_api_access BOOLEAN DEFAULT FALSE,
  includes_advanced_dashboard BOOLEAN DEFAULT FALSE,
  includes_erp_integration BOOLEAN DEFAULT FALSE,
  includes_dedicated_support BOOLEAN DEFAULT FALSE,

  -- Stripe (to be filled when products are created)
  stripe_price_id_monthly TEXT,
  stripe_price_id_annual TEXT,
  stripe_product_id TEXT,

  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Pillar 2 plans
INSERT INTO public.subscription_plans (name, display_name, pillar, monthly_price, annual_price, max_traced_lots_per_month, includes_api_access, includes_advanced_dashboard, sort_order)
VALUES
  ('essentiel', 'Plan Essentiel', 'pillar_2', 19900, 190800, 50, FALSE, FALSE, 1),
  ('avance', 'Plan Avancé', 'pillar_2', 49900, 478800, NULL, TRUE, TRUE, 2),
  ('enterprise', 'Enterprise', 'pillar_2', NULL, NULL, NULL, TRUE, TRUE, 3)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- PILLAR 2 — Organization Subscriptions (future use)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),

  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing', 'paused')),

  billing_cycle TEXT DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly', 'annual')),

  -- Stripe
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,

  -- Usage counters
  traced_lots_this_month INTEGER DEFAULT 0,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,

  trial_ends_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_subs_account ON public.organization_subscriptions(account_id);
CREATE INDEX IF NOT EXISTS idx_org_subs_status ON public.organization_subscriptions(status);

-- ============================================================
-- FUNCTION: Calculate degressive commission
-- ============================================================

CREATE OR REPLACE FUNCTION public.calculate_commission(
  p_amount_cents INTEGER,
  p_config_override UUID DEFAULT NULL
)
RETURNS TABLE (
  commission_rate DECIMAL(5,4),
  commission_amount INTEGER,
  seller_amount INTEGER,
  config_id UUID,
  config_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_config RECORD;
  v_rate DECIMAL(5,4);
BEGIN
  -- Get the active config
  IF p_config_override IS NOT NULL THEN
    SELECT * INTO v_config FROM public.commission_config
    WHERE id = p_config_override AND is_active = TRUE;
  ELSE
    -- Take the active config whose period is valid
    SELECT * INTO v_config FROM public.commission_config
    WHERE is_active = TRUE
      AND valid_from <= NOW()
      AND (valid_until IS NULL OR valid_until > NOW())
    ORDER BY valid_from DESC
    LIMIT 1;
  END IF;

  -- Fallback to standard config
  IF v_config IS NULL THEN
    SELECT * INTO v_config FROM public.commission_config
    WHERE name = 'standard'
    LIMIT 1;
  END IF;

  -- Calculate rate based on type
  IF v_config.commission_type = 'flat' THEN
    v_rate := v_config.flat_rate;
  ELSIF v_config.commission_type = 'degressive' THEN
    -- Find the applicable tier
    SELECT (tier->>'rate')::DECIMAL(5,4) INTO v_rate
    FROM jsonb_array_elements(v_config.tiers) AS tier
    WHERE p_amount_cents >= (tier->>'min')::INTEGER
      AND (
        tier->>'max' IS NULL
        OR (tier->>'max')::TEXT = 'null'
        OR p_amount_cents <= (tier->>'max')::INTEGER
      )
    LIMIT 1;

    -- Fallback to lowest rate
    IF v_rate IS NULL THEN
      SELECT (tier->>'rate')::DECIMAL(5,4) INTO v_rate
      FROM jsonb_array_elements(v_config.tiers) AS tier
      ORDER BY (tier->>'rate')::DECIMAL ASC
      LIMIT 1;
    END IF;
  END IF;

  -- Default fallback
  IF v_rate IS NULL THEN
    v_rate := 0.0500;
  END IF;

  RETURN QUERY SELECT
    v_rate,
    ROUND(p_amount_cents * v_rate)::INTEGER,
    (p_amount_cents - ROUND(p_amount_cents * v_rate)::INTEGER),
    v_config.id,
    v_config.name;
END;
$$;

-- ============================================================
-- GRANTS & RLS for new tables
-- ============================================================

-- commission_config: read by all authenticated
REVOKE ALL ON public.commission_config FROM authenticated, service_role;
GRANT SELECT ON public.commission_config TO authenticated;
GRANT ALL ON public.commission_config TO service_role;

ALTER TABLE public.commission_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY commission_config_read ON public.commission_config
  FOR SELECT TO authenticated USING (true);

CREATE POLICY commission_config_service ON public.commission_config
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- subscription_plans: read by all authenticated
REVOKE ALL ON public.subscription_plans FROM authenticated, service_role;
GRANT SELECT ON public.subscription_plans TO authenticated;
GRANT ALL ON public.subscription_plans TO service_role;

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscription_plans_read ON public.subscription_plans
  FOR SELECT TO authenticated USING (true);

CREATE POLICY subscription_plans_service ON public.subscription_plans
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- organization_subscriptions: own account only
REVOKE ALL ON public.organization_subscriptions FROM authenticated, service_role;
GRANT SELECT ON public.organization_subscriptions TO authenticated;
GRANT ALL ON public.organization_subscriptions TO service_role;

ALTER TABLE public.organization_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_subs_read ON public.organization_subscriptions
  FOR SELECT TO authenticated
  USING (
    account_id = (SELECT auth.uid())
    OR public.has_role_on_account(account_id)
  );

CREATE POLICY org_subs_service ON public.organization_subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER trg_commission_config_updated
  BEFORE UPDATE ON public.commission_config
  FOR EACH ROW EXECUTE FUNCTION public.update_marketplace_updated_at();

CREATE TRIGGER trg_org_subs_updated
  BEFORE UPDATE ON public.organization_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_marketplace_updated_at();
