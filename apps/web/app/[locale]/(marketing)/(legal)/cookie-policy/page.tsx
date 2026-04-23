import { getTranslations } from 'next-intl/server';

import {
  LegalCookieTable,
  LegalPageShell,
  LegalSection,
} from '../_components/legal-page-shell';

export async function generateMetadata() {
  const t = await getTranslations('legal');

  return {
    title: `${t('cookiesTitle')} | GreenEcoGenius`,
    description: t('metaCookiesDescription'),
  };
}

const BROWSER_LINKS: ReadonlyArray<readonly [string, string]> = [
  ['Chrome', 'https://support.google.com/chrome/answer/95647'],
  [
    'Firefox',
    'https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent',
  ],
  ['Safari', 'https://support.apple.com/fr-fr/guide/safari/sfri11471/mac'],
  ['Edge', 'https://support.microsoft.com/fr-fr/microsoft-edge'],
];

export default async function CookiePolicyPage() {
  const t = await getTranslations('legal');

  return (
    <LegalPageShell
      title={t('cookiesTitle')}
      subtitle={t('cookiesSubtitle')}
      lastUpdated={t('lastUpdatedCookies')}
    >
      <LegalSection id="definition" title="1. Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier texte stocké sur votre appareil
          lorsque vous visitez un site web. Les cookies permettent au site de
          mémoriser vos actions et préférences (connexion, langue, taille de
          police, etc.) pendant une durée déterminée.
        </p>
      </LegalSection>

      <LegalSection
        id="cookies-utilises"
        title="2. Cookies utilisés sur la Plateforme"
      >
        <h3 className="mt-2 text-base font-semibold uppercase tracking-[0.04em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
          Cookies essentiels (obligatoires)
        </h3>
        <p>
          Ces cookies sont nécessaires au fonctionnement de la Plateforme :
        </p>
        <LegalCookieTable
          headers={['Cookie', 'Finalité', 'Durée']}
          rows={[
            [
              'sb-*-auth-token',
              "Session d'authentification Supabase",
              '1 heure (renouvelable)',
            ],
            ['theme', 'Thème clair ou sombre', '1 an'],
            ['NEXT_LOCALE', 'Langue', '1 an'],
          ]}
        />

        <h3 className="mt-8 text-base font-semibold uppercase tracking-[0.04em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
          Cookies analytiques (optionnels)
        </h3>
        <p>
          Ces cookies nous aident à comprendre comment les visiteurs utilisent
          la Plateforme. Ils sont activés uniquement avec votre consentement.
        </p>
        <LegalCookieTable
          headers={['Cookie', 'Finalité', 'Durée']}
          rows={[['_va', 'Vercel Analytics, mesure de performance', 'Session']]}
        />
      </LegalSection>

      <LegalSection id="gestion" title="3. Gestion de vos préférences">
        <p>
          Lors de votre première visite, un bandeau de consentement vous
          permet d'accepter ou de refuser les cookies non essentiels. Vous
          pouvez modifier vos préférences à tout moment.
        </p>
        <p>
          Vous pouvez également configurer votre navigateur pour bloquer ou
          supprimer les cookies :
        </p>
        <div className="mt-4 not-prose grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BROWSER_LINKS.map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300] bg-white px-4 py-3 text-center text-sm font-medium text-[--color-enviro-forest-900] transition-all duration-200 hover:-translate-y-0.5 hover:border-[--color-enviro-forest-700] hover:text-[--color-enviro-cta] font-[family-name:var(--font-enviro-sans)]"
            >
              {name}
            </a>
          ))}
        </div>
      </LegalSection>

      <LegalSection id="refus" title="4. Conséquences du refus des cookies">
        <p>
          Le refus des cookies essentiels peut empêcher l'utilisation de
          certaines fonctionnalités de la Plateforme (connexion, préférences).
          Le refus des cookies analytiques n'affecte pas l'utilisation de la
          Plateforme.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="5. Contact">
        <p>
          Pour toute question concernant notre utilisation des cookies,
          contactez-nous à{' '}
          <a href="mailto:contact@greenecogenius.tech">
            contact@greenecogenius.tech
          </a>
          .
        </p>
        <div className="mt-4 not-prose rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] p-5 text-sm font-[family-name:var(--font-enviro-sans)]">
          <p className="font-semibold text-[--color-enviro-forest-900]">
            GreenEcoGenius OÜ (Estonie) · GreenEcoGenius, Inc. (Delaware, USA)
          </p>
          <p className="mt-1 text-[--color-enviro-forest-700]">
            Europe : Tornimäe tn 5, 10145 Tallinn, Estonie, Registre 16917315
          </p>
          <p className="text-[--color-enviro-forest-700]">
            USA : 131 Continental Dr, Suite 305, Newark, DE 19713
          </p>
          <p className="text-[--color-enviro-forest-700]">
            Contact : contact@greenecogenius.tech
          </p>
        </div>
      </LegalSection>
    </LegalPageShell>
  );
}
