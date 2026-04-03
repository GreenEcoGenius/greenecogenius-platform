-- =============================================================
-- GreenEcoGenius - Import données matières recyclables UE-27
-- Généré le 2026-04-03 07:07:17
-- Source: Eurostat env_wasgen (ec.europa.eu/eurostat)
-- Année de référence: 2022
-- =============================================================

-- Table: stats matières par pays européen
CREATE TABLE IF NOT EXISTS material_stats_by_country (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plastique','metal','papier','verre','bois','textile','organique','mineral')),
  tonnage_tonnes NUMERIC(14,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) DEFAULT 0,
  data_year INTEGER NOT NULL,
  source TEXT DEFAULT 'Eurostat/env_wasgen',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_code, category, data_year)
);

CREATE INDEX IF NOT EXISTS idx_msbc_country ON material_stats_by_country(country_code);
CREATE INDEX IF NOT EXISTS idx_msbc_category ON material_stats_by_country(category);
CREATE INDEX IF NOT EXISTS idx_msbc_year ON material_stats_by_country(data_year);

ALTER TABLE material_stats_by_country ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_material_stats_country') THEN
    CREATE POLICY public_read_material_stats_country ON material_stats_by_country FOR SELECT USING (true);
  END IF;
END $$;


-- Autriche (AT)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('AT', 'Autriche', 'plastique', 423589.0, 1.92, 2022),
  ('AT', 'Autriche', 'metal', 2890842.0, 13.13, 2022),
  ('AT', 'Autriche', 'papier', 1810359.0, 8.22, 2022),
  ('AT', 'Autriche', 'verre', 375765.0, 1.71, 2022),
  ('AT', 'Autriche', 'bois', 1150450.0, 5.22, 2022),
  ('AT', 'Autriche', 'textile', 68290.0, 0.31, 2022),
  ('AT', 'Autriche', 'organique', 2277216.0, 10.34, 2022),
  ('AT', 'Autriche', 'mineral', 13023776.0, 59.14, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Belgique (BE)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('BE', 'Belgique', 'plastique', 768882.0, 1.84, 2022),
  ('BE', 'Belgique', 'metal', 7913681.0, 18.97, 2022),
  ('BE', 'Belgique', 'papier', 2686775.0, 6.44, 2022),
  ('BE', 'Belgique', 'verre', 1295904.0, 3.11, 2022),
  ('BE', 'Belgique', 'bois', 2574195.0, 6.17, 2022),
  ('BE', 'Belgique', 'textile', 167147.0, 0.4, 2022),
  ('BE', 'Belgique', 'organique', 4010267.0, 9.61, 2022),
  ('BE', 'Belgique', 'mineral', 22302055.0, 53.46, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Bulgarie (BG)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('BG', 'Bulgarie', 'plastique', 335957.0, 1.78, 2022),
  ('BG', 'Bulgarie', 'metal', 1457251.0, 7.73, 2022),
  ('BG', 'Bulgarie', 'papier', 693317.0, 3.68, 2022),
  ('BG', 'Bulgarie', 'verre', 469876.0, 2.49, 2022),
  ('BG', 'Bulgarie', 'bois', 603779.0, 3.2, 2022),
  ('BG', 'Bulgarie', 'textile', 32044.0, 0.17, 2022),
  ('BG', 'Bulgarie', 'organique', 1214263.0, 6.44, 2022),
  ('BG', 'Bulgarie', 'mineral', 14035484.0, 74.49, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Chypre (CY)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('CY', 'Chypre', 'plastique', 19139.0, 1.42, 2022),
  ('CY', 'Chypre', 'metal', 24071.0, 1.78, 2022),
  ('CY', 'Chypre', 'papier', 60778.0, 4.5, 2022),
  ('CY', 'Chypre', 'verre', 19548.0, 1.45, 2022),
  ('CY', 'Chypre', 'bois', 9047.0, 0.67, 2022),
  ('CY', 'Chypre', 'textile', 2806.0, 0.21, 2022),
  ('CY', 'Chypre', 'organique', 861722.0, 63.8, 2022),
  ('CY', 'Chypre', 'mineral', 353504.0, 26.17, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Tchéquie (CZ)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('CZ', 'Tchéquie', 'plastique', 624067.0, 3.82, 2022),
  ('CZ', 'Tchéquie', 'metal', 5247508.0, 32.12, 2022),
  ('CZ', 'Tchéquie', 'papier', 1406994.0, 8.61, 2022),
  ('CZ', 'Tchéquie', 'verre', 309300.0, 1.89, 2022),
  ('CZ', 'Tchéquie', 'bois', 269722.0, 1.65, 2022),
  ('CZ', 'Tchéquie', 'textile', 110712.0, 0.68, 2022),
  ('CZ', 'Tchéquie', 'organique', 1179571.0, 7.22, 2022),
  ('CZ', 'Tchéquie', 'mineral', 7188113.0, 44.0, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Allemagne (DE)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('DE', 'Allemagne', 'plastique', 3165373.0, 2.12, 2022),
  ('DE', 'Allemagne', 'metal', 11528972.0, 7.72, 2022),
  ('DE', 'Allemagne', 'papier', 6743766.0, 4.52, 2022),
  ('DE', 'Allemagne', 'verre', 3273121.0, 2.19, 2022),
  ('DE', 'Allemagne', 'bois', 12456812.0, 8.34, 2022),
  ('DE', 'Allemagne', 'textile', 273819.0, 0.18, 2022),
  ('DE', 'Allemagne', 'organique', 15389992.0, 10.31, 2022),
  ('DE', 'Allemagne', 'mineral', 96454915.0, 64.61, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Danemark (DK)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('DK', 'Danemark', 'plastique', 150333.0, 1.58, 2022),
  ('DK', 'Danemark', 'metal', 1468446.0, 15.48, 2022),
  ('DK', 'Danemark', 'papier', 613186.0, 6.46, 2022),
  ('DK', 'Danemark', 'verre', 198812.0, 2.1, 2022),
  ('DK', 'Danemark', 'bois', 642548.0, 6.77, 2022),
  ('DK', 'Danemark', 'textile', 20194.0, 0.21, 2022),
  ('DK', 'Danemark', 'organique', 1895928.0, 19.99, 2022),
  ('DK', 'Danemark', 'mineral', 4496440.0, 47.4, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Estonie (EE)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('EE', 'Estonie', 'plastique', 38536.0, 0.45, 2022),
  ('EE', 'Estonie', 'metal', 611821.0, 7.18, 2022),
  ('EE', 'Estonie', 'papier', 95052.0, 1.12, 2022),
  ('EE', 'Estonie', 'verre', 50874.0, 0.6, 2022),
  ('EE', 'Estonie', 'bois', 168230.0, 1.97, 2022),
  ('EE', 'Estonie', 'textile', 3064.0, 0.04, 2022),
  ('EE', 'Estonie', 'organique', 265539.0, 3.12, 2022),
  ('EE', 'Estonie', 'mineral', 7286472.0, 85.53, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Grèce (EL)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('EL', 'Grèce', 'plastique', 220655.0, 2.21, 2022),
  ('EL', 'Grèce', 'metal', 1173021.0, 11.76, 2022),
  ('EL', 'Grèce', 'papier', 722053.0, 7.24, 2022),
  ('EL', 'Grèce', 'verre', 68982.0, 0.69, 2022),
  ('EL', 'Grèce', 'bois', 73168.0, 0.73, 2022),
  ('EL', 'Grèce', 'textile', 9790.0, 0.1, 2022),
  ('EL', 'Grèce', 'organique', 1769747.0, 17.75, 2022),
  ('EL', 'Grèce', 'mineral', 5934397.0, 59.51, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Espagne (ES)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('ES', 'Espagne', 'plastique', 1122142.0, 2.79, 2022),
  ('ES', 'Espagne', 'metal', 5810746.0, 14.44, 2022),
  ('ES', 'Espagne', 'papier', 4014471.0, 9.98, 2022),
  ('ES', 'Espagne', 'verre', 1406841.0, 3.5, 2022),
  ('ES', 'Espagne', 'bois', 1089091.0, 2.71, 2022),
  ('ES', 'Espagne', 'textile', 102756.0, 0.26, 2022),
  ('ES', 'Espagne', 'organique', 9303116.0, 23.12, 2022),
  ('ES', 'Espagne', 'mineral', 17386612.0, 43.21, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Finlande (FI)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('FI', 'Finlande', 'plastique', 131226.0, 1.89, 2022),
  ('FI', 'Finlande', 'metal', 371450.0, 5.34, 2022),
  ('FI', 'Finlande', 'papier', 484038.0, 6.96, 2022),
  ('FI', 'Finlande', 'verre', 128671.0, 1.85, 2022),
  ('FI', 'Finlande', 'bois', 2232278.0, 32.1, 2022),
  ('FI', 'Finlande', 'textile', 5832.0, 0.08, 2022),
  ('FI', 'Finlande', 'organique', 1197197.0, 17.22, 2022),
  ('FI', 'Finlande', 'mineral', 2402816.0, 34.56, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- France (FR)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('FR', 'France', 'plastique', 2482433.0, 2.02, 2022),
  ('FR', 'France', 'metal', 15766593.0, 12.81, 2022),
  ('FR', 'France', 'papier', 6569800.0, 5.34, 2022),
  ('FR', 'France', 'verre', 2612137.0, 2.12, 2022),
  ('FR', 'France', 'bois', 8529277.0, 6.93, 2022),
  ('FR', 'France', 'textile', 296445.0, 0.24, 2022),
  ('FR', 'France', 'organique', 12771984.0, 10.38, 2022),
  ('FR', 'France', 'mineral', 74036220.0, 60.16, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Croatie (HR)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('HR', 'Croatie', 'plastique', 182468.0, 4.93, 2022),
  ('HR', 'Croatie', 'metal', 1125268.0, 30.41, 2022),
  ('HR', 'Croatie', 'papier', 474993.0, 12.84, 2022),
  ('HR', 'Croatie', 'verre', 136866.0, 3.7, 2022),
  ('HR', 'Croatie', 'bois', 167759.0, 4.53, 2022),
  ('HR', 'Croatie', 'textile', 12906.0, 0.35, 2022),
  ('HR', 'Croatie', 'organique', 860552.0, 23.25, 2022),
  ('HR', 'Croatie', 'mineral', 739930.0, 19.99, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Hongrie (HU)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('HU', 'Hongrie', 'plastique', 267625.0, 1.82, 2022),
  ('HU', 'Hongrie', 'metal', 2103465.0, 14.27, 2022),
  ('HU', 'Hongrie', 'papier', 788433.0, 5.35, 2022),
  ('HU', 'Hongrie', 'verre', 174828.0, 1.19, 2022),
  ('HU', 'Hongrie', 'bois', 143573.0, 0.97, 2022),
  ('HU', 'Hongrie', 'textile', 22041.0, 0.15, 2022),
  ('HU', 'Hongrie', 'organique', 1021076.0, 6.93, 2022),
  ('HU', 'Hongrie', 'mineral', 10220632.0, 69.33, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Irlande (IE)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('IE', 'Irlande', 'plastique', 233858.0, 5.34, 2022),
  ('IE', 'Irlande', 'metal', 447324.0, 10.22, 2022),
  ('IE', 'Irlande', 'papier', 827313.0, 18.89, 2022),
  ('IE', 'Irlande', 'verre', 135735.0, 3.1, 2022),
  ('IE', 'Irlande', 'bois', 297472.0, 6.79, 2022),
  ('IE', 'Irlande', 'textile', 6586.0, 0.15, 2022),
  ('IE', 'Irlande', 'organique', 1132707.0, 25.87, 2022),
  ('IE', 'Irlande', 'mineral', 1297785.0, 29.64, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Italie (IT)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('IT', 'Italie', 'plastique', 5340127.0, 5.09, 2022),
  ('IT', 'Italie', 'metal', 13079514.0, 12.48, 2022),
  ('IT', 'Italie', 'papier', 5953007.0, 5.68, 2022),
  ('IT', 'Italie', 'verre', 3763002.0, 3.59, 2022),
  ('IT', 'Italie', 'bois', 6243439.0, 5.96, 2022),
  ('IT', 'Italie', 'textile', 456244.0, 0.44, 2022),
  ('IT', 'Italie', 'organique', 8663986.0, 8.26, 2022),
  ('IT', 'Italie', 'mineral', 61328282.0, 58.5, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Lituanie (LT)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('LT', 'Lituanie', 'plastique', 126647.0, 4.84, 2022),
  ('LT', 'Lituanie', 'metal', 799169.0, 30.55, 2022),
  ('LT', 'Lituanie', 'papier', 219819.0, 8.4, 2022),
  ('LT', 'Lituanie', 'verre', 95050.0, 3.63, 2022),
  ('LT', 'Lituanie', 'bois', 130168.0, 4.98, 2022),
  ('LT', 'Lituanie', 'textile', 19358.0, 0.74, 2022),
  ('LT', 'Lituanie', 'organique', 422999.0, 16.17, 2022),
  ('LT', 'Lituanie', 'mineral', 802322.0, 30.68, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Luxembourg (LU)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('LU', 'Luxembourg', 'plastique', 31899.0, 1.16, 2022),
  ('LU', 'Luxembourg', 'metal', 196215.0, 7.17, 2022),
  ('LU', 'Luxembourg', 'papier', 84364.0, 3.08, 2022),
  ('LU', 'Luxembourg', 'verre', 41103.0, 1.5, 2022),
  ('LU', 'Luxembourg', 'bois', 86445.0, 3.16, 2022),
  ('LU', 'Luxembourg', 'textile', 5865.0, 0.21, 2022),
  ('LU', 'Luxembourg', 'organique', 127081.0, 4.64, 2022),
  ('LU', 'Luxembourg', 'mineral', 2165369.0, 79.08, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Lettonie (LV)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('LV', 'Lettonie', 'plastique', 89299.0, 8.4, 2022),
  ('LV', 'Lettonie', 'metal', 171512.0, 16.14, 2022),
  ('LV', 'Lettonie', 'papier', 120537.0, 11.35, 2022),
  ('LV', 'Lettonie', 'verre', 55723.0, 5.24, 2022),
  ('LV', 'Lettonie', 'bois', 86330.0, 8.13, 2022),
  ('LV', 'Lettonie', 'textile', 1574.0, 0.15, 2022),
  ('LV', 'Lettonie', 'organique', 110345.0, 10.39, 2022),
  ('LV', 'Lettonie', 'mineral', 427133.0, 40.2, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Malte (MT)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('MT', 'Malte', 'plastique', 4799.0, 0.22, 2022),
  ('MT', 'Malte', 'metal', 97870.0, 4.45, 2022),
  ('MT', 'Malte', 'papier', 36413.0, 1.66, 2022),
  ('MT', 'Malte', 'verre', 8445.0, 0.38, 2022),
  ('MT', 'Malte', 'bois', 9325.0, 0.42, 2022),
  ('MT', 'Malte', 'textile', 1172.0, 0.05, 2022),
  ('MT', 'Malte', 'organique', 35283.0, 1.61, 2022),
  ('MT', 'Malte', 'mineral', 2003829.0, 91.2, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Pays-Bas (NL)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('NL', 'Pays-Bas', 'plastique', 649222.0, 1.37, 2022),
  ('NL', 'Pays-Bas', 'metal', 2885311.0, 6.09, 2022),
  ('NL', 'Pays-Bas', 'papier', 2016980.0, 4.26, 2022),
  ('NL', 'Pays-Bas', 'verre', 672492.0, 1.42, 2022),
  ('NL', 'Pays-Bas', 'bois', 2716081.0, 5.74, 2022),
  ('NL', 'Pays-Bas', 'textile', 148765.0, 0.31, 2022),
  ('NL', 'Pays-Bas', 'organique', 15866988.0, 33.51, 2022),
  ('NL', 'Pays-Bas', 'mineral', 22395132.0, 47.3, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Pologne (PL)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('PL', 'Pologne', 'plastique', 2394068.0, 4.96, 2022),
  ('PL', 'Pologne', 'metal', 8507870.0, 17.64, 2022),
  ('PL', 'Pologne', 'papier', 3459939.0, 7.17, 2022),
  ('PL', 'Pologne', 'verre', 1695132.0, 3.51, 2022),
  ('PL', 'Pologne', 'bois', 1314799.0, 2.73, 2022),
  ('PL', 'Pologne', 'textile', 141252.0, 0.29, 2022),
  ('PL', 'Pologne', 'organique', 3437765.0, 7.13, 2022),
  ('PL', 'Pologne', 'mineral', 27288744.0, 56.57, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Portugal (PT)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('PT', 'Portugal', 'plastique', 364365.0, 4.2, 2022),
  ('PT', 'Portugal', 'metal', 2674526.0, 30.86, 2022),
  ('PT', 'Portugal', 'papier', 1200672.0, 13.86, 2022),
  ('PT', 'Portugal', 'verre', 447742.0, 5.17, 2022),
  ('PT', 'Portugal', 'bois', 585491.0, 6.76, 2022),
  ('PT', 'Portugal', 'textile', 80842.0, 0.93, 2022),
  ('PT', 'Portugal', 'organique', 465981.0, 5.38, 2022),
  ('PT', 'Portugal', 'mineral', 2845727.0, 32.84, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Roumanie (RO)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('RO', 'Roumanie', 'plastique', 319205.0, 2.27, 2022),
  ('RO', 'Roumanie', 'metal', 1992592.0, 14.19, 2022),
  ('RO', 'Roumanie', 'papier', 641724.0, 4.57, 2022),
  ('RO', 'Roumanie', 'verre', 303936.0, 2.16, 2022),
  ('RO', 'Roumanie', 'bois', 2599008.0, 18.51, 2022),
  ('RO', 'Roumanie', 'textile', 34089.0, 0.24, 2022),
  ('RO', 'Roumanie', 'organique', 1258258.0, 8.96, 2022),
  ('RO', 'Roumanie', 'mineral', 6890224.0, 49.08, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Suède (SE)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('SE', 'Suède', 'plastique', 473264.0, 3.12, 2022),
  ('SE', 'Suède', 'metal', 3063044.0, 20.19, 2022),
  ('SE', 'Suède', 'papier', 1596930.0, 10.53, 2022),
  ('SE', 'Suède', 'verre', 280665.0, 1.85, 2022),
  ('SE', 'Suède', 'bois', 1850463.0, 12.2, 2022),
  ('SE', 'Suède', 'textile', 12307.0, 0.08, 2022),
  ('SE', 'Suède', 'organique', 3040042.0, 20.04, 2022),
  ('SE', 'Suède', 'mineral', 4854111.0, 32.0, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Slovénie (SI)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('SI', 'Slovénie', 'plastique', 63075.0, 2.17, 2022),
  ('SI', 'Slovénie', 'metal', 553299.0, 19.07, 2022),
  ('SI', 'Slovénie', 'papier', 200153.0, 6.9, 2022),
  ('SI', 'Slovénie', 'verre', 77493.0, 2.67, 2022),
  ('SI', 'Slovénie', 'bois', 128762.0, 4.44, 2022),
  ('SI', 'Slovénie', 'textile', 12301.0, 0.42, 2022),
  ('SI', 'Slovénie', 'organique', 238389.0, 8.22, 2022),
  ('SI', 'Slovénie', 'mineral', 1627923.0, 56.11, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Slovaquie (SK)
INSERT INTO material_stats_by_country (country_code, country_name, category, tonnage_tonnes, percentage, data_year) VALUES
  ('SK', 'Slovaquie', 'plastique', 231232.0, 3.32, 2022),
  ('SK', 'Slovaquie', 'metal', 2161651.0, 31.0, 2022),
  ('SK', 'Slovaquie', 'papier', 361747.0, 5.19, 2022),
  ('SK', 'Slovaquie', 'verre', 109285.0, 1.57, 2022),
  ('SK', 'Slovaquie', 'bois', 534454.0, 7.66, 2022),
  ('SK', 'Slovaquie', 'textile', 21101.0, 0.3, 2022),
  ('SK', 'Slovaquie', 'organique', 953487.0, 13.67, 2022),
  ('SK', 'Slovaquie', 'mineral', 2600415.0, 37.29, 2022)
ON CONFLICT (country_code, category, data_year) DO UPDATE SET
  tonnage_tonnes = EXCLUDED.tonnage_tonnes,
  percentage = EXCLUDED.percentage,
  country_name = EXCLUDED.country_name,
  updated_at = NOW();

-- Vue résumée UE-27
CREATE OR REPLACE VIEW eu27_material_stats_summary AS
SELECT
  category,
  SUM(tonnage_tonnes) AS total_tonnage_eu27,
  ROUND(SUM(tonnage_tonnes) / NULLIF((SELECT SUM(tonnage_tonnes) FROM material_stats_by_country WHERE data_year = m.data_year), 0) * 100, 2) AS eu27_percentage,
  COUNT(DISTINCT country_code) AS nb_countries,
  data_year
FROM material_stats_by_country m
WHERE country_code != 'US'
GROUP BY category, data_year
ORDER BY total_tonnage_eu27 DESC;