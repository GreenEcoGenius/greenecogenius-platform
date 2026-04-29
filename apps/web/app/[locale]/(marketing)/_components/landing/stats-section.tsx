import { Factory, Globe, Recycle, TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../animate-on-scroll';
import { AnimatedCounter } from '../animated-counter';

const STATS = [
  {
    icon: Factory,
    value: 309,
    suffix: ' Mt',
    sourceKey: 'landing.stat1Source',
    labelKey: 'landing.stat1Label',
  },
  {
    icon: Recycle,
    value: 42,
    suffix: '%',
    sourceKey: 'landing.stat2Source',
    labelKey: 'landing.stat2Label',
  },
  {
    icon: TrendingUp,
    value: 50,
    suffix: ' Mds€',
    sourceKey: 'landing.stat3Source',
    labelKey: 'landing.stat3Label',
  },
  {
    icon: Globe,
    value: 12,
    suffix: '%',
    sourceKey: 'landing.stat4Source',
    labelKey: 'landing.stat4Label',
  },
];

export async function StatsSection() {
  const t = await getTranslations('marketing');

  return (
    <section className="bg-[#0D3A26] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2 className="gradient-text-verdure-leaf mb-4 text-center text-3xl font-bold sm:text-4xl">
            {t('landing.statsTitle')}
          </h2>
          <p className="text-[#B8D4E3] mx-auto mb-14 max-w-xl text-center text-lg">
            {t('landing.statsSub')}
          </p>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="border-[#1A5C3E] rounded-2xl border bg-[#0D3A26] p-6 text-center shadow-lg shadow-black/20">
                  <div className={`${stat.iconBg || "bg-[#1A5C3E]"} ${stat.iconColor || "text-primary"} mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className={`text-4xl font-bold sm:text-5xl ${stat.numColor || "text-[#10B981]"}`}>
                    <AnimatedCounter target={stat.value} />
                    {stat.suffix}
                  </p>
                  <p className="text-[#E0E7E3] mt-2 text-sm font-medium">
                    {t(stat.labelKey)}
                  </p>
                  <p className="text-[#5A9E7D] mt-1 text-xs">
                    {t(stat.sourceKey)}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
