/**
 * import-to-supabase.ts — Upsert processed data into Supabase
 *
 * Run:  SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npx tsx scripts/data-pipeline/import-to-supabase.ts
 *
 * Reads data/processed/aggregated-materials.json and upserts into
 * the material_sources table via the admin/service_role client.
 */

import { createClient } from '@supabase/supabase-js';

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');
const DATA_PATH = path.join(ROOT, 'data/processed/aggregated-materials.json');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.log('No processed data found. Run clean-and-transform.ts first.');
    process.exit(0);
  }

  const rows = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as Array<{
    region: string;
    departement: string;
    category: string;
    flux_9: string;
    material_name: string;
    estimated_volume_tonnes: number;
    nb_sources: number;
    price_range_min: number;
    price_range_max: number;
    co2_avoided_per_tonne: number;
    data_source: string;
    data_year: number;
  }>;

  console.log(`Importing ${rows.length} rows into material_sources …`);

  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

  const BATCH_SIZE = 500;
  let imported = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map((r) => ({
      ...r,
      co2_total_potential: r.estimated_volume_tonnes * r.co2_avoided_per_tonne,
      avg_volume_per_source:
        r.nb_sources > 0 ? r.estimated_volume_tonnes / r.nb_sources : 0,
      last_updated: new Date().toISOString(),
    }));

    const { error } = await supabase.from('material_sources').insert(batch);

    if (error) {
      console.error(`Batch ${i} failed:`, error.message);
    } else {
      imported += batch.length;
    }
  }

  console.log(`✓ Imported ${imported} rows into material_sources`);

  // Recalculate aggregated stats
  await recalculateStats(supabase);
}

async function recalculateStats(supabase: ReturnType<typeof createClient>) {
  console.log('Recalculating regional and national stats …');

  // Fetch all sources grouped manually (Supabase JS doesn't support GROUP BY)
  const { data: sources } = await supabase
    .from('material_sources')
    .select(
      'region, category, estimated_volume_tonnes, nb_sources, co2_total_potential',
    );

  if (!sources || sources.length === 0) {
    console.log('No sources to aggregate.');
    return;
  }

  // Aggregate by region + category
  const regionMap = new Map<
    string,
    { volume: number; sources: number; co2: number }
  >();

  for (const s of sources) {
    const key = `${s.region}|${s.category}`;
    const existing = regionMap.get(key) ?? { volume: 0, sources: 0, co2: 0 };
    existing.volume += Number(s.estimated_volume_tonnes);
    existing.sources += s.nb_sources ?? 0;
    existing.co2 += Number(s.co2_total_potential ?? 0);
    regionMap.set(key, existing);
  }

  for (const [key, agg] of regionMap) {
    const [region, category] = key.split('|') as [string, string];
    await supabase.from('material_stats_by_region').upsert(
      {
        region,
        category,
        total_volume_tonnes: agg.volume,
        nb_sources: agg.sources,
        co2_potential_tonnes: agg.co2,
        year: new Date().getFullYear() - 1,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'region,category,year' },
    );
  }

  // Aggregate national
  const nationalMap = new Map<
    string,
    { volume: number; sources: number; co2: number; regions: Set<string> }
  >();

  for (const s of sources) {
    const existing = nationalMap.get(s.category) ?? {
      volume: 0,
      sources: 0,
      co2: 0,
      regions: new Set(),
    };
    existing.volume += Number(s.estimated_volume_tonnes);
    existing.sources += s.nb_sources ?? 0;
    existing.co2 += Number(s.co2_total_potential ?? 0);
    existing.regions.add(s.region);
    nationalMap.set(s.category, existing);
  }

  for (const [category, agg] of nationalMap) {
    await supabase.from('material_stats_national').upsert(
      {
        category,
        total_volume_tonnes: agg.volume,
        nb_regions: agg.regions.size,
        nb_sources: agg.sources,
        co2_potential_tonnes: agg.co2,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'category' },
    );
  }

  console.log('✓ Stats recalculated');
}

main().catch(console.error);
