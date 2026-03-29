import { getTranslations } from 'next-intl/server';

import { SitePageHeader } from '~/(marketing)/_components/site-page-header';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('privacyPolicy'),
  };
}

async function PrivacyPolicyPage() {
  const t = await getTranslations('marketing');

  return (
    <div>
      <SitePageHeader
        title={t('privacyPolicy')}
        subtitle={t('privacyPolicyDescription')}
      />

      <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <p className="text-muted-foreground mb-12 text-sm">
          Dernière mise à jour : 29 mars 2026
        </p>

        <Section title="1. Responsable du traitement">
          <p>
            Le responsable du traitement des données personnelles est{' '}
            <strong className="text-foreground">GreenEcoGenius OÜ</strong>,
            société immatriculée en Estonie sous le numéro 16917315, dont le
            siège social est situé Tornimäe tn 5, 10145 Tallinn, Estonie.
          </p>
          <p>
            <strong className="text-foreground">Contact DPO :</strong>{' '}
            <a href="mailto:contact@greenecogenius.fr" className="text-primary underline underline-offset-4 hover:text-primary/80">
              contact@greenecogenius.fr
            </a>
          </p>
        </Section>

        <Section title="2. Données collectées">
          <p>Nous collectons les données suivantes :</p>
          <DataTable
            rows={[
              ['Identification', 'Nom, prénom, adresse e-mail, numéro de téléphone'],
              ['Entreprise', "Raison sociale, numéro SIRET/TVA, adresse, secteur d'activité"],
              ['Transactions', 'Annonces publiées, transactions réalisées, matières échangées'],
              ['Techniques', 'Adresse IP, type de navigateur, pages visitées, cookies'],
              ['Environnementales', 'Empreinte carbone calculée, rapports RSE générés'],
            ]}
          />
        </Section>

        <Section title="3. Finalités du traitement">
          <BulletList
            items={[
              'Gestion de votre compte et authentification',
              'Mise en relation entre acheteurs et vendeurs de matières recyclables',
              'Traçabilité des matières via la blockchain',
              "Calcul d'empreinte carbone et génération de rapports RSE",
              'Envoi de communications relatives à votre compte',
              "Amélioration de nos services et statistiques d'utilisation",
            ]}
          />
        </Section>

        <Section title="4. Base juridique">
          <DataTable
            rows={[
              ['Exécution du contrat', 'Fourniture des services de la Plateforme'],
              ['Consentement', 'Cookies non essentiels et communications marketing'],
              ['Intérêt légitime', 'Amélioration de nos services et prévention de la fraude'],
              ['Obligation légale', 'Respect des réglementations fiscales et environnementales'],
            ]}
          />
        </Section>

        <Section title="5. Durée de conservation">
          <p>
            Vos données personnelles sont conservées pendant la durée de votre
            utilisation de la Plateforme, puis pendant une durée de 3 ans après
            la suppression de votre compte, sauf obligation légale de
            conservation plus longue.
          </p>
          <p>
            Les données de transaction sont conservées pendant 10 ans
            conformément aux obligations comptables et fiscales.
          </p>
        </Section>

        <Section title="6. Partage des données">
          <DataTable
            rows={[
              ['Autres utilisateurs', 'Informations publiques de votre profil dans le cadre des transactions'],
              ['Sous-traitants techniques', 'Hébergement (Vercel, Supabase), analytics, services e-mail'],
              ['Blockchain Polygon', 'Données de traçabilité des matières (anonymisées)'],
            ]}
          />
          <p className="mt-4">
            Nous ne vendons jamais vos données personnelles à des tiers.
          </p>
        </Section>

        <Section title="7. Transferts internationaux">
          <p>
            Vos données sont hébergées dans des centres de données situés dans
            {"l'Union Européenne. En cas de transfert hors UE, des garanties"}
            appropriées sont mises en place (clauses contractuelles types de la
            Commission européenne).
          </p>
        </Section>

        <Section title="8. Vos droits (RGPD)">
          <p>
            Conformément au Règlement Général sur la Protection des Données,
            vous disposez des droits suivants :
          </p>
          <DataTable
            rows={[
              ["Droit d'accès", 'Obtenir une copie de vos données personnelles'],
              ['Droit de rectification', 'Corriger des données inexactes'],
              ["Droit à l'effacement", 'Demander la suppression de vos données'],
              ['Droit à la portabilité', 'Recevoir vos données dans un format structuré'],
              ["Droit d'opposition", 'Vous opposer au traitement de vos données'],
              ['Droit à la limitation', 'Limiter le traitement de vos données'],
            ]}
          />
          <p className="mt-4">
            Pour exercer vos droits, contactez-nous à{' '}
            <a href="mailto:contact@greenecogenius.fr" className="text-primary underline underline-offset-4 hover:text-primary/80">
              contact@greenecogenius.fr
            </a>
            . Nous répondrons dans un délai de 30 jours.
          </p>
        </Section>

        <Section title="9. Sécurité">
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            appropriées pour protéger vos données : chiffrement TLS,
            {"authentification multi-facteurs, contrôle d'accès basé sur les"}
            rôles, audits de sécurité réguliers.
          </p>
        </Section>

        <Section title="10. Contact et réclamations">
          <p>
            Pour toute question concernant cette politique, contactez-nous à{' '}
            <a href="mailto:contact@greenecogenius.fr" className="text-primary underline underline-offset-4 hover:text-primary/80">
              contact@greenecogenius.fr
            </a>
            .
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de
            {"l'Autorité estonienne de protection des données (Andmekaitse"}
            Inspektsioon) —{' '}
            <a href="https://www.aki.ee" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">
              www.aki.ee
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;

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

function DataTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={label} className={i > 0 ? 'border-t border-border/50' : ''}>
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap align-top w-1/3">
                {label}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
