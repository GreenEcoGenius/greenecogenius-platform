import { getTranslations } from 'next-intl/server';

export async function SourcesDisclaimer() {
  const t = await getTranslations('marketing');

  return (
    <section className="border-[#1A5C3E] border-t py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-[#B8D4E3] rounded-xl border bg-[#12472F] p-5 text-sm">
          <p className="text-[#E0E7E3] mb-2 font-medium">
            {t('explorer.sourcesTitle')}
          </p>
          <ul className="space-y-1 text-xs">
            <li>
              <strong>France</strong> : ADEME/SINOE, FEDEREC —{' '}
              {t('explorer.sourcesFranceDesc')}
            </li>
            <li>
              <strong>Europe</strong> : Eurostat —{' '}
              {t('explorer.sourcesEuropeDesc')}
            </li>
            <li>
              <strong>USA</strong> : US EPA — {t('explorer.sourcesUsaDesc')}
            </li>
          </ul>
          <p className="text-[#5A9E7D] mt-2 text-[10px]">
            {t('explorer.sourcesLastUpdate')}
          </p>
        </div>
      </div>
    </section>
  );
}
