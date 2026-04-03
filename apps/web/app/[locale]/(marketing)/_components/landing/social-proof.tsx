import { getTranslations } from 'next-intl/server';

import { AnimateOnScroll } from '../animate-on-scroll';

const PARTNERS = [
  { name: 'Polygon', label: 'Blockchain' },
  { name: 'ADEME', label: 'Méthodologie' },
  { name: 'Supabase', label: 'Infrastructure' },
  { name: 'Vercel', label: 'Déploiement' },
  { name: 'CSRD/ESRS', label: 'Conformité' },
  { name: 'GHG Protocol', label: 'Bilan carbone' },
];

export async function SocialProof() {
  const t = await getTranslations('marketing');

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <p className="text-metal-500 mb-10 text-center text-sm font-medium uppercase tracking-wider">
            {t('landing.socialTitle')}
          </p>
        </AnimateOnScroll>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="group flex flex-col items-center gap-1 transition-all"
            >
              <span className="text-metal-300 group-hover:text-primary text-lg font-bold transition-colors sm:text-xl">
                {p.name}
              </span>
              <span className="text-metal-400 text-[10px]">{p.label}</span>
            </div>
          ))}
        </div>

        <p className="text-metal-400 mt-8 text-center text-xs">
          {t('landing.socialDisclaimer')}
        </p>
      </div>
    </section>
  );
}
