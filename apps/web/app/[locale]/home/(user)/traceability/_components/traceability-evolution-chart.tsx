'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface MonthlyDataPoint {
  month: string;
  lotsTracked: number;
  co2AvoidedKg: number;
  tonnesRecycled: number;
}

interface TraceabilityEvolutionChartProps {
  data: MonthlyDataPoint[];
}

export function TraceabilityEvolutionChart({
  data,
}: TraceabilityEvolutionChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    co2AvoidedTonnes: Math.round((d.co2AvoidedKg / 1000) * 10) / 10,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          <Trans i18nKey="blockchain:evolution" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              yAxisId="lots"
              orientation="left"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              yAxisId="co2"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              unit="t"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={
                ((value: any, name: any) => {
                  if (name === 'co2AvoidedTonnes')
                    return [`${value}t`, 'CO\u2082 \u00e9vit\u00e9'];
                  return [value, 'Lots'];
                }) as any
              }
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              formatter={(value: string) => {
                if (value === 'lotsTracked') return 'Lots par mois';
                if (value === 'co2AvoidedTonnes')
                  return 'CO\u2082 \u00e9vit\u00e9 (t)';
                return value;
              }}
            />
            <Bar
              yAxisId="lots"
              dataKey="lotsTracked"
              fill="#14B8A6"
              radius={[4, 4, 0, 0]}
              barSize={28}
              opacity={0.85}
            />
            <Line
              yAxisId="co2"
              type="monotone"
              dataKey="co2AvoidedTonnes"
              stroke="#22C55E"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#22C55E' }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
