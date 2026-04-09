-- ============================================================
-- DONNÉES USA — Source : EPA (Facts and Figures 2018)
-- Téléchargées le 2026-04-04
-- Conversion : 1 short ton = 0.907185 tonnes métriques
-- ============================================================

-- Stats nationales USA
INSERT INTO material_stats_national (country, country_code, category, annual_volume_tonnes, recycling_rate, year, price_currency, data_source, data_source_url) VALUES
  ('États-Unis', 'US', 'Papier-Carton', 61135197.15, 68.2, 2018, 'USD', 'EPA Facts and Figures 2018', 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling'),
  ('États-Unis', 'US', 'Plastiques', 32368360.8, 8.7, 2018, 'USD', 'EPA Facts and Figures 2018', 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling'),
  ('États-Unis', 'US', 'Métaux', 23223936.0, 34.1, 2018, 'USD', 'EPA Facts and Figures 2018', 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling'),
  ('États-Unis', 'US', 'Verre', 11113016.25, 25.0, 2018, 'USD', 'EPA Facts and Figures 2018', 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling'),
  ('États-Unis', 'US', 'Bois', 16410976.65, 17.1, 2018, 'USD', 'EPA Facts and Figures 2018', 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling'),
  ('États-Unis', 'US', 'Textiles', 15449360.55, 14.7, 2018, 'USD', 'EPA Facts and Figures 2018', 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling'),
  ('États-Unis', 'US', 'Biodéchets', 89384938.05, 25.3, 2018, 'USD', 'EPA Facts and Figures 2018', 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling');

-- VÉRIFICATION
SELECT 'material_stats_national' AS table_name, COUNT(*) AS rows FROM material_stats_national WHERE country_code = 'US';