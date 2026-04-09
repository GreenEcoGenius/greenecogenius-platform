import { getTranslations } from 'next-intl/server';

export async function SourcesDisclaimer() {
  const t = await getTranslations('marketing');

  return (
    <section className="border-metal-chrome border-t py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-metal-600 rounded-xl border bg-gray-50 p-5 text-sm">
          <p className="text-metal-700 mb-2 font-medium">
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
          <p className="text-metal-400 mt-2 text-[10px]">
            {t('explorer.sourcesLastUpdate')}
          </p>
        </div>
      </div>
    </section>
  );
}
