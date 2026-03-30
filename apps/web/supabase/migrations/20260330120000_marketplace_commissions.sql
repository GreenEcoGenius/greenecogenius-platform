-- ============================================================
-- MARKETPLACE COMMISSIONS — Stripe Connect + Escrow System
-- GreenEcoGenius / Le Comptoir Circulaire
-- ============================================================

-- 1. Platform configuration (commission rate, etc.)
CREATE TABLE IF NOT EXISTS public.marketplace_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_rate NUMERIC NOT NULL DEFAULT 0.20 CHECK (commission_rate >= 0 AND commission_rate <= 1),
  min_payout_amount INTEGER NOT NULL DEFAULT 500, -- minimum payout in cents (5€)
  escrow_release_delay_hours INTEGER NOT NULL DEFAULT 0, -- delay after delivery confirmation
  currency TEXT NOT NULL DEFAULT 'eur',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config
INSERT INTO public.marketplace_config (commission_rate, min_payout_amount, currency)
VALUES (0.20, 500, 'eur')
ON CONFLICT DO NOTHING;

-- 2. Stripe Connected Accounts (one per account/organisation)
CREATE TABLE IF NOT EXISTS public.stripe_connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL UNIQUE, -- acct_xxxxx
  onboarding_complete BOOLEAN DEFAULT FALSE,
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  business_type TEXT, -- company, individual
  country TEXT DEFAULT 'FR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id) -- one Stripe account per platform account
);

