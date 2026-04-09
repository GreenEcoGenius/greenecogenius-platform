-- =============================================================
-- GreenEcoGenius — Explorateur de Matières
-- 00_setup_tables.sql — Création des tables + RLS
-- Exécuter EN PREMIER dans Supabase SQL Editor
-- =============================================================

-- Supprimer les anciennes tables
DROP TABLE IF EXISTS material_sources CASCADE;
DROP TABLE IF EXISTS material_stats_by_region CASCADE;
DROP TABLE IF EXISTS material_stats_national CASCADE;
-- Anciennes tables de la v1
DROP TABLE IF EXISTS material_stats_by_country CASCADE;
DROP TABLE IF EXISTS national_waste_composition CASCADE;

-- Table : sources de matières (points géolocalisés sur la carte)
CREATE TABLE material_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  region TEXT NOT NULL,
  department TEXT,
  country TEXT NOT NULL DEFAULT 'FR',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  annual_volume_tonnes NUMERIC,
  price_per_tonne NUMERIC,
  price_currency TEXT DEFAULT 'EUR',
  price_trend TEXT CHECK (price_trend IN ('up', 'down', 'stable')),
  source_type TEXT CHECK (source_type IN ('collector', 'recycler', 'manufacturer', 'municipality', 'other')),
  data_source TEXT NOT NULL,
  data_source_url TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table : stats agrégées par région/état
CREATE TABLE material_stats_by_region (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  annual_volume_tonnes NUMERIC,
  recycling_rate NUMERIC,
  recovery_rate NUMERIC,
  avg_price_per_tonne NUMERIC,
  price_currency TEXT DEFAULT 'EUR',
  year INTEGER NOT NULL,
  data_source TEXT NOT NULL,
  data_source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table : stats agrégées nationales
CREATE TABLE material_stats_national (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  category TEXT NOT NULL,
  annual_volume_tonnes NUMERIC,
  recycling_rate NUMERIC,
  recovery_rate NUMERIC,
  landfill_rate NUMERIC,
  avg_price_per_tonne NUMERIC,
  price_currency TEXT DEFAULT 'EUR',
  year INTEGER NOT NULL,
  data_source TEXT NOT NULL,
  data_source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_sources_country ON material_sources(country);
CREATE INDEX idx_sources_category ON material_sources(category);
CREATE INDEX idx_sources_region ON material_sources(region);
CREATE INDEX idx_stats_region_country ON material_stats_by_region(country);
CREATE INDEX idx_stats_region_category ON material_stats_by_region(category);
CREATE INDEX idx_stats_national_country ON material_stats_national(country);
CREATE INDEX idx_stats_national_code ON material_stats_national(country_code);
CREATE INDEX idx_stats_national_category ON material_stats_national(category);

-- RLS : lecture publique (Explorateur accessible sans login)
ALTER TABLE material_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_stats_by_region ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_stats_national ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read material_sources" ON material_sources FOR SELECT USING (true);
CREATE POLICY "Public read material_stats_by_region" ON material_stats_by_region FOR SELECT USING (true);
CREATE POLICY "Public read material_stats_national" ON material_stats_national FOR SELECT USING (true);
