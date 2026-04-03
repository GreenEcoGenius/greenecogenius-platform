/**
 * clean-and-transform.ts — Pipeline for cleaning GEREP/ADEME open data
 *
 * Run:  npx tsx scripts/data-pipeline/clean-and-transform.ts
 *
 * Reads raw CSVs from data/raw/, cleans and maps waste codes to our
 * 8 material categories, aggregates by region+material, and writes
 * the result to data/processed/aggregated-materials.json.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');
const RAW_DIR = path.join(ROOT, 'data/raw');
const OUT_DIR = path.join(ROOT, 'data/processed');

// ── Waste code → category mapping ───────────────────────────────────

const WASTE_CODE_MAPPING: Record<
  string,
  { category: string; flux_9: string; material: string }
> = {
  '15 01 02': {
    category: 'plastique',
    flux_9: 'plastiques',
    material: 'Emballages plastiques',
  },
  '17 02 03': {
    category: 'plastique',
    flux_9: 'plastiques',
    material: 'Plastiques construction',
  },
  '19 12 04': {
    category: 'plastique',
    flux_9: 'plastiques',
    material: 'Plastiques triés',
  },
  '20 01 39': {
    category: 'plastique',
    flux_9: 'plastiques',
    material: 'Plastiques ménagers',
  },
  '15 01 04': {
    category: 'metal',
    flux_9: 'metaux',
    material: 'Emballages métalliques',
  },
  '17 04 01': { category: 'metal', flux_9: 'metaux', material: 'Cuivre' },
  '17 04 02': { category: 'metal', flux_9: 'metaux', material: 'Aluminium' },
  '17 04 05': { category: 'metal', flux_9: 'metaux', material: 'Fer et acier' },
  '19 12 02': {
    category: 'metal',
    flux_9: 'metaux',
    material: 'Métaux ferreux triés',
  },
  '19 12 03': {
    category: 'metal',
    flux_9: 'metaux',
    material: 'Métaux non ferreux triés',
  },
  '15 01 01': {
    category: 'papier',
    flux_9: 'papier_carton',
    material: 'Emballages papier/carton',
  },
  '19 12 01': {
    category: 'papier',
    flux_9: 'papier_carton',
    material: 'Papier/carton trié',
  },
  '20 01 01': {
    category: 'papier',
    flux_9: 'papier_carton',
    material: 'Papier/carton ménager',
  },
  '15 01 07': {
    category: 'verre',
    flux_9: 'verre',
    material: 'Emballages verre',
  },
  '19 12 05': { category: 'verre', flux_9: 'verre', material: 'Verre trié' },
  '20 01 02': { category: 'verre', flux_9: 'verre', material: 'Verre ménager' },
  '15 01 03': { category: 'bois', flux_9: 'bois', material: 'Emballages bois' },
  '17 02 01': {
    category: 'bois',
    flux_9: 'bois',
    material: 'Bois construction',
  },
  '19 12 07': { category: 'bois', flux_9: 'bois', material: 'Bois trié' },
  '04 02 22': {
    category: 'textile',
    flux_9: 'textiles',
    material: 'Fibres textiles',
  },
  '19 12 08': {
    category: 'textile',
    flux_9: 'textiles',
    material: 'Textiles triés',
  },
  '20 01 10': {
    category: 'textile',
    flux_9: 'textiles',
    material: 'Vêtements',
  },
  '02 01 03': {
    category: 'organique',
    flux_9: 'biodechets',
    material: 'Déchets végétaux agriculture',
  },
  '02 02 03': {
    category: 'organique',
    flux_9: 'biodechets',
    material: 'Déchets agroalimentaire',
  },
  '20 01 08': {
    category: 'organique',
    flux_9: 'biodechets',
    material: 'Biodéchets ménagers',
  },
  '20 02 01': {
    category: 'organique',
    flux_9: 'biodechets',
    material: 'Déchets verts',
  },
  '17 01 01': {
    category: 'mineral',
    flux_9: 'fractions_minerales',
    material: 'Béton',
  },
  '17 01 02': {
    category: 'mineral',
    flux_9: 'fractions_minerales',
    material: 'Briques',
  },
  '17 08 02': { category: 'mineral', flux_9: 'platre', material: 'Plâtre' },
};

// ── Department → Region mapping ─────────────────────────────────────

const DEPT_TO_REGION: Record<string, string> = {
  '75': 'Île-de-France',
  '77': 'Île-de-France',
  '78': 'Île-de-France',
  '91': 'Île-de-France',
  '92': 'Île-de-France',
  '93': 'Île-de-France',
  '94': 'Île-de-France',
  '95': 'Île-de-France',
  '01': 'Auvergne-Rhône-Alpes',
  '03': 'Auvergne-Rhône-Alpes',
  '07': 'Auvergne-Rhône-Alpes',
  '15': 'Auvergne-Rhône-Alpes',
  '26': 'Auvergne-Rhône-Alpes',
  '38': 'Auvergne-Rhône-Alpes',
  '42': 'Auvergne-Rhône-Alpes',
  '43': 'Auvergne-Rhône-Alpes',
  '63': 'Auvergne-Rhône-Alpes',
  '69': 'Auvergne-Rhône-Alpes',
  '73': 'Auvergne-Rhône-Alpes',
  '74': 'Auvergne-Rhône-Alpes',
  '02': 'Hauts-de-France',
  '59': 'Hauts-de-France',
  '60': 'Hauts-de-France',
  '62': 'Hauts-de-France',
  '80': 'Hauts-de-France',
  '2A': 'Corse',
  '2B': 'Corse',
};

// ── Price ranges per category (€/tonne) ─────────────────────────────

const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  plastique: { min: 150, max: 800 },
  metal: { min: 200, max: 1500 },
  papier: { min: 30, max: 120 },
  verre: { min: 20, max: 60 },
  bois: { min: 30, max: 150 },
  textile: { min: 100, max: 500 },
  organique: { min: 10, max: 80 },
  mineral: { min: 5, max: 40 },
};

// ── CO₂ factors per category (kgCO₂e avoided per tonne recycled) ───

const CO2_FACTORS: Record<string, number> = {
  plastique: 1800,
  metal: 1360,
  papier: 750,
  verre: 500,
  bois: 330,
  textile: 4300,
  organique: 250,
  mineral: 50,
};

// ── Main ────────────────────────────────────────────────────────────

interface AggregatedRow {
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
}

async function main() {
  const gerepPath = path.join(RAW_DIR, 'gerep/emissions-dechets.csv');

  if (!fs.existsSync(gerepPath)) {
    console.log('⚠  No raw GEREP CSV found — skipping transformation.');
    console.log('   Run download-sources.sh first, or use the SQL seed data.');
    process.exit(0);
  }

  // Dynamic import for csv-parse (might not be installed yet)
  let parse: typeof import('csv-parse/sync').parse;
  try {
    parse = (await import('csv-parse/sync')).parse;
  } catch {
    console.error('csv-parse not installed. Run: pnpm add -D csv-parse');
    process.exit(1);
  }

  const raw = fs.readFileSync(gerepPath, 'utf-8');
  const records = parse(raw, { columns: true, skip_empty_lines: true });

  console.log(`Loaded ${records.length} raw GEREP records`);

  const aggregation = new Map<string, AggregatedRow>();

  for (const r of records) {
    const codeDechet = (r.code_dechet ?? '').replace(/[^0-9\s]/g, '').trim();
    const mapping = WASTE_CODE_MAPPING[codeDechet];
    if (!mapping) continue;

    const dept = (r.departement ?? r.code_postal?.substring(0, 2) ?? '').trim();
    const region = DEPT_TO_REGION[dept] ?? 'Autre';
    const qty = parseFloat(r.quantite_tonnes) || 0;
    if (qty <= 0) continue;

    const key = `${region}|${dept}|${mapping.category}`;
    const existing = aggregation.get(key);

    if (existing) {
      existing.estimated_volume_tonnes += qty;
      existing.nb_sources += 1;
    } else {
      const prices = PRICE_RANGES[mapping.category] ?? { min: 0, max: 0 };
      aggregation.set(key, {
        region,
        departement: dept,
        category: mapping.category,
        flux_9: mapping.flux_9,
        material_name: mapping.material,
        estimated_volume_tonnes: qty,
        nb_sources: 1,
        price_range_min: prices.min,
        price_range_max: prices.max,
        co2_avoided_per_tonne: CO2_FACTORS[mapping.category] ?? 0,
        data_source: 'GEREP',
        data_year: new Date().getFullYear() - 1,
      });
    }
  }

  const results = Array.from(aggregation.values());
  console.log(`Aggregated into ${results.length} rows`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, 'aggregated-materials.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Written to ${outPath}`);
}

main().catch(console.error);
