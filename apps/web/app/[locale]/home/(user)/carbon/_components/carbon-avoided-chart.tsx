'use client';

import { useTranslations } from 'next-intl';
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

const MONTH_KEYS: Record<string, string> = {
  '01': 'jan',
  '02': 'feb',
  '03': 'mar',
  '04': 'apr',
  '05': 'may',
  '06': 'jun',
  '07': 'jul',
  '08': 'aug',
  '09': 'sep',
  '10': 'oct',
  '11': 'nov',
  '12': 'dec',
};

function useFormatMonthLabel() {
  const t = useTranslations('common');
  return (ym: string): string => {
    const parts = ym.split('-');
    if (parts.length < 2) return ym;
    const monthNum = parts[1] ?? '';
    const key = MONTH_KEYS[monthNum];
    return key ? t(`months.${key}`) : ym;
  };
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
  const t = useTranslations('carbon');
  if (!active || !payload || !payload.length) return null;

  const avoided = payload.find((p) => p.dataKey === 'co2_avoided');
  const transport = payload.find((p) => p.dataKey === 'co2_transport');

  const avoidedVal = avoided?.value ?? 0;
  const transportVal = transport?.value ?? 0;
  const net = avoidedVal - transportVal;

  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
      <p className="mb-1.5 font-medium">{label}</p>
      <div className="space-y-0.5">
        <p className="text-gray-300">
          {t('chartCO2Avoided')}: <span className="font-semibold text-white">{fmtKg(avoidedVal)} kg</span>
        </p>
        <p className="text-gray-300">
          {t('chartCO2Transport')}: <span className="font-semibold text-white">{fmtKg(transportVal)} kg</span>
        </p>
        <p className="text-gray-300">
          {t('chartNetBalance')}: <span className="font-semibold text-white">{fmtKg(net)} kg</span>
        </p>
      </div>
    </div>
  );
}

export function CarbonAvoidedChart({ data }: CarbonAvoidedChartProps) {
  const t = useTranslations('carbon');
  const formatMonthLabel = useFormatMonthLabel();

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
                <stop offset="5%" stopColor="#1BAF6A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1BAF6A" stopOpacity={0.02} />
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
                if (value === 'co2_avoided') return t('chartCO2Avoided');
                if (value === 'co2_transport') return t('chartCO2Transport');
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="co2_avoided"
              stroke="#1BAF6A"
              strokeWidth={2}
              fill="url(#tealGradient)"
              dot={false}
              activeDot={{ r: 5 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="co2_transport"
              stroke="#7EC845"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
