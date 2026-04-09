-- =============================================================
-- GreenEcoGenius - Import données matières recyclables par région
-- Généré le 2026-04-03 06:48:15
-- Sources: ADEME/SINOE + MODECOM 2024 (data.ademe.fr)
-- Année de référence: 2021
-- =============================================================

-- Table principale: stats matières par région
CREATE TABLE IF NOT EXISTS material_stats_by_region (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plastique','metal','papier','verre','bois','textile','organique','mineral')),
  tonnage_tonnes NUMERIC(12,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) DEFAULT 0,
  data_year INTEGER NOT NULL,
  source TEXT DEFAULT 'ADEME/SINOE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(region_code, category, data_year)
);

CREATE INDEX IF NOT EXISTS idx_msbr_region ON material_stats_by_region(region_code);
CREATE INDEX IF NOT EXISTS idx_msbr_category ON material_stats_by_region(category);
CREATE INDEX IF NOT EXISTS idx_msbr_year ON material_stats_by_region(data_year);

ALTER TABLE material_stats_by_region ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_material_stats') THEN
    CREATE POLICY public_read_material_stats ON material_stats_by_region FOR SELECT USING (true);
  END IF;
END $$;

-- Données 2021 - 13 régions × 8 catégories

-- Île-de-France
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('11', 'Île-de-France', 'plastique', 1725753.21, 15.94, 2021),
  ('11', 'Île-de-France', 'metal', 683953.72, 6.32, 2021),
  ('11', 'Île-de-France', 'papier', 1359670.13, 12.56, 2021),
  ('11', 'Île-de-France', 'verre', 789363.81, 7.29, 2021),
  ('11', 'Île-de-France', 'bois', 894660.61, 8.26, 2021),
  ('11', 'Île-de-France', 'textile', 861319.25, 7.95, 2021),
  ('11', 'Île-de-France', 'organique', 3285808.53, 30.35, 2021),
  ('11', 'Île-de-France', 'mineral', 1227292.26, 11.33, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Centre-Val de Loire
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('24', 'Centre-Val de Loire', 'plastique', 397620.64, 13.22, 2021),
  ('24', 'Centre-Val de Loire', 'metal', 227248.16, 7.56, 2021),
  ('24', 'Centre-Val de Loire', 'papier', 342534.01, 11.39, 2021),
  ('24', 'Centre-Val de Loire', 'verre', 192497.46, 6.4, 2021),
  ('24', 'Centre-Val de Loire', 'bois', 267052.07, 8.88, 2021),
  ('24', 'Centre-Val de Loire', 'textile', 171631.11, 5.71, 2021),
  ('24', 'Centre-Val de Loire', 'organique', 947348.92, 31.5, 2021),
  ('24', 'Centre-Val de Loire', 'mineral', 461365.18, 15.34, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Bourgogne-Franche-Comté
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('27', 'Bourgogne-Franche-Comté', 'plastique', 441713.18, 14.22, 2021),
  ('27', 'Bourgogne-Franche-Comté', 'metal', 260233.03, 8.38, 2021),
  ('27', 'Bourgogne-Franche-Comté', 'papier', 419901.49, 13.52, 2021),
  ('27', 'Bourgogne-Franche-Comté', 'verre', 225740.94, 7.27, 2021),
  ('27', 'Bourgogne-Franche-Comté', 'bois', 249014.7, 8.02, 2021),
  ('27', 'Bourgogne-Franche-Comté', 'textile', 170704.65, 5.5, 2021),
  ('27', 'Bourgogne-Franche-Comté', 'organique', 867361.47, 27.93, 2021),
  ('27', 'Bourgogne-Franche-Comté', 'mineral', 471136.25, 15.17, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Normandie
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('28', 'Normandie', 'plastique', 571778.19, 12.67, 2021),
  ('28', 'Normandie', 'metal', 324412.83, 7.19, 2021),
  ('28', 'Normandie', 'papier', 484466.78, 10.73, 2021),
  ('28', 'Normandie', 'verre', 268970.53, 5.96, 2021),
  ('28', 'Normandie', 'bois', 394578.78, 8.74, 2021),
  ('28', 'Normandie', 'textile', 252177.22, 5.59, 2021),
  ('28', 'Normandie', 'organique', 1540311.51, 34.13, 2021),
  ('28', 'Normandie', 'mineral', 676707.31, 14.99, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Hauts-de-France
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('32', 'Hauts-de-France', 'plastique', 1041405.66, 14.15, 2021),
  ('32', 'Hauts-de-France', 'metal', 539968.55, 7.34, 2021),
  ('32', 'Hauts-de-France', 'papier', 915835.98, 12.45, 2021),
  ('32', 'Hauts-de-France', 'verre', 490175.77, 6.66, 2021),
  ('32', 'Hauts-de-France', 'bois', 604315.1, 8.21, 2021),
  ('32', 'Hauts-de-France', 'textile', 448228.73, 6.09, 2021),
  ('32', 'Hauts-de-France', 'organique', 2163032.97, 29.4, 2021),
  ('32', 'Hauts-de-France', 'mineral', 1154857.25, 15.7, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Grand Est
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('44', 'Grand Est', 'plastique', 875854.54, 14.74, 2021),
  ('44', 'Grand Est', 'metal', 480481.8, 8.08, 2021),
  ('44', 'Grand Est', 'papier', 785230.89, 13.21, 2021),
  ('44', 'Grand Est', 'verre', 428418.36, 7.21, 2021),
  ('44', 'Grand Est', 'bois', 532018.95, 8.95, 2021),
  ('44', 'Grand Est', 'textile', 364875.43, 6.14, 2021),
  ('44', 'Grand Est', 'organique', 1628391.0, 27.4, 2021),
  ('44', 'Grand Est', 'mineral', 848492.53, 14.28, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Pays de la Loire
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('52', 'Pays de la Loire', 'plastique', 571202.24, 12.44, 2021),
  ('52', 'Pays de la Loire', 'metal', 341956.35, 7.45, 2021),
  ('52', 'Pays de la Loire', 'papier', 524902.64, 11.43, 2021),
  ('52', 'Pays de la Loire', 'verre', 307375.79, 6.7, 2021),
  ('52', 'Pays de la Loire', 'bois', 380954.26, 8.3, 2021),
  ('52', 'Pays de la Loire', 'textile', 225530.12, 4.91, 2021),
  ('52', 'Pays de la Loire', 'organique', 1366411.01, 29.77, 2021),
  ('52', 'Pays de la Loire', 'mineral', 872103.45, 19.0, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Bretagne
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('53', 'Bretagne', 'plastique', 557590.64, 11.88, 2021),
  ('53', 'Bretagne', 'metal', 332575.68, 7.09, 2021),
  ('53', 'Bretagne', 'papier', 519994.9, 11.08, 2021),
  ('53', 'Bretagne', 'verre', 309614.73, 6.6, 2021),
  ('53', 'Bretagne', 'bois', 337984.6, 7.2, 2021),
  ('53', 'Bretagne', 'textile', 218538.25, 4.66, 2021),
  ('53', 'Bretagne', 'organique', 1643084.55, 35.02, 2021),
  ('53', 'Bretagne', 'mineral', 773019.01, 16.47, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Nouvelle-Aquitaine
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('75', 'Nouvelle-Aquitaine', 'plastique', 1048509.81, 13.36, 2021),
  ('75', 'Nouvelle-Aquitaine', 'metal', 587829.47, 7.49, 2021),
  ('75', 'Nouvelle-Aquitaine', 'papier', 953722.85, 12.16, 2021),
  ('75', 'Nouvelle-Aquitaine', 'verre', 516543.87, 6.58, 2021),
  ('75', 'Nouvelle-Aquitaine', 'bois', 611480.28, 7.79, 2021),
  ('75', 'Nouvelle-Aquitaine', 'textile', 430059.25, 5.48, 2021),
  ('75', 'Nouvelle-Aquitaine', 'organique', 2489846.44, 31.73, 2021),
  ('75', 'Nouvelle-Aquitaine', 'mineral', 1208100.61, 15.4, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Occitanie
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('76', 'Occitanie', 'plastique', 1043290.01, 14.07, 2021),
  ('76', 'Occitanie', 'metal', 530214.29, 7.15, 2021),
  ('76', 'Occitanie', 'papier', 917221.3, 12.37, 2021),
  ('76', 'Occitanie', 'verre', 487551.87, 6.58, 2021),
  ('76', 'Occitanie', 'bois', 581033.51, 7.84, 2021),
  ('76', 'Occitanie', 'textile', 454101.74, 6.12, 2021),
  ('76', 'Occitanie', 'organique', 2221916.81, 29.97, 2021),
  ('76', 'Occitanie', 'mineral', 1179018.82, 15.9, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Auvergne-Rhône-Alpes
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('84', 'Auvergne-Rhône-Alpes', 'plastique', 1284270.68, 14.54, 2021),
  ('84', 'Auvergne-Rhône-Alpes', 'metal', 695326.73, 7.87, 2021),
  ('84', 'Auvergne-Rhône-Alpes', 'papier', 1164861.89, 13.19, 2021),
  ('84', 'Auvergne-Rhône-Alpes', 'verre', 621366.42, 7.04, 2021),
  ('84', 'Auvergne-Rhône-Alpes', 'bois', 728473.13, 8.25, 2021),
  ('84', 'Auvergne-Rhône-Alpes', 'textile', 536039.24, 6.07, 2021),
  ('84', 'Auvergne-Rhône-Alpes', 'organique', 2502064.47, 28.33, 2021),
  ('84', 'Auvergne-Rhône-Alpes', 'mineral', 1298708.55, 14.71, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Provence-Alpes-Côte d''Azur
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('93', 'Provence-Alpes-Côte d''Azur', 'plastique', 986509.08, 13.92, 2021),
  ('93', 'Provence-Alpes-Côte d''Azur', 'metal', 440092.21, 6.21, 2021),
  ('93', 'Provence-Alpes-Côte d''Azur', 'papier', 801503.26, 11.31, 2021),
  ('93', 'Provence-Alpes-Côte d''Azur', 'verre', 432524.56, 6.1, 2021),
  ('93', 'Provence-Alpes-Côte d''Azur', 'bois', 534469.08, 7.54, 2021),
  ('93', 'Provence-Alpes-Côte d''Azur', 'textile', 477606.39, 6.74, 2021),
  ('93', 'Provence-Alpes-Côte d''Azur', 'organique', 2251009.4, 31.76, 2021),
  ('93', 'Provence-Alpes-Côte d''Azur', 'mineral', 1163220.38, 16.41, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Corse
INSERT INTO material_stats_by_region (region_code, region_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('94', 'Corse', 'plastique', 77898.38, 15.43, 2021),
  ('94', 'Corse', 'metal', 39165.47, 7.76, 2021),
  ('94', 'Corse', 'papier', 64327.76, 12.74, 2021),
  ('94', 'Corse', 'verre', 36695.96, 7.27, 2021),
  ('94', 'Corse', 'bois', 49680.46, 9.84, 2021),
  ('94', 'Corse', 'textile', 36794.28, 7.29, 2021),
  ('94', 'Corse', 'organique', 152677.94, 30.23, 2021),
  ('94', 'Corse', 'mineral', 47763.12, 9.46, 2021)
ON CONFLICT (region_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  region_name = EXCLUDED.region_name,
  updated_at = NOW();

-- Vue résumée pour l'API GreenEcoGenius
CREATE OR REPLACE VIEW material_stats_summary AS
SELECT
  category,
  SUM(tonnage_tonnes) AS total_tonnage_national,
  ROUND(SUM(tonnage_tonnes) / (SELECT SUM(tonnage_tonnes) FROM material_stats_by_region WHERE data_year = m.data_year) * 100, 2) AS national_percentage,
  COUNT(DISTINCT region_code) AS nb_regions,
  data_year
FROM material_stats_by_region m
GROUP BY category, data_year
ORDER BY total_tonnage_national DESC;

-- Vue par région avec classement
CREATE OR REPLACE VIEW material_stats_ranked AS
SELECT
  region_code, region_name, category,
  tonnage_tonnes, percentage,
  RANK() OVER (PARTITION BY region_code ORDER BY tonnage_tonnes DESC) AS rank_in_region,
  data_year
FROM material_stats_by_region;