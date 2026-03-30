-- ============================================================
-- PILIER 2 & 3 — Carbon, Blockchain, ESG Reporting
-- GreenEcoGenius / Le Comptoir Circulaire
-- ============================================================

-- ============================================================
-- 1. Carbon Emission Factors (Base Carbone ADEME)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.carbon_emission_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_category TEXT NOT NULL,
  material_subcategory TEXT,
  virgin_production_factor NUMERIC(10,2) NOT NULL, -- kg CO2e per tonne (virgin)
  recycling_process_factor NUMERIC(10,2) NOT NULL, -- kg CO2e per tonne (recycled)
  landfill_factor NUMERIC(10,2) NOT NULL,
  incineration_factor NUMERIC(10,2) NOT NULL,
  source TEXT DEFAULT 'ADEME Base Carbone',
  source_year INTEGER DEFAULT 2024,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.carbon_emission_factors
  (material_category, material_subcategory, virgin_production_factor, recycling_process_factor, landfill_factor, incineration_factor)
VALUES
  ('plastique', 'PET', 3140, 1050, 40, 2690),
  ('plastique', 'PEHD', 2790, 980, 40, 2690),
  ('plastique', 'PP', 2530, 920, 40, 2690),
  ('plastique', 'PVC', 2410, 890, 40, 1820),
  ('plastique', 'mixte', 2720, 970, 40, 2500),
  ('metal', 'acier', 2890, 640, 20, 0),
  ('metal', 'aluminium', 11200, 580, 20, 0),
  ('metal', 'cuivre', 5600, 1200, 20, 0),
  ('metal', 'mixte', 4500, 800, 20, 0),
  ('bois', 'brut', 60, 20, 680, 1180),
  ('bois', 'traite', 120, 45, 680, 1350),
  ('bois', 'palette', 80, 25, 680, 1180),
  ('verre', 'transparent', 1240, 580, 20, 0),
  ('verre', 'colore', 1240, 600, 20, 0),
  ('papier', 'carton', 920, 390, 680, 1450),
  ('papier', 'papier_bureau', 1050, 420, 680, 1450),
  ('textile', 'coton', 8100, 2500, 680, 2100),
  ('textile', 'synthetique', 5200, 1800, 40, 3100),
  ('deee', 'electronique', 15000, 3500, 20, 2000),
  ('organique', 'biodechet', 180, 50, 680, 350)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. Transport Emission Factors
-- ============================================================

CREATE TABLE IF NOT EXISTS public.transport_emission_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transport_mode TEXT NOT NULL,
  vehicle_type TEXT,
  emission_factor NUMERIC(10,4) NOT NULL, -- kg CO2e per tonne.km
  source TEXT DEFAULT 'ADEME Base Carbone',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.transport_emission_factors (transport_mode, vehicle_type, emission_factor)
VALUES
  ('road_truck', 'truck_40t', 0.0490),
  ('road_truck', 'truck_19t', 0.0830),
  ('road_truck', 'truck_3.5t', 0.2270),
  ('road_van', 'van', 0.4100),
  ('rail', 'freight', 0.0057),
  ('sea', 'container', 0.0160),
  ('river', 'barge', 0.0310)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. Carbon Records (per transaction)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.carbon_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.marketplace_transactions(id),
  account_id UUID NOT NULL REFERENCES public.accounts(id),

  material_category TEXT NOT NULL,
  material_subcategory TEXT,
  weight_tonnes NUMERIC(10,3) NOT NULL,

  transport_mode TEXT,
  distance_km NUMERIC(10,1),
  origin_location TEXT,
  destination_location TEXT,

  -- All in kg CO2e
  co2_virgin_production NUMERIC(12,2),
  co2_recycling_process NUMERIC(12,2),
  co2_avoided NUMERIC(12,2),
  co2_transport NUMERIC(12,2),
  co2_net_benefit NUMERIC(12,2),
  co2_landfill_avoided NUMERIC(12,2),

  emission_factor_id UUID REFERENCES public.carbon_emission_factors(id),
  transport_factor_id UUID REFERENCES public.transport_emission_factors(id),
  calculation_method TEXT DEFAULT 'ademe_base_carbone_v2024',
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carbon_tx ON public.carbon_records(transaction_id);
CREATE INDEX IF NOT EXISTS idx_carbon_account ON public.carbon_records(account_id);
CREATE INDEX IF NOT EXISTS idx_carbon_material ON public.carbon_records(material_category);

