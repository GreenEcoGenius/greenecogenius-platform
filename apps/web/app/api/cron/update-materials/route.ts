import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createClient } from '@supabase/supabase-js';

/**
 * Monthly cron job to refresh material explorer data.
 *
 * vercel.json: { "crons": [{ "path": "/api/cron/update-materials", "schedule": "0 2 1 * *" }] }
 *
 * In a future iteration this will:
 * 1. Download latest GEREP / ADEME datasets
 * 2. Clean and transform via the pipeline
 * 3. Upsert into Supabase
 * 4. Recalculate aggregated statistics
 *
 * For now it recalculates the stats tables from material_sources.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Missing Supabase config' },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { data: sources } = await supabase
      .from('material_sources')
      .select(
        'region, category, estimated_volume_tonnes, nb_sources, co2_total_potential',
      );

    if (!sources || sources.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No sources to aggregate — using seed data.',
        updated: new Date().toISOString(),
      });
    }

    const regionMap = new Map<
      string,
      { volume: number; sources: number; co2: number }
    >();

    for (const s of sources) {
      const key = `${s.region}|${s.category}`;
      const existing = regionMap.get(key) ?? {
        volume: 0,
        sources: 0,
        co2: 0,
      };
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
          year: new Date().getFullYear(),
          last_updated: new Date().toISOString(),
        },
        { onConflict: 'region,category,year' },
      );
    }

    const nationalMap = new Map<
      string,
      {
        volume: number;
        sources: number;
        co2: number;
        regions: Set<string>;
      }
    >();

    for (const s of sources) {
      const existing = nationalMap.get(s.category) ?? {
        volume: 0,
        sources: 0,
        co2: 0,
        regions: new Set<string>(),
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

    return NextResponse.json({
      success: true,
      regionsUpdated: regionMap.size,
      categoriesUpdated: nationalMap.size,
      updated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/update-materials]', error);

    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 },
    );
  }
}
