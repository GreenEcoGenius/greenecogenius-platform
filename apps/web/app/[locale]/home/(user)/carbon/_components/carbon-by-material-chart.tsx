'use client';

import { useTranslations } from 'next-intl';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface MaterialData {
  category: string;
  co2_avoided: number;
  weight: number;
}

interface CarbonByMaterialChartProps {
  data: MaterialData[];
}

const MATERIAL_COLORS: Record<string, string> = {
  plastique: '#1BAF6A',
  metal: '#7EC845',
  bois: '#6366f1',
  papier: '#f59e0b',
  verre: '#2eafcf',
  textile: '#5bc4d6',
  deee: '#64748B',
  organique: '#10874E',
};

const FALLBACK_COLORS = [
  '#1BAF6A',
  '#7EC845',
  '#6366f1',
  '#f59e0b',
  '#2eafcf',
  '#5bc4d6',
  '#64748B',
  '#10874E',
];

function getColor(category: string, index: number): string {
  const key = category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return (
    MATERIAL_COLORS[key] ??
    FALLBACK_COLORS[index % FALLBACK_COLORS.length] ??
    '#6B7280'
  );
}

function fmtKg(value: number): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { category: string; co2_avoided: number; weight: number };
  }>;
}) {
  const t = useTranslations('carbon');
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
      <p className="mb-1 font-medium capitalize">{item.category}</p>
      <p className="text-gray-300">
        {t('chartCO2Avoided')}: <span className="font-semibold text-white">{fmtKg(item.co2_avoided)} kg</span>
      </p>
      <p className="text-gray-300">
        {t('chartWeight')}:{' '}
        <span className="font-semibold text-white">
          {(item.weight / 1000).toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          t
        </span>
      </p>
    </div>
  );
}

function CenterLabel({
  viewBox,
  total,
}: {
  viewBox?: { cx: number; cy: number };
  total: number;
}) {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;

  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        className="fill-current text-2xl font-bold"
      >
        {fmtKg(total)}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        className="fill-gray-500 text-xs"
      >
        kg CO₂
      </text>
    </g>
  );
}

export function CarbonByMaterialChart({ data }: CarbonByMaterialChartProps) {
  if (!data.length) return null;

  const total = data.reduce((sum, d) => sum + d.co2_avoided, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <Trans i18nKey="carbon:byMaterial" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="co2_avoided"
              nameKey="category"
              paddingAngle={2}
              label={false}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={getColor(entry.category, index)}
                />
              ))}
              <CenterLabel total={total} />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-sm capitalize">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