-- ============================================================
-- 4. Blockchain Records
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blockchain_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.marketplace_transactions(id),
  listing_id UUID NOT NULL REFERENCES public.listings(id),

  record_hash TEXT NOT NULL UNIQUE,
  previous_hash TEXT,
  block_number BIGINT,

  hashed_data JSONB NOT NULL,
  geolocation_trail JSONB DEFAULT '[]',

  is_verified BOOLEAN DEFAULT TRUE,
  verification_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blockchain_tx ON public.blockchain_records(transaction_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_hash ON public.blockchain_records(record_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_block ON public.blockchain_records(block_number);

-- ============================================================
-- 5. Traceability Certificates
-- ============================================================

CREATE TABLE IF NOT EXISTS public.traceability_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.marketplace_transactions(id),
  blockchain_record_id UUID NOT NULL REFERENCES public.blockchain_records(id),
  carbon_record_id UUID NOT NULL REFERENCES public.carbon_records(id),

  certificate_number TEXT NOT NULL UNIQUE, -- GEG-2026-000001
  certificate_url TEXT,

  issued_to_account_id UUID NOT NULL REFERENCES public.accounts(id),
  material_summary TEXT,
  weight_tonnes NUMERIC(10,3),
  co2_avoided NUMERIC(12,2),
  blockchain_hash TEXT,

  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cert_tx ON public.traceability_certificates(transaction_id);
CREATE INDEX IF NOT EXISTS idx_cert_account ON public.traceability_certificates(issued_to_account_id);
CREATE INDEX IF NOT EXISTS idx_cert_number ON public.traceability_certificates(certificate_number);

-- ============================================================
-- 6. Add blockchain/carbon columns to marketplace_transactions
-- ============================================================

ALTER TABLE public.marketplace_transactions
  ADD COLUMN IF NOT EXISTS blockchain_hash TEXT,
  ADD COLUMN IF NOT EXISTS carbon_record_id UUID,
  ADD COLUMN IF NOT EXISTS traceability_certificate_url TEXT;

-- ============================================================
-- 7. ESG Emission Factors (Scope 1/2/3)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.esg_emission_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  factor_name TEXT NOT NULL,
  emission_factor NUMERIC(10,4) NOT NULL,
  unit TEXT NOT NULL,
  scope INTEGER NOT NULL CHECK (scope IN (1, 2, 3)),
  country TEXT DEFAULT 'FR',
  source TEXT DEFAULT 'ADEME Base Carbone',
  source_year INTEGER DEFAULT 2024,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.esg_emission_factors (category, subcategory, factor_name, emission_factor, unit, scope) VALUES
  ('energy', 'natural_gas', 'Gaz naturel', 0.2050, 'kWh', 1),
  ('energy', 'fuel_diesel', 'Diesel', 2.6710, 'litre', 1),
  ('energy', 'fuel_essence', 'Essence SP95', 2.2840, 'litre', 1),
  ('energy', 'fuel_gpl', 'GPL', 1.6530, 'litre', 1),
  ('energy', 'electricity_fr', 'Electricite France', 0.0520, 'kWh', 2),
  ('energy', 'electricity_eu', 'Electricite Europe', 0.2760, 'kWh', 2),
  ('energy', 'electricity_renewable', 'Electricite renouvelable', 0.0060, 'kWh', 2),
  ('energy', 'district_heating', 'Chauffage urbain France', 0.1090, 'kWh', 2),
  ('transport', 'car_avg', 'Voiture moyenne', 0.2170, 'km', 3),
  ('transport', 'train_france', 'Train France', 0.0055, 'km', 3),
  ('transport', 'plane_short', 'Avion court-courrier', 0.2580, 'km', 3),
  ('transport', 'plane_long', 'Avion long-courrier', 0.1870, 'km', 3),
  ('waste', 'landfill_generic', 'Enfouissement generique', 680.0000, 'tonne', 3),
  ('waste', 'incineration_generic', 'Incineration generique', 1200.0000, 'tonne', 3),
  ('purchases', 'goods_services_avg', 'Achats biens/services moyen FR', 0.4300, 'EUR', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. Organization ESG Data (declarative)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.org_esg_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  reporting_year INTEGER NOT NULL,
  reporting_period TEXT DEFAULT 'annual',

  -- Scope 1
  scope1_natural_gas_kwh NUMERIC(12,2) DEFAULT 0,
  scope1_fuel_liters NUMERIC(12,2) DEFAULT 0,
  scope1_fuel_type TEXT DEFAULT 'diesel',
  scope1_other_kg_co2 NUMERIC(12,2) DEFAULT 0,

  -- Scope 2
  scope2_electricity_kwh NUMERIC(12,2) DEFAULT 0,
  scope2_electricity_source TEXT DEFAULT 'grid_fr',
  scope2_heating_kwh NUMERIC(12,2) DEFAULT 0,

  -- Scope 3
  scope3_business_travel_km NUMERIC(12,2) DEFAULT 0,
  scope3_travel_mode TEXT DEFAULT 'car',
  scope3_commuting_employees INTEGER DEFAULT 0,
  scope3_commuting_avg_km NUMERIC(10,2) DEFAULT 0,
  scope3_purchased_goods_eur NUMERIC(14,2) DEFAULT 0,
  scope3_waste_tonnes NUMERIC(10,2) DEFAULT 0,

  -- Company info
  nb_employees INTEGER DEFAULT 0,
  office_surface_m2 NUMERIC(10,2) DEFAULT 0,
  industry_sector TEXT,

  -- Auto-filled from platform
  platform_co2_avoided NUMERIC(12,2) DEFAULT 0,
  platform_transactions_count INTEGER DEFAULT 0,
  platform_tonnes_recycled NUMERIC(10,3) DEFAULT 0,

  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_esg_account_year
  ON public.org_esg_data(account_id, reporting_year, reporting_period);

-- ============================================================
-- 9. ESG Reports
-- ============================================================

CREATE TABLE IF NOT EXISTS public.esg_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  esg_data_id UUID NOT NULL REFERENCES public.org_esg_data(id),

  report_type TEXT NOT NULL DEFAULT 'summary',
  report_year INTEGER NOT NULL,
  report_title TEXT,

  total_scope1 NUMERIC(14,2),
  total_scope2 NUMERIC(14,2),
  total_scope3 NUMERIC(14,2),
  total_emissions NUMERIC(14,2),
  total_avoided_via_platform NUMERIC(14,2),
  net_emissions NUMERIC(14,2),

  emissions_per_employee NUMERIC(10,2),
  recommendations JSONB DEFAULT '[]',

  report_url TEXT,
  report_status TEXT DEFAULT 'draft'
    CHECK (report_status IN ('draft', 'generated', 'reviewed', 'certified')),

  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_account ON public.esg_reports(account_id);

-- ============================================================
-- 10. Sustainability KPIs
-- ============================================================

CREATE TABLE IF NOT EXISTS public.org_sustainability_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT DEFAULT 'monthly',

  total_emissions_kg NUMERIC(14,2),
  total_avoided_kg NUMERIC(14,2),
  net_emissions_kg NUMERIC(14,2),
  tonnes_recycled NUMERIC(10,3),
  transactions_count INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kpis_account ON public.org_sustainability_kpis(account_id);

-- ============================================================
-- GRANTS
-- ============================================================

-- Carbon emission factors: read all
REVOKE ALL ON public.carbon_emission_factors FROM authenticated, service_role;
GRANT SELECT ON public.carbon_emission_factors TO authenticated;
GRANT ALL ON public.carbon_emission_factors TO service_role;

REVOKE ALL ON public.transport_emission_factors FROM authenticated, service_role;
GRANT SELECT ON public.transport_emission_factors TO authenticated;
GRANT ALL ON public.transport_emission_factors TO service_role;

-- Carbon records: own account
REVOKE ALL ON public.carbon_records FROM authenticated, service_role;
GRANT SELECT ON public.carbon_records TO authenticated;
GRANT ALL ON public.carbon_records TO service_role;

-- Blockchain records: read all (public transparency)
REVOKE ALL ON public.blockchain_records FROM authenticated, service_role;
GRANT SELECT ON public.blockchain_records TO authenticated;
GRANT ALL ON public.blockchain_records TO service_role;

-- Certificates: own account
REVOKE ALL ON public.traceability_certificates FROM authenticated, service_role;
GRANT SELECT ON public.traceability_certificates TO authenticated;
GRANT ALL ON public.traceability_certificates TO service_role;

-- ESG tables: own account
REVOKE ALL ON public.esg_emission_factors FROM authenticated, service_role;
GRANT SELECT ON public.esg_emission_factors TO authenticated;
GRANT ALL ON public.esg_emission_factors TO service_role;

REVOKE ALL ON public.org_esg_data FROM authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.org_esg_data TO authenticated;
GRANT ALL ON public.org_esg_data TO service_role;

REVOKE ALL ON public.esg_reports FROM authenticated, service_role;
GRANT SELECT ON public.esg_reports TO authenticated;
GRANT ALL ON public.esg_reports TO service_role;

REVOKE ALL ON public.org_sustainability_kpis FROM authenticated, service_role;
GRANT SELECT ON public.org_sustainability_kpis TO authenticated;
GRANT ALL ON public.org_sustainability_kpis TO service_role;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.carbon_emission_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY carbon_factors_read ON public.carbon_emission_factors FOR SELECT TO authenticated USING (true);
CREATE POLICY carbon_factors_service ON public.carbon_emission_factors FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.transport_emission_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY transport_factors_read ON public.transport_emission_factors FOR SELECT TO authenticated USING (true);
CREATE POLICY transport_factors_service ON public.transport_emission_factors FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.carbon_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY carbon_records_own ON public.carbon_records FOR SELECT TO authenticated
  USING (account_id = (SELECT auth.uid()) OR public.has_role_on_account(account_id));
CREATE POLICY carbon_records_service ON public.carbon_records FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.blockchain_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY blockchain_read_all ON public.blockchain_records FOR SELECT TO authenticated USING (true);
CREATE POLICY blockchain_service ON public.blockchain_records FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.traceability_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY certs_own ON public.traceability_certificates FOR SELECT TO authenticated
  USING (issued_to_account_id = (SELECT auth.uid()) OR public.has_role_on_account(issued_to_account_id));
CREATE POLICY certs_service ON public.traceability_certificates FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.esg_emission_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY esg_factors_read ON public.esg_emission_factors FOR SELECT TO authenticated USING (true);
CREATE POLICY esg_factors_service ON public.esg_emission_factors FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.org_esg_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY esg_data_own ON public.org_esg_data FOR SELECT TO authenticated
  USING (account_id = (SELECT auth.uid()) OR public.has_role_on_account(account_id));
CREATE POLICY esg_data_insert ON public.org_esg_data FOR INSERT TO authenticated
  WITH CHECK (account_id = (SELECT auth.uid()) OR public.has_role_on_account(account_id));
CREATE POLICY esg_data_update ON public.org_esg_data FOR UPDATE TO authenticated
  USING (account_id = (SELECT auth.uid()) OR public.has_role_on_account(account_id));
CREATE POLICY esg_data_service ON public.org_esg_data FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.esg_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_own ON public.esg_reports FOR SELECT TO authenticated
  USING (account_id = (SELECT auth.uid()) OR public.has_role_on_account(account_id));
CREATE POLICY reports_service ON public.esg_reports FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.org_sustainability_kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY kpis_own ON public.org_sustainability_kpis FOR SELECT TO authenticated
  USING (account_id = (SELECT auth.uid()) OR public.has_role_on_account(account_id));
CREATE POLICY kpis_service ON public.org_sustainability_kpis FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- FUNCTION: Calculate transaction carbon footprint
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.calculate_transaction_carbon(
  p_transaction_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tx RECORD;
  v_listing RECORD;
  v_emission RECORD;
  v_transport RECORD;
  v_weight_tonnes NUMERIC(10,3);
  v_co2_virgin NUMERIC(12,2);
  v_co2_recycling NUMERIC(12,2);
  v_co2_avoided NUMERIC(12,2);
  v_co2_transport NUMERIC(12,2);
  v_co2_net NUMERIC(12,2);
  v_co2_landfill NUMERIC(12,2);
  v_record_id UUID;
  v_category TEXT;
BEGIN
  -- Get transaction
  SELECT * INTO v_tx FROM public.marketplace_transactions WHERE id = p_transaction_id;
  IF v_tx IS NULL THEN RETURN NULL; END IF;

  -- Get listing with category
  SELECT l.*, mc.name_fr as cat_name
  INTO v_listing
  FROM public.listings l
  LEFT JOIN public.material_categories mc ON mc.id = l.category_id
  WHERE l.id = v_tx.listing_id;

  IF v_listing IS NULL THEN RETURN NULL; END IF;

  -- Map category name to carbon factor category
  v_category := LOWER(COALESCE(v_listing.cat_name, 'plastique'));
  -- Normalize: Métaux -> metal, Plastiques -> plastique, etc.
  v_category := CASE
    WHEN v_category LIKE '%méta%' OR v_category LIKE '%meta%' THEN 'metal'
    WHEN v_category LIKE '%plast%' THEN 'plastique'
    WHEN v_category LIKE '%bois%' OR v_category LIKE '%wood%' THEN 'bois'
    WHEN v_category LIKE '%verr%' OR v_category LIKE '%glass%' THEN 'verre'
    WHEN v_category LIKE '%papi%' OR v_category LIKE '%carto%' THEN 'papier'
    WHEN v_category LIKE '%text%' THEN 'textile'
    WHEN v_category LIKE '%deee%' OR v_category LIKE '%élect%' OR v_category LIKE '%elect%' THEN 'deee'
    WHEN v_category LIKE '%organ%' OR v_category LIKE '%bio%' THEN 'organique'
    ELSE 'plastique'
  END;

  -- Get emission factor
  SELECT * INTO v_emission
  FROM public.carbon_emission_factors
  WHERE material_category = v_category AND is_active = TRUE
  ORDER BY material_subcategory NULLS LAST
  LIMIT 1;

  IF v_emission IS NULL THEN
    SELECT * INTO v_emission FROM public.carbon_emission_factors WHERE material_category = 'plastique' LIMIT 1;
  END IF;

  -- Get transport factor (default: truck 40t)
  SELECT * INTO v_transport
  FROM public.transport_emission_factors
  WHERE transport_mode = 'road_truck' AND vehicle_type = 'truck_40t'
  LIMIT 1;

  -- Calculate weight in tonnes
  -- listings.quantity is in the unit specified (kg, tonnes, units, etc.)
  v_weight_tonnes := CASE v_listing.unit
    WHEN 'kg' THEN v_listing.quantity / 1000.0
    WHEN 'tonnes' THEN v_listing.quantity
    ELSE v_listing.quantity / 1000.0 -- default assume kg
  END;

  IF v_weight_tonnes <= 0 THEN v_weight_tonnes := 0.001; END IF;

  -- Calculate CO2
  v_co2_virgin := v_weight_tonnes * v_emission.virgin_production_factor;
  v_co2_recycling := v_weight_tonnes * v_emission.recycling_process_factor;
  v_co2_avoided := v_co2_virgin - v_co2_recycling;
  v_co2_transport := v_weight_tonnes * COALESCE(100, 0) * COALESCE(v_transport.emission_factor, 0.049); -- default 100km
  v_co2_net := v_co2_avoided - v_co2_transport;
  v_co2_landfill := v_weight_tonnes * v_emission.landfill_factor;

  -- Insert carbon record for SELLER
  INSERT INTO public.carbon_records (
    transaction_id, account_id, material_category, material_subcategory,
    weight_tonnes, transport_mode, distance_km,
    origin_location, destination_location,
    co2_virgin_production, co2_recycling_process, co2_avoided,
    co2_transport, co2_net_benefit, co2_landfill_avoided,
    emission_factor_id, transport_factor_id
  ) VALUES (
    p_transaction_id, v_tx.seller_account_id, v_category, v_emission.material_subcategory,
    v_weight_tonnes, 'road_truck', 100,
    v_listing.location_city, NULL,
    v_co2_virgin, v_co2_recycling, v_co2_avoided,
    v_co2_transport, v_co2_net, v_co2_landfill,
    v_emission.id, v_transport.id
  ) RETURNING id INTO v_record_id;

  -- Insert carbon record for BUYER (they also benefit)
  INSERT INTO public.carbon_records (
    transaction_id, account_id, material_category, material_subcategory,
    weight_tonnes, transport_mode, distance_km,
    origin_location,
    co2_virgin_production, co2_recycling_process, co2_avoided,
    co2_transport, co2_net_benefit, co2_landfill_avoided,
    emission_factor_id, transport_factor_id
  ) VALUES (
    p_transaction_id, v_tx.buyer_account_id, v_category, v_emission.material_subcategory,
    v_weight_tonnes, 'road_truck', 100,
    v_listing.location_city,
    v_co2_virgin, v_co2_recycling, v_co2_avoided,
    v_co2_transport, v_co2_net, v_co2_landfill,
    v_emission.id, v_transport.id
  );

  -- Update transaction
  UPDATE public.marketplace_transactions SET carbon_record_id = v_record_id WHERE id = p_transaction_id;

  RETURN v_record_id;
END;
$$;

-- ============================================================
-- FUNCTION: Generate blockchain record
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_blockchain_record(
  p_transaction_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tx RECORD;
  v_listing RECORD;
  v_carbon RECORD;
  v_seller RECORD;
  v_buyer RECORD;
  v_previous_hash TEXT;
  v_block_number BIGINT;
  v_hashed_data JSONB;
  v_record_hash TEXT;
BEGIN
  SELECT * INTO v_tx FROM public.marketplace_transactions WHERE id = p_transaction_id;
  SELECT * INTO v_listing FROM public.listings WHERE id = v_tx.listing_id;
  SELECT * INTO v_carbon FROM public.carbon_records WHERE transaction_id = p_transaction_id LIMIT 1;
  SELECT name INTO v_seller FROM public.accounts WHERE id = v_tx.seller_account_id;
  SELECT name INTO v_buyer FROM public.accounts WHERE id = v_tx.buyer_account_id;

  -- Get previous hash
  SELECT record_hash, block_number INTO v_previous_hash, v_block_number
  FROM public.blockchain_records ORDER BY block_number DESC LIMIT 1;

  v_block_number := COALESCE(v_block_number, 0) + 1;

  -- Build data to hash
  v_hashed_data := jsonb_build_object(
    'block_number', v_block_number,
    'previous_hash', COALESCE(v_previous_hash, 'GENESIS'),
    'timestamp', NOW(),
    'transaction', jsonb_build_object(
      'id', v_tx.id,
      'listing_id', v_tx.listing_id,
      'listing_title', v_listing.title,
      'total_amount_cents', v_tx.total_amount,
      'seller', v_seller.name,
      'buyer', v_buyer.name,
      'paid_at', v_tx.paid_at,
      'delivered_at', v_tx.delivery_confirmed_at
    ),
    'carbon', jsonb_build_object(
      'co2_avoided_kg', COALESCE(v_carbon.co2_avoided, 0),
      'co2_transport_kg', COALESCE(v_carbon.co2_transport, 0),
      'co2_net_benefit_kg', COALESCE(v_carbon.co2_net_benefit, 0),
      'weight_tonnes', COALESCE(v_carbon.weight_tonnes, 0),
      'material', COALESCE(v_carbon.material_category, 'unknown')
    ),
    'platform', 'GreenEcoGenius',
    'version', '1.0'
  );

  -- Generate SHA-256 hash
  v_record_hash := encode(digest(v_hashed_data::TEXT, 'sha256'), 'hex');

  -- Insert
  INSERT INTO public.blockchain_records (
    transaction_id, listing_id, record_hash, previous_hash,
    block_number, hashed_data
  ) VALUES (
    p_transaction_id, v_tx.listing_id, v_record_hash,
    COALESCE(v_previous_hash, 'GENESIS'),
    v_block_number, v_hashed_data
  );

  -- Update transaction
  UPDATE public.marketplace_transactions SET blockchain_hash = v_record_hash WHERE id = p_transaction_id;

  RETURN v_record_hash;
END;
$$;
