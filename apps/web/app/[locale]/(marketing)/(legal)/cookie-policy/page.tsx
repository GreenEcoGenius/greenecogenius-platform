import { getTranslations } from 'next-intl/server';

import { SitePageHeader } from '~/(marketing)/_components/site-page-header';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('cookiePolicy'),
  };
}

async function CookiePolicyPage() {
  const t = await getTranslations('marketing');

  return (
    <div>
      <SitePageHeader
        title={t('cookiePolicy')}
        subtitle={t('cookiePolicyDescription')}
      />

      <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <p className="text-muted-foreground mb-12 text-sm">
          Dernière mise à jour : 29 mars 2026
        </p>

        <Section title={"1. Qu'est-ce qu'un cookie ?"}>
          <p>
            Un cookie est un petit fichier texte stocké sur votre appareil
            lorsque vous visitez un site web. Les cookies permettent au site de
            mémoriser vos actions et préférences (connexion, langue, taille de
            police, etc.) pendant une durée déterminée.
          </p>
        </Section>

        <Section title="2. Cookies utilisés sur la Plateforme">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Cookies essentiels (obligatoires)
          </h3>
          <p className="mb-3">
            Ces cookies sont nécessaires au fonctionnement de la Plateforme :
          </p>
          <CookieTable
            rows={[
              ['sb-*-auth-token', "Session d'authentification Supabase", '1 heure (renouvelable)'],
              ['theme', 'Thème clair ou sombre', '1 an'],
              ['NEXT_LOCALE', 'Langue', '1 an'],
            ]}
          />

          <h3 className="mb-3 mt-8 text-sm font-semibold text-foreground">
            Cookies analytiques (optionnels)
          </h3>
          <p className="mb-3">
            Ces cookies nous aident à comprendre comment les visiteurs utilisent
            la Plateforme. Ils sont activés uniquement avec votre consentement.
          </p>
          <CookieTable
            rows={[
              ['_va', 'Vercel Analytics — mesure de performance', 'Session'],
            ]}
          />
        </Section>

        <Section title="3. Gestion de vos préférences">
          <p>
            Lors de votre première visite, un bandeau de consentement vous
            {"permet d'accepter ou de refuser les cookies non essentiels. Vous"}
            pouvez modifier vos préférences à tout moment.
          </p>
          <p>
            Vous pouvez également configurer votre navigateur pour bloquer ou
            supprimer les cookies :
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['Chrome', 'https://support.google.com/chrome/answer/95647'],
              ['Firefox', 'https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent'],
              ['Safari', 'https://support.apple.com/fr-fr/guide/safari/sfri11471/mac'],
              ['Edge', 'https://support.microsoft.com/fr-fr/microsoft-edge'],
            ].map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border bg-card px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {name}
              </a>
            ))}
          </div>
        </Section>

        <Section title="4. Conséquences du refus des cookies">
          <p>
            {"Le refus des cookies essentiels peut empêcher l'utilisation de"}
            certaines fonctionnalités de la Plateforme (connexion, préférences).
            {"Le refus des cookies analytiques n'affecte pas l'utilisation de la"}
            Plateforme.
          </p>
        </Section>

        <Section title="5. Contact">
          <p>
            Pour toute question concernant notre utilisation des cookies,
            contactez-nous à{' '}
            <a
              href="mailto:contact@greenecogenius.fr"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              contact@greenecogenius.fr
            </a>
            .
          </p>
          <div className="mt-4 rounded-lg border bg-card p-5 text-sm">
            <p className="font-semibold text-foreground">GreenEcoGenius OÜ</p>
            <p className="text-muted-foreground mt-1">
              Tornimäe tn 5, 10145 Tallinn, Estonie
            </p>
            <p className="text-muted-foreground">
              Registre du commerce : 16917315
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}

export default CookiePolicyPage;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border/50 mb-10 border-b pb-10 last:mb-0 last:border-b-0 last:pb-0">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
      <div className="text-muted-foreground space-y-3 text-[15px] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function CookieTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cookie
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Finalité
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Durée
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([cookie, purpose, duration], i) => (
            <tr key={cookie} className={i > 0 ? 'border-t border-border/50' : ''}>
              <td className="px-4 py-3 font-mono text-xs text-foreground">
                {cookie}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{purpose}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
