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

      <div className="container mx-auto max-w-3xl py-8">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-sm">
            Dernière mise à jour : 29 mars 2026
          </p>

          <h2>1. Informations légales</h2>
          <p>
            La plateforme GreenEcoGenius est éditée par <strong>GreenEcoGenius OÜ</strong>,
            société à responsabilité limitée de droit estonien, immatriculée au registre
            du commerce sous le numéro <strong>16917315</strong>.
          </p>
          <ul>
            <li><strong>Siège social :</strong> Tornimäe tn 5, 10145 Tallinn, Harju maakond, Estonie</li>
            <li><strong>Capital social :</strong> 10 000,00 €</li>
            <li><strong>Directeur :</strong> Ervis Ago</li>
            <li><strong>Email :</strong> ervis@greenecogenius.fr</li>
            <li><strong>Code EMTAK :</strong> 70221 — Conseil en gestion d'entreprise</li>
          </ul>

          <h2>2. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités
            d'accès et d'utilisation de la plateforme GreenEcoGenius, accessible à l'adresse
            greenecogenius-platform-dev-tool.vercel.app (ci-après « la Plateforme »).
          </p>
          <p>
            La Plateforme est une marketplace B2B d'économie circulaire permettant aux
            professionnels d'acheter et de vendre des matières recyclables, de tracer ces
            matières via la blockchain et de générer des rapports RSE assistés par intelligence
            artificielle.
          </p>

          <h2>3. Acceptation des conditions</h2>
          <p>
            L'inscription sur la Plateforme implique l'acceptation pleine et entière des
            présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser
            la Plateforme.
          </p>

          <h2>4. Inscription et compte utilisateur</h2>
          <p>
            L'accès à la Plateforme nécessite la création d'un compte entreprise. L'utilisateur
            s'engage à fournir des informations exactes et à jour lors de son inscription.
            Chaque compte est personnel et l'utilisateur est responsable de la confidentialité
            de ses identifiants.
          </p>

          <h2>5. Services proposés</h2>
          <p>La Plateforme propose les services suivants :</p>
          <ul>
            <li><strong>Le Comptoir Circulaire :</strong> marketplace B2B pour l'achat et la vente de matières recyclables entre professionnels</li>
            <li><strong>Traçabilité Blockchain :</strong> suivi de bout en bout des matières via la blockchain Polygon</li>
            <li><strong>IA Carbone & RSE :</strong> calcul d'empreinte carbone et génération automatique de rapports RSE</li>
          </ul>

          <h2>6. Responsabilité</h2>
          <p>
            GreenEcoGenius OÜ s'efforce d'assurer la disponibilité et le bon fonctionnement
            de la Plateforme. Toutefois, la société ne saurait être tenue responsable des
            interruptions temporaires, des erreurs techniques ou des pertes de données.
          </p>
          <p>
            GreenEcoGenius OÜ agit en tant qu'intermédiaire et ne saurait être tenue responsable
            de la qualité, la conformité ou la livraison des matières échangées entre utilisateurs.
          </p>

          <h2>7. Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus de la Plateforme (textes, images, logos, code source) sont
            la propriété exclusive de GreenEcoGenius OÜ et sont protégés par le droit de la
            propriété intellectuelle. Toute reproduction non autorisée est interdite.
          </p>

          <h2>8. Résiliation</h2>
          <p>
            L'utilisateur peut supprimer son compte à tout moment depuis ses paramètres.
            GreenEcoGenius OÜ se réserve le droit de suspendre ou supprimer un compte en cas
            de violation des présentes CGU.
          </p>

          <h2>9. Droit applicable</h2>
          <p>
            Les présentes CGU sont régies par le droit estonien. Tout litige sera soumis à la
            compétence exclusive des tribunaux de Tallinn, Estonie.
          </p>

          <h2>10. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU, contactez-nous à
            l'adresse <a href="mailto:ervis@greenecogenius.fr">ervis@greenecogenius.fr</a>.
          </p>
        </article>
      </div>
    </div>
  );
}

export default TermsOfServicePage;
