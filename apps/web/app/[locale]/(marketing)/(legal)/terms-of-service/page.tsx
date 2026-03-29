import { getTranslations } from 'next-intl/server';

import { SitePageHeader } from '~/(marketing)/_components/site-page-header';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('termsOfService'),
  };
}

async function TermsOfServicePage() {
  const t = await getTranslations('marketing');

  return (
    <div>
      <SitePageHeader
        title={t('termsOfService')}
        subtitle={t('termsOfServiceDescription')}
      />

      <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <p className="text-muted-foreground mb-12 text-sm">
          Dernière mise à jour : 29 mars 2026
        </p>

        <Section title="1. Informations légales">
          <p>
            La plateforme GreenEcoGenius est éditée par{' '}
            <strong>GreenEcoGenius OÜ</strong>, société à responsabilité limitée
            de droit estonien, immatriculée au registre du commerce sous le
            numéro <strong>16917315</strong>.
          </p>
          <InfoGrid
            items={[
              [
                'Siège social',
                'Tornimäe tn 5, 10145 Tallinn, Harju maakond, Estonie',
              ],
              ['Capital social', '10 000,00 €'],
              ['Directeur', 'Ervis Ago'],
              ['Email', 'contact@greenecogenius.fr'],
              ['Code EMTAK', "70221 — Conseil en gestion d'entreprise"],
            ]}
          />
        </Section>

        <Section title="2. Objet">
          <p>
            {
              "Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation de la plateforme GreenEcoGenius, accessible à l'adresse"
            }
            greenecogenius-platform-dev-tool.vercel.app (ci-après « la
            Plateforme »).
          </p>
          <p>
            {"La Plateforme est une marketplace B2B d'économie circulaire"}
            {
              "permettant aux professionnels d'acheter et de vendre des matières"
            }
            recyclables, de tracer ces matières via la blockchain et de générer
            des rapports RSE assistés par intelligence artificielle.
          </p>
        </Section>

        <Section title="3. Acceptation des conditions">
          <p>
            {
              "L'inscription sur la Plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions,"
            }
            vous ne devez pas utiliser la Plateforme.
          </p>
        </Section>

        <Section title="4. Inscription et compte utilisateur">
          <p>
            {"L'accès à la Plateforme nécessite la création d'un compte"}
            {"entreprise. L'utilisateur s'engage à fournir des informations"}
            exactes et à jour lors de son inscription. Chaque compte est
            {
              "personnel et l'utilisateur est responsable de la confidentialité de"
            }
            ses identifiants.
          </p>
        </Section>

        <Section title="5. Services proposés">
          <p>La Plateforme propose les services suivants :</p>
          <BulletList
            items={[
              "Le Comptoir Circulaire — marketplace B2B pour l'achat et la vente de matières recyclables entre professionnels",
              'Traçabilité Blockchain — suivi de bout en bout des matières via la blockchain Polygon',
              "IA Carbone & RSE — calcul d'empreinte carbone et génération automatique de rapports RSE",
            ]}
          />
        </Section>

        <Section title="6. Responsabilité">
          <p>
            {"GreenEcoGenius OÜ s'efforce d'assurer la disponibilité et le bon"}
            fonctionnement de la Plateforme. Toutefois, la société ne saurait
            être tenue responsable des interruptions temporaires, des erreurs
            techniques ou des pertes de données.
          </p>
          <p>
            {
              "GreenEcoGenius OÜ agit en tant qu'intermédiaire et ne saurait être"
            }
            tenue responsable de la qualité, la conformité ou la livraison des
            matières échangées entre utilisateurs.
          </p>
        </Section>

        <Section title="7. Propriété intellectuelle">
          <p>
            {"L'ensemble des contenus de la Plateforme (textes, images, logos,"}
            code source) sont la propriété exclusive de GreenEcoGenius OÜ et
            sont protégés par le droit de la propriété intellectuelle. Toute
            reproduction non autorisée est interdite.
          </p>
        </Section>

        <Section title="8. Résiliation">
          <p>
            {"L'utilisateur peut supprimer son compte à tout moment depuis ses"}
            paramètres. GreenEcoGenius OÜ se réserve le droit de suspendre ou
            supprimer un compte en cas de violation des présentes CGU.
          </p>
        </Section>

        <Section title="9. Droit applicable">
          <p>
            Les présentes CGU sont régies par le droit estonien. Tout litige
            sera soumis à la compétence exclusive des tribunaux de Tallinn,
            Estonie.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Pour toute question relative aux présentes CGU, contactez-nous à
            {"l'adresse"}{' '}
            <a
              href="mailto:contact@greenecogenius.fr"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              contact@greenecogenius.fr
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

export default TermsOfServicePage;

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

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="bg-card mt-4 rounded-lg border p-5">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              {label}
            </dt>
            <dd className="text-foreground mt-1 text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
