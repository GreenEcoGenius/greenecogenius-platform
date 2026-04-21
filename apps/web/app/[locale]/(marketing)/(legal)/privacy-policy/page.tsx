import { getTranslations } from 'next-intl/server';

import {
  LegalBulletList,
  LegalDataTable,
  LegalPageShell,
  LegalSection,
} from '../_components/legal-page-shell';

export async function generateMetadata() {
  const t = await getTranslations('legal');

  return {
    title: `${t('privacyTitle')} | GreenEcoGenius`,
    description: t('metaPrivacyDescription'),
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('legal');

  return (
    <LegalPageShell
      title={t('privacyTitle')}
      subtitle={t('privacySubtitle')}
      lastUpdated={t('lastUpdatedPrivacy')}
    >
      <LegalSection
        id="responsables-traitement"
        title="1. Responsables du traitement"
      >
        <p>
          <strong>Pour les utilisateurs situés dans l'UE/EEE :</strong>
        </p>
        <p>
          Responsable du traitement : <strong>GreenEcoGenius OÜ</strong>
          <br />
          Adresse : Tornimäe tn 5, 10145 Tallinn, Estonie
          <br />
          Registre : 16917315
          <br />
          Email DPO :{' '}
          <a href="mailto:contact@greenecogenius.tech">
            contact@greenecogenius.tech
          </a>
          <br />
          Base légale : RGPD (UE) 2016/679
        </p>
        <p>
          <strong>Pour les utilisateurs situés aux États-Unis :</strong>
        </p>
        <p>
          Responsable du traitement : <strong>GreenEcoGenius, Inc.</strong>
          <br />
          Adresse : 131 Continental Dr, Suite 305, Newark, DE 19713, USA
          <br />
          Lois applicables : CCPA (California), lois étatiques applicables
        </p>
        <p>
          Les deux entités appliquent les mêmes standards de protection des
          données, alignés sur le RGPD européen, considéré comme le niveau le
          plus élevé de protection au niveau mondial.
        </p>
      </LegalSection>

      <LegalSection id="donnees-collectees" title="2. Données collectées">
        <p>Nous collectons les données suivantes :</p>
        <LegalDataTable
          rows={[
            [
              'Identification',
              'Nom, prénom, adresse e-mail, numéro de téléphone',
            ],
            [
              'Entreprise',
              "Raison sociale, numéro SIRET/TVA, adresse, secteur d'activité",
            ],
            [
              'Transactions',
              'Annonces publiées, transactions réalisées, matières échangées',
            ],
            [
              'Techniques',
              'Adresse IP, type de navigateur, pages visitées, cookies',
            ],
            [
              'Environnementales',
              'Empreinte carbone calculée, rapports RSE générés',
            ],
          ]}
        />
      </LegalSection>

      <LegalSection id="finalites" title="3. Finalités du traitement">
        <LegalBulletList
          items={[
            'Gestion de votre compte et authentification',
            'Mise en relation entre acheteurs et vendeurs de matières recyclables',
            'Traçabilité des matières via la blockchain',
            "Calcul d'empreinte carbone et génération de rapports RSE",
            'Envoi de communications relatives à votre compte',
            "Amélioration de nos services et statistiques d'utilisation",
          ]}
        />
      </LegalSection>

      <LegalSection id="base-juridique" title="4. Base juridique">
        <LegalDataTable
          rows={[
            ['Exécution du contrat', 'Fourniture des services de la Plateforme'],
            [
              'Consentement',
              'Cookies non essentiels et communications marketing',
            ],
            [
              'Intérêt légitime',
              'Amélioration de nos services et prévention de la fraude',
            ],
            [
              'Obligation légale',
              'Respect des réglementations fiscales et environnementales',
            ],
          ]}
        />
      </LegalSection>

      <LegalSection id="duree-conservation" title="5. Durée de conservation">
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
      </LegalSection>

      <LegalSection id="partage" title="6. Partage des données">
        <LegalDataTable
          rows={[
            [
              'Autres utilisateurs',
              'Informations publiques de votre profil dans le cadre des transactions',
            ],
            [
              'Sous-traitants techniques',
              'Hébergement (Vercel, Supabase), analytics, services e-mail',
            ],
            [
              'Blockchain Polygon',
              'Données de traçabilité des matières (anonymisées)',
            ],
          ]}
        />
        <p className="mt-4">
          Nous ne vendons jamais vos données personnelles à des tiers.
        </p>
      </LegalSection>

      <LegalSection
        id="transferts-internationaux"
        title="7. Transferts internationaux"
      >
        <p>
          Vos données sont hébergées dans des centres de données situés dans
          l'Union Européenne. En cas de transfert hors UE, des garanties
          appropriées sont mises en place (clauses contractuelles types de la
          Commission européenne).
        </p>
      </LegalSection>

      <LegalSection id="droits-rgpd" title="8. Vos droits (RGPD)">
        <p>
          Conformément au Règlement Général sur la Protection des Données,
          vous disposez des droits suivants :
        </p>
        <LegalDataTable
          rows={[
            ["Droit d'accès", 'Obtenir une copie de vos données personnelles'],
            ['Droit de rectification', 'Corriger des données inexactes'],
            ["Droit à l'effacement", 'Demander la suppression de vos données'],
            [
              'Droit à la portabilité',
              'Recevoir vos données dans un format structuré',
            ],
            [
              "Droit d'opposition",
              'Vous opposer au traitement de vos données',
            ],
            ['Droit à la limitation', 'Limiter le traitement de vos données'],
          ]}
        />
        <p className="mt-4">
          Pour exercer vos droits, contactez-nous à{' '}
          <a href="mailto:contact@greenecogenius.tech">
            contact@greenecogenius.tech
          </a>
          . Nous répondrons dans un délai de 30 jours.
        </p>
      </LegalSection>

      <LegalSection id="securite" title="9. Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          appropriées pour protéger vos données : chiffrement TLS,
          authentification multi-facteurs, contrôle d'accès basé sur les
          rôles, audits de sécurité réguliers.
        </p>
      </LegalSection>

      <LegalSection
        id="contact-reclamations"
        title="10. Contact et réclamations"
      >
        <p>
          Pour toute question concernant cette politique, contactez-nous à{' '}
          <a href="mailto:contact@greenecogenius.tech">
            contact@greenecogenius.tech
          </a>
          .
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de l'Autorité
          estonienne de protection des données (Andmekaitse Inspektsioon),{' '}
          <a
            href="https://www.aki.ee"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.aki.ee
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection
        id="transferts-internationaux-detail"
        title="11. Transferts internationaux de données"
      >
        <p>
          Les données des utilisateurs européens sont hébergées dans l'Union
          européenne (Supabase, région Ireland eu-west-1). Aucun transfert de
          données personnelles d'utilisateurs européens vers les États-Unis
          n'est effectué sauf si nécessaire au fonctionnement du service,
          auquel cas le transfert est encadré par les Clauses Contractuelles
          Types (CCT) de la Commission européenne.
        </p>
        <p>
          Les données des utilisateurs américains sont traitées par
          GreenEcoGenius, Inc. conformément aux lois fédérales et étatiques
          applicables.
        </p>
        <p>
          <strong>Sous-traitants techniques :</strong>
        </p>
        <LegalDataTable
          rows={[
            ['Supabase, Inc.', 'Hébergement base de données, EU region'],
            [
              'Vercel, Inc.',
              'Hébergement application, Edge network global',
            ],
            ['Anthropic, PBC', 'Intelligence artificielle, API Claude'],
            ['Alchemy Insights, Inc.', 'Blockchain, Polygon Mainnet'],
            ['Stripe, Inc.', 'Paiements, PCI DSS Level 1'],
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  );
}
