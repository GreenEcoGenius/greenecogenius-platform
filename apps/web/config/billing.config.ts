import { BillingProviderSchema, createBillingSchema } from '@kit/billing';

const provider = BillingProviderSchema.parse(
  process.env.NEXT_PUBLIC_BILLING_PROVIDER,
);

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'essentiel',
      name: 'Essentiel',
      description: 'Pour les TPE/PME (jusqu\'a 50 employes)',
      currency: 'EUR',
      badge: 'Essentiel',
      plans: [
        {
          name: 'Essentiel Mensuel',
          id: 'essentiel-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1TGOl1HzZIeB0U46D0mCsd3x',
              name: 'Essentiel',
              cost: 149,
              type: 'flat' as const,
            },
          ],
        },
        {
          name: 'Essentiel Annuel',
          id: 'essentiel-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1TGOl1HzZIeB0U46gPUhWONZ',
              name: 'Essentiel',
              cost: 1430,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: [
        'Bilan carbone Scope 1 & 2 (ADEME)',
        'Rapport PDF GHG Protocol',
        'Comptoir Circulaire (annonces)',
        '50 lots blockchain / mois',
        'Certificats tracabilite PDF',
        'Diagnostic RSE basique',
        'Conformite 42 normes',
        'Genius IA (10 msg/jour)',
        'Support email',
      ],
    },
    {
      id: 'avance',
      name: 'Avance',
      badge: 'Le plus populaire',
      highlighted: true,
      description: 'Pour les ETI (50 a 500 employes)',
      currency: 'EUR',
      plans: [
        {
          name: 'Avance Mensuel',
          id: 'avance-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1TGOl2HzZIeB0U46YAiJSsS6',
              name: 'Avance',
              cost: 449,
              type: 'flat' as const,
            },
          ],
        },
        {
          name: 'Avance Annuel',
          id: 'avance-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1TGOl2HzZIeB0U46Q7mXDRn0',
              name: 'Avance',
              cost: 4310,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: [
        'Tout du plan Essentiel',
        'Bilan carbone Scope 1, 2 & 3',
        'Rapport ESG / ESRS',
        'Lots blockchain illimites',
        'Diagnostic RSE complet + plan d\'action',
        'Eligibilite labels (B Corp, Lucie...)',
        'Pre-audit conformite (6 piliers)',
        'Veille reglementaire',
        'Genius IA avance (100 msg/jour)',
        'Support prioritaire chat',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Grands groupes (500+ employes)',
      currency: 'EUR',
      plans: [
        {
          name: 'Enterprise Mensuel',
          id: 'enterprise-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1TGOl2HzZIeB0U46bOoTFGmA',
              name: 'Enterprise',
              cost: 0,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: [
        'Tout du plan Avance',
        'Genius IA illimite (Opus)',
        'Rapports personnalises (logo, charte)',
        'Acces API',
        'Multi-utilisateurs + roles',
        'Onboarding + formation',
        'Account manager dedie',
        'SLA garanti',
        'Support chat + visio',
      ],
    },
  ],
});
