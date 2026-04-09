/*
 * Material Explorer — Public open-data aggregates
 * Tables: material_sources, material_stats_by_region, material_stats_national
 *
 * These tables store aggregated data from GEREP, ADEME SINOE, INSEE and
 * Eurostat.  They are readable by anonymous visitors (public explorer)
 * and writable only via service_role (data-pipeline / cron).
 */

-- ============================================================
-- 1. material_sources — granular open-data records
-- ============================================================
create table if not exists public.material_sources (
  id uuid default gen_random_uuid() primary key,

  -- location
  region text not null,
  departement text not null,
  commune text,
  latitude numeric(10,7),
  longitude numeric(10,7),

  -- material
  category text not null,
  flux_9 text not null,
  material_name text not null,
  waste_code text,

  -- volumes
  estimated_volume_tonnes numeric(12,2) not null,
  nb_sources integer default 1,
  avg_volume_per_source numeric(12,2),

  -- indicative pricing
  price_range_min numeric(10,2),
  price_range_max numeric(10,2),
  price_currency text default 'EUR',

  -- environmental impact
  co2_avoided_per_tonne numeric(10,2),
  co2_total_potential numeric(12,2),

  -- metadata
  data_source text default 'GEREP',
  data_year integer,
  last_updated timestamptz default now(),
  quality_score integer default 3 check (quality_score between 1 and 5),

  -- matching helpers
  sector_naf text[],
  available_for_marketplace boolean default true,

  created_at timestamptz default now()
);

alter table public.material_sources enable row level security;

grant select on table public.material_sources to authenticated, anon;

create policy "material_sources_public_read"
  on public.material_sources for select using (true);

create index idx_material_sources_region   on public.material_sources (region);
create index idx_material_sources_dept     on public.material_sources (departement);
create index idx_material_sources_category on public.material_sources (category);
create index idx_material_sources_flux     on public.material_sources (flux_9);
create index idx_material_sources_volume   on public.material_sources (estimated_volume_tonnes desc);

-- ============================================================
-- 2. material_stats_by_region — aggregated per region+category
-- ============================================================
create table if not exists public.material_stats_by_region (
  id uuid default gen_random_uuid() primary key,
  region text not null,
  category text not null,
  total_volume_tonnes numeric(12,2),
  nb_sources integer,
  avg_price_per_tonne numeric(10,2),
  co2_potential_tonnes numeric(12,2),
  year integer,
  last_updated timestamptz default now(),
  unique (region, category, year)
);

alter table public.material_stats_by_region enable row level security;

grant select on table public.material_stats_by_region to authenticated, anon;

create policy "material_stats_by_region_public_read"
  on public.material_stats_by_region for select using (true);

create index idx_material_stats_region
  on public.material_stats_by_region (region, category);

-- ============================================================
-- 3. material_stats_national — one row per category
-- ============================================================
create table if not exists public.material_stats_national (
  id uuid default gen_random_uuid() primary key,
  category text not null unique,
  total_volume_tonnes numeric(12,2),
  nb_regions integer,
  nb_sources integer,
  avg_price_min numeric(10,2),
  avg_price_max numeric(10,2),
  co2_potential_tonnes numeric(12,2),
  recycling_rate numeric(5,2),
  trend_12m numeric(5,2),
  last_updated timestamptz default now()
);

alter table public.material_stats_national enable row level security;

grant select on table public.material_stats_national to authenticated, anon;

create policy "material_stats_national_public_read"
  on public.material_stats_national for select using (true);

-- ============================================================
-- SEED: national statistics (ADEME 2024 estimates)
-- ============================================================
insert into public.material_stats_national
  (category, total_volume_tonnes, nb_regions, nb_sources, avg_price_min, avg_price_max, co2_potential_tonnes, recycling_rate, trend_12m)
values
  ('plastique', 3200000,   13, 4500,  150,  800,  5760000,   29.0,   3.2),
  ('metal',     5800000,   13, 6200,  200,  1500, 7888000,   78.0,   1.5),
  ('papier',    7100000,   13, 8900,  30,   120,  5325000,   72.0,  -0.8),
  ('verre',     3400000,   13, 3200,  20,   60,   1700000,   87.0,   0.5),
  ('bois',      4200000,   13, 5100,  30,   150,  1386000,   35.0,   4.1),
  ('textile',   800000,    13, 1200,  100,  500,  3440000,   38.0,   8.5),
  ('organique', 18000000,  13, 15000, 10,   80,   4500000,   45.0,  12.0),
  ('mineral',   210000000, 13, 9500,  5,    40,   10500000,  70.0,   2.3);

-- ============================================================
-- SEED: regional statistics (proportional split of national)
-- 13 metropolitan regions × 8 categories = 104 rows
-- Weights approximate real production distribution.
-- ============================================================
do $$
declare
  regions text[] := array[
    'Île-de-France',
    'Auvergne-Rhône-Alpes',
    'Hauts-de-France',
    'Grand Est',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Provence-Alpes-Côte d''Azur',
    'Pays de la Loire',
    'Normandie',
    'Bretagne',
    'Bourgogne-Franche-Comté',
    'Centre-Val de Loire',
    'Corse'
  ];
  weights numeric[] := array[
    0.16, 0.13, 0.11, 0.09, 0.09, 0.08, 0.08,
    0.07, 0.05, 0.05, 0.04, 0.04, 0.01
  ];
  r text;
  w numeric;
  cat record;
  i integer;
begin
  for i in 1..array_length(regions, 1) loop
    r := regions[i];
    w := weights[i];

    for cat in select * from public.material_stats_national loop
      insert into public.material_stats_by_region
        (region, category, total_volume_tonnes, nb_sources, avg_price_per_tonne, co2_potential_tonnes, year)
      values (
        r,
        cat.category,
        round((cat.total_volume_tonnes * w)::numeric, 2),
        round((cat.nb_sources * w)::numeric)::integer,
        round(((cat.avg_price_min + cat.avg_price_max) / 2)::numeric, 2),
        round((cat.co2_potential_tonnes * w)::numeric, 2),
        2024
      );
    end loop;
  end loop;
end;
$$;
