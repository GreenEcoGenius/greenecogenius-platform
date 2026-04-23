import { getTranslations } from 'next-intl/server';

import {
  LegalBulletList,
  LegalInfoGrid,
  LegalPageShell,
  LegalSection,
} from '../_components/legal-page-shell';

export async function generateMetadata() {
  const t = await getTranslations('legal');

  return {
    title: `${t('termsTitle')} | GreenEcoGenius`,
    description: t('metaTermsDescription'),
  };
}

export default async function TermsOfServicePage() {
  const t = await getTranslations('legal');

  return (
    <LegalPageShell
      title={t('termsTitle')}
      subtitle={t('termsSubtitle')}
      lastUpdated={t('lastUpdatedTerms')}
    >
      <LegalSection id="informations-legales" title="1. Informations légales">
        <p>La plateforme GreenEcoGenius est éditée conjointement par :</p>
        <h4 className="mt-4 mb-2 text-sm font-semibold uppercase tracking-[0.04em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
          Europe
        </h4>
        <LegalInfoGrid
          items={[
            ['Entité', 'GreenEcoGenius OÜ'],
            [
              'Forme juridique',
              'Société à responsabilité limitée de droit estonien',
            ],
            ['Registre du commerce estonien', '16917315'],
            [
              'Siège social',
              'Tornimäe tn 5, 10145 Tallinn, Harju maakond, Estonie',
            ],
            ['Capital social', '10 000,00 €'],
            ['Directeur', 'Ervis Ago'],
            ['Code EMTAK', "70221, Conseil en gestion d'entreprise"],
            ['Email', 'contact@greenecogenius.tech'],
          ]}
        />
        <h4 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-[0.04em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
          États-Unis
        </h4>
        <LegalInfoGrid
          items={[
            ['Entité', 'GreenEcoGenius, Inc.'],
            ['Forme juridique', 'C-Corporation de droit du Delaware'],
            ['Registered Agent', 'Legalinc Corporate Services Inc.'],
            [
              'Siège social',
              '131 Continental Dr, Suite 305, Newark, Delaware 19713, USA',
            ],
            ['Actions autorisées', '10 000 000 Common Stock'],
            ['Fondateur et Directeur', 'Ervis Ago'],
            ["Date d'incorporation", '4 novembre 2025'],
          ]}
        />
        <p className="mt-4">
          La plateforme est opérée par GreenEcoGenius OÜ pour les utilisateurs
          situés dans l'Union européenne et l'Espace économique européen, et
          par GreenEcoGenius, Inc. pour les utilisateurs situés aux États-Unis
          et au Canada. Les deux entités sont détenues et dirigées par Ervis
          Ago.
        </p>
      </LegalSection>

      <LegalSection id="objet" title="2. Objet">
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) définissent
          les modalités d'accès et d'utilisation de la plateforme
          GreenEcoGenius, accessible à l'adresse greenecogenius.tech
          (ci-après « la Plateforme »).
        </p>
        <p>
          La Plateforme est une marketplace B2B d'économie circulaire
          permettant aux professionnels d'acheter et de vendre des matières
          recyclables, de tracer ces matières via la blockchain et de générer
          des rapports RSE assistés par intelligence artificielle.
        </p>
      </LegalSection>

      <LegalSection id="acceptation" title="3. Acceptation des conditions">
        <p>
          L'inscription sur la Plateforme implique l'acceptation pleine et
          entière des présentes CGU. Si vous n'acceptez pas ces conditions,
          vous ne devez pas utiliser la Plateforme.
        </p>
      </LegalSection>

      <LegalSection
        id="inscription"
        title="4. Inscription et compte utilisateur"
      >
        <p>
          L'accès à la Plateforme nécessite la création d'un compte
          entreprise. L'utilisateur s'engage à fournir des informations
          exactes et à jour lors de son inscription. Chaque compte est
          personnel et l'utilisateur est responsable de la confidentialité de
          ses identifiants.
        </p>
      </LegalSection>

      <LegalSection id="services" title="5. Services proposés">
        <p>La Plateforme propose les services suivants :</p>
        <LegalBulletList
          items={[
            "Le Comptoir Circulaire, marketplace B2B pour l'achat et la vente de matières recyclables entre professionnels",
            'Traçabilité Blockchain, suivi de bout en bout des matières via la blockchain Polygon',
            "IA Carbone et RSE, calcul d'empreinte carbone et génération automatique de rapports RSE",
          ]}
        />
      </LegalSection>

      <LegalSection id="responsabilite" title="6. Responsabilité">
        <p>
          GreenEcoGenius OÜ s'efforce d'assurer la disponibilité et le bon
          fonctionnement de la Plateforme. Toutefois, la société ne saurait
          être tenue responsable des interruptions temporaires, des erreurs
          techniques ou des pertes de données.
        </p>
        <p>
          GreenEcoGenius OÜ agit en tant qu'intermédiaire et ne saurait être
          tenue responsable de la qualité, la conformité ou la livraison des
          matières échangées entre utilisateurs.
        </p>
      </LegalSection>

      <LegalSection
        id="propriete-intellectuelle"
        title="7. Propriété intellectuelle"
      >
        <p>
          L'ensemble des contenus de la Plateforme (textes, images, logos,
          code source) sont la propriété exclusive de GreenEcoGenius OÜ et
          sont protégés par le droit de la propriété intellectuelle. Toute
          reproduction non autorisée est interdite.
        </p>
      </LegalSection>

      <LegalSection id="resiliation" title="8. Résiliation">
        <p>
          L'utilisateur peut supprimer son compte à tout moment depuis ses
          paramètres. GreenEcoGenius OÜ se réserve le droit de suspendre ou
          supprimer un compte en cas de violation des présentes CGU.
        </p>
      </LegalSection>

      <LegalSection id="droit-applicable" title="9. Droit applicable">
        <p>
          Les présentes CGU sont régies par le droit estonien. Tout litige
          sera soumis à la compétence exclusive des tribunaux de Tallinn,
          Estonie.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>
          Pour toute question relative aux présentes CGU, contactez-nous à
          l'adresse{' '}
          <a href="mailto:contact@greenecogenius.tech">
            contact@greenecogenius.tech
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection
        id="loi-juridiction"
        title="11. Loi applicable et juridiction"
      >
        <p>
          Pour les utilisateurs résidant dans l'Union européenne ou l'Espace
          économique européen, les présentes CGU sont régies par le droit
          estonien. Tout litige sera soumis à la compétence exclusive des
          tribunaux de Tallinn, Estonie, sans préjudice des droits du
          consommateur de saisir les tribunaux de son lieu de résidence.
        </p>
        <p>
          Pour les utilisateurs résidant aux États-Unis ou au Canada, les
          présentes CGU sont régies par le droit de l'État du Delaware. Tout
          litige sera soumis à la compétence des tribunaux fédéraux ou
          étatiques situés dans le comté de New Castle, Delaware.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
