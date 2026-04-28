'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CHART_DATA = [
  { year: '2019', rate: 48 },
  { year: '2020', rate: 43 },
  { year: '2021', rate: 45 },
  { year: '2022', rate: 46 },
  { year: '2023', rate: 48 },
  { year: '2025', rate: null, target2025: 55 },
  { year: '2030', rate: null, target2030: 65 },
];

const CO2_FACTOR = 1.2;
const SAVINGS_FACTOR = 80;

export function ImpactSimulator() {
  const t = useTranslations('marketing');
  const [tonnage, setTonnage] = useState(100);

  const computed = useMemo(
    () => ({
      co2: Math.round(tonnage * CO2_FACTOR * 10) / 10,
      savings: Math.round(tonnage * SAVINGS_FACTOR),
      score: Math.min(100, Math.round(20 + (tonnage / 10000) * 80)),
    }),
    [tonnage],
  );

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="gradient-text-verdure-leaf mb-3 text-center text-3xl font-bold sm:text-4xl">
          {t('landing.impactTitle')}
        </h2>
        <p className="text-metal-600 mx-auto mb-14 max-w-xl text-center text-lg">
          {t('landing.impactSub')}
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Simulator */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-metal-900 mb-6 text-lg font-bold">
              {t('landing.simulatorTitle')}
            </h3>

            <label className="text-metal-700 mb-2 block text-sm font-medium">
              {t('landing.simulatorSliderLabel')}
            </label>
            <input
              type="range"
              min={10}
              max={10000}
              step={10}
              value={tonnage}
              onChange={(e) => setTonnage(Number(e.target.value))}
              className="accent-primary mb-2 w-full"
            />
            <div className="text-metal-500 mb-8 flex justify-between text-xs">
              <span>10 t</span>
              <span className="text-primary text-lg font-bold">
                {tonnage.toLocaleString('fr-FR')} t/an
              </span>
              <span>10 000 t</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-brand-light p-4 text-center">
                <p className="text-2xl font-bold text-brand-600">
                  {computed.co2.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-brand">
                  tCO₂e {t('landing.avoided')}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {computed.savings.toLocaleString('fr-FR')} €
                </p>
                <p className="text-xs text-blue-600">
                  {t('landing.potentialSavings')}
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">
                  {computed.score}/100
                </p>
                <p className="text-xs text-purple-600">
                  {t('landing.esgScore')}
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-metal-900 mb-6 text-lg font-bold">
              {t('landing.chartTitle')}
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis domain={[30, 70]} unit="%" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: 'transparent',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#00A86B"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Taux recyclage"
                  connectNulls={false}
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="target2025"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  name="Objectif 2025"
                  connectNulls={false}
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="target2030"
                  stroke="#8BC53F"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  name="Objectif 2030"
                  connectNulls={false}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>

            <p className="text-metal-400 mt-4 text-xs">
              {t('landing.chartSource')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
