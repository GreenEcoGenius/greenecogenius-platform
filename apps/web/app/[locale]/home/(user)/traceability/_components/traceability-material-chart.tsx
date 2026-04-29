'use client';

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

const MATERIAL_COLORS: Record<string, string> = {
  plastique: '#00A86B',
  metal: '#8BC53F',
  aluminium: '#6B7380',
  bois: '#6366f1',
  verre: '#9BA3AD',
  textile: '#f59e0b',
  organique: '#007649',
  papier: '#DDE2E7',
};

const MATERIAL_LABELS: Record<string, string> = {
  plastique: 'Plastique',
  metal: 'M\u00e9tal',
  aluminium: 'Aluminium',
  bois: 'Bois',
  verre: 'Verre',
  textile: 'Textile',
  organique: 'Organique',
  papier: 'Papier',
};

interface MaterialDataPoint {
  material: string;
  totalWeightKg: number;
  totalCo2AvoidedKg: number;
}

interface TraceabilityMaterialChartProps {
  data: MaterialDataPoint[];
}

export function TraceabilityMaterialChart({
  data,
}: TraceabilityMaterialChartProps) {
  const chartData = data.map((d) => ({
    name: MATERIAL_LABELS[d.material] ?? d.material,
    value: Math.round((d.totalWeightKg / 1000) * 10) / 10,
    co2: Math.round((d.totalCo2AvoidedKg / 1000) * 10) / 10,
    material: d.material,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          <Trans i18nKey="blockchain:materialBreakdown" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              stroke="none"
              animationDuration={800}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.material}
                  fill={MATERIAL_COLORS[entry.material] ?? '#6B7280'}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: 'transparent',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff',
              }}
              formatter={(value: any) => {
                return [`${value ?? 0}t`, ''];
              }}
            />
            <Legend
              layout="vertical"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              formatter={(value: string) => (
                <span className="text-[#B8D4E3]">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
