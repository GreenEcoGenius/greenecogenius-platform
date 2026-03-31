'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

interface MonthlyData {
  month: string;
  co2_avoided: number;
  co2_transport: number;
  co2_net: number;
}

interface CarbonAvoidedChartProps {
  data: MonthlyData[];
}

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan',
  '02': 'Fév',
  '03': 'Mar',
  '04': 'Avr',
  '05': 'Mai',
  '06': 'Juin',
  '07': 'Juil',
  '08': 'Août',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Déc',
};

function formatMonthLabel(ym: string): string {
  const parts = ym.split('-');
  if (parts.length < 2) return ym;
  const monthNum = parts[1] ?? '';
  return MONTH_LABELS[monthNum] ?? ym;
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
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  const avoided = payload.find((p) => p.dataKey === 'co2_avoided');
  const transport = payload.find((p) => p.dataKey === 'co2_transport');

  const avoidedVal = avoided?.value ?? 0;
  const transportVal = transport?.value ?? 0;
  const net = avoidedVal - transportVal;

  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg dark:bg-gray-900">
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="space-y-1 text-sm">
        <p className="text-teal-600">CO₂ évité: {fmtKg(avoidedVal)} kg</p>
        <p className="text-orange-500">
          CO₂ transport: {fmtKg(transportVal)} kg
        </p>
        <p className="font-semibold text-emerald-700">
          Bilan net: {fmtKg(net)} kg
        </p>
      </div>
    </div>
  );
}

export function CarbonAvoidedChart({ data }: CarbonAvoidedChartProps) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    ...d,
    label: formatMonthLabel(d.month),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <Trans i18nKey="carbon:chartTitle" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${fmtKg(v)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) => {
                if (value === 'co2_avoided') return 'CO₂ évité';
                if (value === 'co2_transport') return 'CO₂ transport';
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="co2_avoided"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#tealGradient)"
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="co2_transport"
              stroke="#059669"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
