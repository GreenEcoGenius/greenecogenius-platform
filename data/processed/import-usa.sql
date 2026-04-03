-- =============================================================
-- GreenEcoGenius - Import données matières recyclables USA
-- Généré le 2026-04-03 07:07:17
-- Source: EPA Facts and Figures about Materials, Waste and Recycling
-- Année de référence: 2018
-- =============================================================

-- Réutilise la table material_stats_by_country (créée dans import-europe.sql)
-- Si exécuté seul, décommenter le CREATE TABLE ci-dessous:
/*
CREATE TABLE IF NOT EXISTS material_stats_by_country (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plastique','metal','papier','verre','bois','textile','organique','mineral')),
  tonnage_tonnes NUMERIC(14,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) DEFAULT 0,
  data_year INTEGER NOT NULL,
  source TEXT DEFAULT 'EPA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_code, category, data_year)
);
*/

-- États-Unis (US) - données nationales 2018
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year, source) VALUES
  ('US', 'États-Unis', 'plastique', 32368360.8, 12.39, 2018, 'EPA'),
  ('US', 'États-Unis', 'metal', 23223936.0, 8.89, 2018, 'EPA'),
  ('US', 'États-Unis', 'papier', 61135197.15, 23.4, 2018, 'EPA'),
  ('US', 'États-Unis', 'verre', 11113016.25, 4.25, 2018, 'EPA'),
  ('US', 'États-Unis', 'bois', 16410976.65, 6.28, 2018, 'EPA'),
  ('US', 'États-Unis', 'textile', 15449360.55, 5.91, 2018, 'EPA'),
  ('US', 'États-Unis', 'organique', 89384938.05, 34.21, 2018, 'EPA'),
  ('US', 'États-Unis', 'mineral', 12201638.25, 4.67, 2018, 'EPA')
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  source = EXCLUDED.source,
  updated_at = NOW();

-- Vue comparative globale (France régions + UE-27 + USA)
CREATE OR REPLACE VIEW global_material_overview AS
SELECT
  'france' AS scope,
  region_name AS entity_name,
  region_code AS entity_code,
  category, tonnage_tonnes, percentage, data_year
FROM material_stats_by_region
UNION ALL
SELECT
  CASE WHEN country_code = 'US' THEN 'usa' ELSE 'europe' END AS scope,
  country_name AS entity_name,
  country_code AS entity_code,
  category, tonnage_tonnes, percentage, data_year
FROM material_stats_by_country;