CREATE INDEX IF NOT EXISTS idx_connected_accounts_account ON public.stripe_connected_accounts(account_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_stripe ON public.stripe_connected_accounts(stripe_account_id);

-- 3. Marketplace Transactions
CREATE TABLE IF NOT EXISTS public.marketplace_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  seller_account_id UUID NOT NULL REFERENCES public.accounts(id),
  buyer_account_id UUID NOT NULL REFERENCES public.accounts(id),

  -- Amounts (in cents)
  total_amount INTEGER NOT NULL CHECK (total_amount > 0),
  platform_fee INTEGER NOT NULL CHECK (platform_fee >= 0),
  seller_amount INTEGER NOT NULL CHECK (seller_amount >= 0),
  transport_amount INTEGER NOT NULL DEFAULT 0 CHECK (transport_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'eur',
  commission_rate NUMERIC NOT NULL DEFAULT 0.20,

  -- Stripe references
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_transfer_id TEXT,

  -- Overall status
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN (
      'pending_payment', 'paid', 'in_transit', 'delivered',
      'completed', 'disputed', 'refunded', 'cancelled'
    )),

  -- Payment status
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded')),

  -- Delivery status
  delivery_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'picked_up', 'in_transit', 'delivered', 'confirmed')),

  -- Timestamps
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  delivery_confirmed_at TIMESTAMPTZ,
  funds_released_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_seller ON public.marketplace_transactions(seller_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON public.marketplace_transactions(buyer_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.marketplace_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON public.marketplace_transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_intent ON public.marketplace_transactions(stripe_payment_intent_id);

-- 4. Transaction Events (audit trail)
CREATE TABLE IF NOT EXISTS public.transaction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.marketplace_transactions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  -- payment_created, payment_succeeded, payment_failed,
  -- shipment_started, delivery_confirmed,
  -- funds_released, dispute_opened, refund_issued
  actor_account_id UUID REFERENCES public.accounts(id),
  actor_role TEXT, -- buyer, seller, logistics, platform
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_transaction ON public.transaction_events(transaction_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.transaction_events(event_type);

-- 5. Wallet Balances (per account)
CREATE TABLE IF NOT EXISTS public.wallet_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL UNIQUE REFERENCES public.accounts(id) ON DELETE CASCADE,
  available_balance INTEGER NOT NULL DEFAULT 0, -- in cents, withdrawable
  pending_balance INTEGER NOT NULL DEFAULT 0, -- in cents, awaiting delivery confirmation
  total_earned INTEGER NOT NULL DEFAULT 0, -- cumulative total earned
  total_fees_paid INTEGER NOT NULL DEFAULT 0, -- cumulative platform fees
  currency TEXT NOT NULL DEFAULT 'eur',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_account ON public.wallet_balances(account_id);

-- ============================================================
-- GRANTS
-- ============================================================

REVOKE ALL ON public.marketplace_config FROM authenticated, service_role;
GRANT SELECT ON public.marketplace_config TO authenticated;
GRANT ALL ON public.marketplace_config TO service_role;

REVOKE ALL ON public.stripe_connected_accounts FROM authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.stripe_connected_accounts TO authenticated;
GRANT ALL ON public.stripe_connected_accounts TO service_role;

REVOKE ALL ON public.marketplace_transactions FROM authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.marketplace_transactions TO authenticated;
GRANT ALL ON public.marketplace_transactions TO service_role;

REVOKE ALL ON public.transaction_events FROM authenticated, service_role;
GRANT SELECT, INSERT ON public.transaction_events TO authenticated;
GRANT ALL ON public.transaction_events TO service_role;

REVOKE ALL ON public.wallet_balances FROM authenticated, service_role;
GRANT SELECT ON public.wallet_balances TO authenticated;
GRANT ALL ON public.wallet_balances TO service_role;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Stripe Connected Accounts
ALTER TABLE public.stripe_connected_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY stripe_connected_accounts_read ON public.stripe_connected_accounts
  FOR SELECT TO authenticated
  USING (
    account_id = (SELECT auth.uid())
    OR public.has_role_on_account(account_id)
  );

CREATE POLICY stripe_connected_accounts_insert ON public.stripe_connected_accounts
  FOR INSERT TO authenticated
  WITH CHECK (
    account_id = (SELECT auth.uid())
    OR public.has_role_on_account(account_id)
  );

CREATE POLICY stripe_connected_accounts_update ON public.stripe_connected_accounts
  FOR UPDATE TO authenticated
  USING (
    account_id = (SELECT auth.uid())
    OR public.has_role_on_account(account_id)
  );

-- Marketplace Transactions
ALTER TABLE public.marketplace_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY transactions_read_seller ON public.marketplace_transactions
  FOR SELECT TO authenticated
  USING (
    seller_account_id = (SELECT auth.uid())
    OR public.has_role_on_account(seller_account_id)
  );

CREATE POLICY transactions_read_buyer ON public.marketplace_transactions
  FOR SELECT TO authenticated
  USING (
    buyer_account_id = (SELECT auth.uid())
    OR public.has_role_on_account(buyer_account_id)
  );

-- Transaction Events: readable by transaction participants
ALTER TABLE public.transaction_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY transaction_events_read ON public.transaction_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_transactions t
      WHERE t.id = transaction_id
      AND (
        t.seller_account_id = (SELECT auth.uid())
        OR t.buyer_account_id = (SELECT auth.uid())
        OR public.has_role_on_account(t.seller_account_id)
        OR public.has_role_on_account(t.buyer_account_id)
      )
    )
  );

-- Wallet Balances
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY wallet_read_own ON public.wallet_balances
  FOR SELECT TO authenticated
  USING (
    account_id = (SELECT auth.uid())
    OR public.has_role_on_account(account_id)
  );

-- Marketplace Config: readable by all authenticated users
ALTER TABLE public.marketplace_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY marketplace_config_read ON public.marketplace_config
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- SERVICE ROLE POLICIES (for webhooks and API routes using admin client)
-- ============================================================

-- Allow service_role to manage all tables (for webhooks)
CREATE POLICY stripe_connected_accounts_service ON public.stripe_connected_accounts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY transactions_service ON public.marketplace_transactions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY transaction_events_service ON public.transaction_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY wallet_balances_service ON public.wallet_balances
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY marketplace_config_service ON public.marketplace_config
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- HELPER FUNCTION: Update updated_at timestamp
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_marketplace_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stripe_connected_accounts_updated
  BEFORE UPDATE ON public.stripe_connected_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_marketplace_updated_at();

CREATE TRIGGER trg_marketplace_transactions_updated
  BEFORE UPDATE ON public.marketplace_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_marketplace_updated_at();

CREATE TRIGGER trg_wallet_balances_updated
  BEFORE UPDATE ON public.wallet_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_marketplace_updated_at();
