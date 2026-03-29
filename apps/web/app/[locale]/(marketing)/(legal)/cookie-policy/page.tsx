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

      <div className="container mx-auto max-w-3xl py-8">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-sm">
            Dernière mise à jour : 29 mars 2026
          </p>

          <h2>1. Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez
            un site web. Les cookies permettent au site de mémoriser vos actions et préférences
            (connexion, langue, taille de police, etc.) pendant une durée déterminée.
          </p>

          <h2>2. Cookies utilisés sur la Plateforme</h2>

          <h3>Cookies essentiels (obligatoires)</h3>
          <p>Ces cookies sont nécessaires au fonctionnement de la Plateforme :</p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>sb-*-auth-token</code></td>
                <td>Session d'authentification Supabase</td>
                <td>1 heure (renouvelable)</td>
              </tr>
              <tr>
                <td><code>theme</code></td>
                <td>Préférence de thème (clair/sombre)</td>
                <td>1 an</td>
              </tr>
              <tr>
                <td><code>NEXT_LOCALE</code></td>
                <td>Préférence de langue</td>
                <td>1 an</td>
              </tr>
            </tbody>
          </table>

          <h3>Cookies analytiques (optionnels)</h3>
          <p>
            Ces cookies nous aident à comprendre comment les visiteurs utilisent la Plateforme.
            Ils sont activés uniquement avec votre consentement.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>_va</code></td>
                <td>Vercel Analytics — mesure de performance</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Gestion de vos préférences</h2>
          <p>
            Lors de votre première visite, un bandeau de consentement vous permet d'accepter
            ou de refuser les cookies non essentiels. Vous pouvez modifier vos préférences à
            tout moment.
          </p>
          <p>
            Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les
            cookies. Voici les liens vers les instructions des principaux navigateurs :
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h2>4. Conséquences du refus des cookies</h2>
          <p>
            Le refus des cookies essentiels peut empêcher l'utilisation de certaines
            fonctionnalités de la Plateforme (connexion, préférences). Le refus des cookies
            analytiques n'affecte pas l'utilisation de la Plateforme.
          </p>

          <h2>5. Contact</h2>
          <p>
            Pour toute question concernant notre utilisation des cookies, contactez-nous à{' '}
            <a href="mailto:ervis@greenecogenius.fr">ervis@greenecogenius.fr</a>.
          </p>

          <p>
            <strong>GreenEcoGenius OÜ</strong><br />
            Tornimäe tn 5, 10145 Tallinn, Estonie<br />
            Registre du commerce : 16917315
          </p>
        </article>
      </div>
    </div>
  );
}

export default CookiePolicyPage;
