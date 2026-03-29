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

      <div className="container mx-auto max-w-3xl py-8">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-sm">
            Dernière mise à jour : 29 mars 2026
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est <strong>GreenEcoGenius OÜ</strong>,
            société immatriculée en Estonie sous le numéro 16917315, dont le siège social est
            situé Tornimäe tn 5, 10145 Tallinn, Estonie.
          </p>
          <p>
            <strong>Contact DPO :</strong>{' '}
            <a href="mailto:ervis@greenecogenius.fr">ervis@greenecogenius.fr</a>
          </p>

          <h2>2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul>
            <li><strong>Données d'identification :</strong> nom, prénom, adresse e-mail, numéro de téléphone</li>
            <li><strong>Données d'entreprise :</strong> raison sociale, numéro SIRET/TVA, adresse, secteur d'activité</li>
            <li><strong>Données de transaction :</strong> annonces publiées, transactions réalisées, matières échangées</li>
            <li><strong>Données techniques :</strong> adresse IP, type de navigateur, pages visitées, cookies</li>
            <li><strong>Données environnementales :</strong> empreinte carbone calculée, rapports RSE générés</li>
          </ul>

          <h2>3. Finalités du traitement</h2>
          <p>Vos données sont traitées pour les finalités suivantes :</p>
          <ul>
            <li>Gestion de votre compte et authentification</li>
            <li>Mise en relation entre acheteurs et vendeurs de matières recyclables</li>
            <li>Traçabilité des matières via la blockchain</li>
            <li>Calcul d'empreinte carbone et génération de rapports RSE</li>
            <li>Envoi de communications relatives à votre compte</li>
            <li>Amélioration de nos services et statistiques d'utilisation</li>
          </ul>

          <h2>4. Base juridique</h2>
          <p>Le traitement de vos données repose sur :</p>
          <ul>
            <li><strong>L'exécution du contrat :</strong> pour la fourniture des services de la Plateforme</li>
            <li><strong>Le consentement :</strong> pour les cookies non essentiels et les communications marketing</li>
            <li><strong>L'intérêt légitime :</strong> pour l'amélioration de nos services et la prévention de la fraude</li>
            <li><strong>L'obligation légale :</strong> pour le respect des réglementations fiscales et environnementales</li>
          </ul>

          <h2>5. Durée de conservation</h2>
          <p>
            Vos données personnelles sont conservées pendant la durée de votre utilisation de la
            Plateforme, puis pendant une durée de 3 ans après la suppression de votre compte, sauf
            obligation légale de conservation plus longue.
          </p>
          <p>
            Les données de transaction sont conservées pendant 10 ans conformément aux obligations
            comptables et fiscales.
          </p>

          <h2>6. Partage des données</h2>
          <p>Vos données peuvent être partagées avec :</p>
          <ul>
            <li><strong>Les autres utilisateurs :</strong> informations publiques de votre profil entreprise dans le cadre des transactions</li>
            <li><strong>Nos sous-traitants techniques :</strong> hébergement (Vercel, Supabase), analytics, services e-mail</li>
            <li><strong>La blockchain Polygon :</strong> données de traçabilité des matières (anonymisées)</li>
          </ul>
          <p>
            Nous ne vendons jamais vos données personnelles à des tiers.
          </p>

          <h2>7. Transferts internationaux</h2>
          <p>
            Vos données sont hébergées dans des centres de données situés dans l'Union Européenne.
            En cas de transfert hors UE, des garanties appropriées sont mises en place (clauses
            contractuelles types de la Commission européenne).
          </p>

          <h2>8. Vos droits (RGPD)</h2>
          <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
          </ul>
          <p>
            Pour exercer vos droits, contactez-nous à{' '}
            <a href="mailto:ervis@greenecogenius.fr">ervis@greenecogenius.fr</a>.
            Nous répondrons dans un délai de 30 jours.
          </p>

          <h2>9. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
            protéger vos données : chiffrement TLS, authentification multi-facteurs, contrôle
            d'accès basé sur les rôles, audits de sécurité réguliers.
          </p>

          <h2>10. Contact et réclamations</h2>
          <p>
            Pour toute question concernant cette politique, contactez-nous à{' '}
            <a href="mailto:ervis@greenecogenius.fr">ervis@greenecogenius.fr</a>.
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de l'Autorité estonienne
            de protection des données (Andmekaitse Inspektsioon) — <a href="https://www.aki.ee" target="_blank" rel="noopener noreferrer">www.aki.ee</a>.
          </p>
        </article>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
