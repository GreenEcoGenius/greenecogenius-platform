-- ============================================================
-- DONNÉES EUROPE — Source : Eurostat (env_wasgen + env_waspac + env_wasmun)
-- Téléchargées le 2026-04-04
-- ============================================================

-- Stats nationales Europe (252 lignes)

-- Autriche (AT)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Autriche', 'AT', 'BTP', 11522714.0, NULL, 98.3, 1.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'Biodéchets', 2277216.0, NULL, 98.3, 1.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'Bois', 1150450.0, 29.2, 98.3, 1.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'DEEE', 221713.0, NULL, 98.3, 1.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'Métaux', 2890842.0, 83.3, 98.3, 1.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'Papier-Carton', 1810359.0, 79.6, 98.3, 1.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'Plastiques', 423589.0, 26.9, 98.3, 1.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'Textiles', 68290.0, NULL, 98.3, 1.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Autriche', 'AT', 'Verre', 375765.0, 79.3, 98.3, 1.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Belgique (BE)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Belgique', 'BE', 'BTP', 21781829.0, NULL, 99.9, 0.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'Biodéchets', 4010267.0, NULL, 99.9, 0.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'Bois', 2574195.0, 65.5, 99.9, 0.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'DEEE', 436784.0, NULL, 99.9, 0.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'Métaux', 7913681.0, 96.8, 99.9, 0.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'Papier-Carton', 2686775.0, 83.9, 99.9, 0.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'Plastiques', 768882.0, 59.5, 99.9, 0.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'Textiles', 167147.0, NULL, 99.9, 0.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Belgique', 'BE', 'Verre', 1295904.0, 92.9, 99.9, 0.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Bulgarie (BG)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Bulgarie', 'BG', 'BTP', 559250.0, NULL, 19.9, 44.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'Biodéchets', 1214263.0, NULL, 19.9, 44.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'Bois', 603779.0, 24.8, 19.9, 44.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'DEEE', 273630.0, NULL, 19.9, 44.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'Métaux', 1457251.0, 63.3, 19.9, 44.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'Papier-Carton', 693317.0, 96.5, 19.9, 44.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'Plastiques', 335957.0, 39.5, 19.9, 44.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'Textiles', 32044.0, NULL, 19.9, 44.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Bulgarie', 'BG', 'Verre', 469876.0, 72.8, 19.9, 44.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Chypre (CY)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Chypre', 'CY', 'BTP', 341061.0, NULL, 18.2, 66.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'Biodéchets', 861722.0, NULL, 18.2, 66.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'Bois', 9047.0, 0.4, 18.2, 66.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'DEEE', 18074.0, NULL, 18.2, 66.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'Métaux', 24071.0, 100.0, 18.2, 66.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'Papier-Carton', 60778.0, 100.0, 18.2, 66.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'Plastiques', 19139.0, 39.1, 18.2, 66.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'Textiles', 2806.0, NULL, 18.2, 66.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Chypre', 'CY', 'Verre', 19548.0, 43.3, 18.2, 66.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Tchéquie (CZ)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Tchéquie', 'CZ', 'BTP', 6545947.0, NULL, 57.6, 42.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'Biodéchets', 1179571.0, NULL, 57.6, 42.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'Bois', 269722.0, 36.6, 57.6, 42.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'DEEE', 497518.0, NULL, 57.6, 42.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'Métaux', 5247508.0, 71.4, 57.6, 42.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'Papier-Carton', 1406994.0, 97.9, 57.6, 42.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'Plastiques', 624067.0, 52.4, 57.6, 42.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'Textiles', 110712.0, NULL, 57.6, 42.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Tchéquie', 'CZ', 'Verre', 309300.0, 77.6, 57.6, 42.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Allemagne (DE)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Allemagne', 'DE', 'BTP', 83934510.0, NULL, 96.6, 1.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'Biodéchets', 15389992.0, NULL, 96.6, 1.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'Bois', 12456812.0, 30.2, 96.6, 1.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'DEEE', 2017594.0, NULL, 96.6, 1.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'Métaux', 11528972.0, 83.3, 96.6, 1.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'Papier-Carton', 6743766.0, 86.6, 96.6, 1.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'Plastiques', 3165373.0, 52.2, 96.6, 1.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'Textiles', 273819.0, NULL, 96.6, 1.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Allemagne', 'DE', 'Verre', 3273121.0, 80.6, 96.6, 1.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Danemark (DK)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Danemark', 'DK', 'BTP', 4173300.0, NULL, 97.5, 2.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'Biodéchets', 1895928.0, NULL, 97.5, 2.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'Bois', 642548.0, 87.3, 97.5, 2.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'DEEE', 167555.0, NULL, 97.5, 2.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'Métaux', 1468446.0, 68.4, 97.5, 2.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'Papier-Carton', 613186.0, 71.8, 97.5, 2.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'Plastiques', 150333.0, 27.8, 97.5, 2.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'Textiles', 20194.0, NULL, 97.5, 2.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Danemark', 'DK', 'Verre', 198812.0, 68.9, 97.5, 2.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Estonie (EE)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Estonie', 'EE', 'BTP', 896447.0, NULL, 78.6, 12.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'Biodéchets', 265539.0, NULL, 78.6, 12.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'Bois', 168230.0, 32.0, 78.6, 12.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'DEEE', 40911.0, NULL, 78.6, 12.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'Métaux', 611821.0, 95.3, 78.6, 12.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'Papier-Carton', 95052.0, 90.6, 78.6, 12.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'Plastiques', 38536.0, 42.4, 78.6, 12.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'Textiles', 3064.0, NULL, 78.6, 12.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Estonie', 'EE', 'Verre', 50874.0, 67.9, 78.6, 12.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Grèce (EL)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Grèce', 'EL', 'BTP', 3988519.0, NULL, 19.0, 80.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'Biodéchets', 1769747.0, NULL, 19.0, 80.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'Bois', 73168.0, 7.5, 19.0, 80.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'DEEE', 147216.0, NULL, 19.0, 80.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'Métaux', 1173021.0, 57.6, 19.0, 80.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'Papier-Carton', 722053.0, 76.7, 19.0, 80.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'Plastiques', 220655.0, 32.7, 19.0, 80.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'Textiles', 9790.0, NULL, 19.0, 80.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Grèce', 'EL', 'Verre', 68982.0, 25.9, 19.0, 80.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Espagne (ES)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Espagne', 'ES', 'BTP', 14560430.0, NULL, 52.7, 47.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'Biodéchets', 9303116.0, NULL, 52.7, 47.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'Bois', 1089091.0, 66.1, 52.7, 47.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'DEEE', 1359328.0, NULL, 52.7, 47.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'Métaux', 5810746.0, 76.5, 52.7, 47.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'Papier-Carton', 4014471.0, 79.2, 52.7, 47.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'Plastiques', 1122142.0, 46.2, 52.7, 47.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'Textiles', 102756.0, NULL, 52.7, 47.3, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Espagne', 'ES', 'Verre', 1406841.0, 69.8, 52.7, 47.3, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Finlande (FI)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Finlande', 'FI', 'BTP', 998607.0, NULL, 98.8, 0.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'Biodéchets', 1197197.0, NULL, 98.8, 0.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'Bois', 2232278.0, 3.6, 98.8, 0.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'DEEE', 209263.0, NULL, 98.8, 0.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'Métaux', 371450.0, 80.2, 98.8, 0.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'Papier-Carton', 484038.0, 96.2, 98.8, 0.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'Plastiques', 131226.0, 29.3, 98.8, 0.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'Textiles', 5832.0, NULL, 98.8, 0.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Finlande', 'FI', 'Verre', 128671.0, 91.7, 98.8, 0.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- France (FR)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('France', 'FR', 'BTP', 71390706.0, NULL, 72.9, 20.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'Biodéchets', 12771984.0, NULL, 72.9, 20.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'Bois', 8529277.0, 15.4, 72.9, 20.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'DEEE', 2913270.0, NULL, 72.9, 20.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'Métaux', 15766593.0, 68.0, 72.9, 20.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'Papier-Carton', 6569800.0, 94.8, 72.9, 20.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'Plastiques', 2482433.0, 25.7, 72.9, 20.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'Textiles', 296445.0, NULL, 72.9, 20.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('France', 'FR', 'Verre', 2612137.0, 83.7, 72.9, 20.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Croatie (HR)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Croatie', 'HR', 'BTP', 591031.0, NULL, 38.2, 50.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'Biodéchets', 860552.0, NULL, 38.2, 50.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'Bois', 167759.0, 29.6, 38.2, 50.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'DEEE', 102424.0, NULL, 38.2, 50.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'Métaux', 1125268.0, 17.9, 38.2, 50.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'Papier-Carton', 474993.0, 77.4, 38.2, 50.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'Plastiques', 182468.0, 28.2, 38.2, 50.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'Textiles', 12906.0, NULL, 38.2, 50.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Croatie', 'HR', 'Verre', 136866.0, 53.2, 38.2, 50.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Hongrie (HU)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Hongrie', 'HU', 'BTP', 4954959.0, NULL, 46.7, 53.2, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'Biodéchets', 1021076.0, NULL, 46.7, 53.2, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'Bois', 143573.0, 20.7, 46.7, 53.2, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'DEEE', 127016.0, NULL, 46.7, 53.2, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'Métaux', 2103465.0, 53.9, 46.7, 53.2, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'Papier-Carton', 788433.0, 70.3, 46.7, 53.2, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'Plastiques', 267625.0, 23.0, 46.7, 53.2, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'Textiles', 22041.0, NULL, 46.7, 53.2, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Hongrie', 'HU', 'Verre', 174828.0, 22.8, 46.7, 53.2, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Irlande (IE)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Irlande', 'IE', 'BTP', 1035842.0, NULL, 84.4, 14.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'Biodéchets', 1132707.0, NULL, 84.4, 14.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'Bois', 297472.0, 50.0, 84.4, 14.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'DEEE', 116583.0, NULL, 84.4, 14.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'Métaux', 447324.0, 54.4, 84.4, 14.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'Papier-Carton', 827313.0, 75.7, 84.4, 14.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'Plastiques', 233858.0, 29.6, 84.4, 14.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'Textiles', 6586.0, NULL, 84.4, 14.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Irlande', 'IE', 'Verre', 135735.0, 83.3, 84.4, 14.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Italie (IT)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Italie', 'IT', 'BTP', 55399697.0, NULL, 69.2, 15.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'Biodéchets', 8663986.0, NULL, 69.2, 15.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'Bois', 6243439.0, 51.8, 69.2, 15.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'DEEE', 2890093.0, NULL, 69.2, 15.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'Métaux', 13079514.0, 86.2, 69.2, 15.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'Papier-Carton', 5953007.0, 92.6, 69.2, 15.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'Plastiques', 5340127.0, 49.0, 69.2, 15.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'Textiles', 456244.0, NULL, 69.2, 15.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Italie', 'IT', 'Verre', 3763002.0, 77.4, 69.2, 15.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Lituanie (LT)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Lituanie', 'LT', 'BTP', 770924.0, NULL, 91.2, 5.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'Biodéchets', 422999.0, NULL, 91.2, 5.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'Bois', 130168.0, 7.6, 91.2, 5.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'DEEE', 90041.0, NULL, 91.2, 5.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'Métaux', 799169.0, 85.5, 91.2, 5.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'Papier-Carton', 219819.0, 83.4, 91.2, 5.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'Plastiques', 126647.0, 42.9, 91.2, 5.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'Textiles', 19358.0, NULL, 91.2, 5.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lituanie', 'LT', 'Verre', 95050.0, 74.8, 91.2, 5.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Luxembourg (LU)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Luxembourg', 'LU', 'BTP', 1434980.0, NULL, 97.4, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'Biodéchets', 127081.0, NULL, 97.4, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'Bois', 86445.0, 12.1, 97.4, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'DEEE', 11027.0, NULL, 97.4, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'Métaux', 196215.0, 71.1, 97.4, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'Papier-Carton', 84364.0, 77.9, 97.4, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'Plastiques', 31899.0, 38.8, 97.4, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'Textiles', 5865.0, NULL, 97.4, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Luxembourg', 'LU', 'Verre', 41103.0, 92.1, 97.4, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Lettonie (LV)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Lettonie', 'LV', 'BTP', 373596.0, NULL, 59.3, 30.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'Biodéchets', 110345.0, NULL, 59.3, 30.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'Bois', 86330.0, 45.1, 59.3, 30.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'DEEE', 37189.0, NULL, 59.3, 30.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'Métaux', 171512.0, 71.6, 59.3, 30.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'Papier-Carton', 120537.0, 74.9, 59.3, 30.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'Plastiques', 89299.0, 59.2, 59.3, 30.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'Textiles', 1574.0, NULL, 59.3, 30.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Lettonie', 'LV', 'Verre', 55723.0, 69.3, 59.3, 30.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Malte (MT)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Malte', 'MT', 'BTP', 2003771.0, NULL, 19.0, 72.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'Biodéchets', 35283.0, NULL, 19.0, 72.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'Bois', 9325.0, 0.0, 19.0, 72.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'DEEE', 22482.0, NULL, 19.0, 72.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'Métaux', 97870.0, 15.2, 19.0, 72.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'Papier-Carton', 36413.0, 53.6, 19.0, 72.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'Plastiques', 4799.0, 35.6, 19.0, 72.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'Textiles', 1172.0, NULL, 19.0, 72.0, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Malte', 'MT', 'Verre', 8445.0, 65.2, 19.0, 72.0, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Pays-Bas (NL)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Pays-Bas', 'NL', 'BTP', 20452306.0, NULL, 97.6, 1.5, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'Biodéchets', 15866988.0, NULL, 97.6, 1.5, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'Bois', 2716081.0, 24.7, 97.6, 1.5, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'DEEE', 636650.0, NULL, 97.6, 1.5, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'Métaux', 2885311.0, 88.0, 97.6, 1.5, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'Papier-Carton', 2016980.0, 89.4, 97.6, 1.5, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'Plastiques', 649222.0, 49.1, 97.6, 1.5, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'Textiles', 148765.0, NULL, 97.6, 1.5, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pays-Bas', 'NL', 'Verre', 672492.0, 80.6, 97.6, 1.5, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Norvège (NO)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Norvège', 'NO', 'BTP', 2636249.0, NULL, 93.7, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'Biodéchets', 758801.0, NULL, 93.7, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'Bois', 860311.0, 22.5, 93.7, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'DEEE', 403090.0, NULL, 93.7, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'Métaux', 660295.0, 91.9, 93.7, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'Papier-Carton', 637517.0, 85.1, 93.7, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'Plastiques', 275654.0, 30.2, 93.7, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'Textiles', 3041.0, NULL, 93.7, 2.8, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Norvège', 'NO', 'Verre', 154870.0, 80.4, 93.7, 2.8, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Pologne (PL)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Pologne', 'PL', 'BTP', 7195153.0, NULL, 53.0, 30.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'Biodéchets', 3437765.0, NULL, 53.0, 30.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'Bois', 1314799.0, 30.7, 53.0, 30.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'DEEE', 515300.0, NULL, 53.0, 30.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'Métaux', 8507870.0, 83.2, 53.0, 30.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'Papier-Carton', 3459939.0, 98.9, 53.0, 30.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'Plastiques', 2394068.0, 46.3, 53.0, 30.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'Textiles', 141252.0, NULL, 53.0, 30.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Pologne', 'PL', 'Verre', 1695132.0, 67.5, 53.0, 30.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Portugal (PT)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Portugal', 'PT', 'BTP', 2355594.0, NULL, 55.2, 51.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'Biodéchets', 465981.0, NULL, 55.2, 51.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'Bois', 585491.0, 94.1, 55.2, 51.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'DEEE', 260886.0, NULL, 55.2, 51.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'Métaux', 2674526.0, 50.2, 55.2, 51.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'Papier-Carton', 1200672.0, 62.8, 55.2, 51.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'Plastiques', 364365.0, 39.5, 55.2, 51.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'Textiles', 80842.0, NULL, 55.2, 51.9, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Portugal', 'PT', 'Verre', 447742.0, 55.9, 55.2, 51.9, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Roumanie (RO)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Roumanie', 'RO', 'BTP', 1225269.0, NULL, 17.6, 75.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'Biodéchets', 1258258.0, NULL, 17.6, 75.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'Bois', 2599008.0, 16.1, 17.6, 75.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'DEEE', 300889.0, NULL, 17.6, 75.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'Métaux', 1992592.0, 42.2, 17.6, 75.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'Papier-Carton', 641724.0, 64.1, 17.6, 75.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'Plastiques', 319205.0, 32.4, 17.6, 75.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'Textiles', 34089.0, NULL, 17.6, 75.7, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Roumanie', 'RO', 'Verre', 303936.0, 30.0, 17.6, 75.7, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Suède (SE)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Suède', 'SE', 'BTP', 3458607.0, NULL, 98.8, 0.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'Biodéchets', 3040042.0, NULL, 98.8, 0.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'Bois', 1850463.0, 0.0, 98.8, 0.6, 2020, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'DEEE', 835973.0, NULL, 98.8, 0.6, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'Métaux', 3063044.0, 86.4, 98.8, 0.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'Papier-Carton', 1596930.0, 80.9, 98.8, 0.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'Plastiques', 473264.0, 28.6, 98.8, 0.6, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'Textiles', 12307.0, NULL, 98.8, 0.6, 2020, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Suède', 'SE', 'Verre', 280665.0, 84.7, 98.8, 0.6, 2020, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Slovénie (SI)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Slovénie', 'SI', 'BTP', 1188224.0, NULL, 75.5, 10.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'Biodéchets', 238389.0, NULL, 75.5, 10.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'Bois', 128762.0, 40.0, 75.5, 10.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'DEEE', 34349.0, NULL, 75.5, 10.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'Métaux', 553299.0, 100.0, 75.5, 10.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'Papier-Carton', 200153.0, 82.2, 75.5, 10.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'Plastiques', 63075.0, 51.5, 75.5, 10.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'Textiles', 12301.0, NULL, 75.5, 10.4, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovénie', 'SI', 'Verre', 77493.0, 100.0, 75.5, 10.4, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- Slovaquie (SK)
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, recovery_rate, landfill_rate, year, data_source, data_source_url) VALUES
  ('Slovaquie', 'SK', 'BTP', 1405811.0, NULL, 57.9, 38.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'Biodéchets', 953487.0, NULL, 57.9, 38.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'Bois', 534454.0, 61.7, 57.9, 38.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'DEEE', 101272.0, NULL, 57.9, 38.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'Métaux', 2161651.0, 83.3, 57.9, 38.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'Papier-Carton', 361747.0, 81.6, 57.9, 38.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'Plastiques', 231232.0, 54.1, 57.9, 38.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'Textiles', 21101.0, NULL, 57.9, 38.1, 2022, 'Eurostat/env_wasgen', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table'),
  ('Slovaquie', 'SK', 'Verre', 109285.0, 77.3, 57.9, 38.1, 2022, 'Eurostat/env_wasgen+env_waspac', 'https://ec.europa.eu/eurostat/databrowser/view/env_wasgen/default/table');

-- VÉRIFICATION
SELECT country_code, COUNT(*) AS categories, SUM(annual_volume_tonnes) AS total_tonnes
FROM material_stats_national
WHERE country_code != 'US' AND country_code != 'FR'
GROUP BY country_code ORDER BY total_tonnes DESC;