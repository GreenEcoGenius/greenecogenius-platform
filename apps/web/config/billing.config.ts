import { BillingProviderSchema, createBillingSchema } from '@kit/billing';

const provider = BillingProviderSchema.parse(
  process.env.NEXT_PUBLIC_BILLING_PROVIDER,
);

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: '5 annonces, accès marketplace basique',
      currency: 'EUR',
      badge: 'Essentiel',
      plans: [
        {
          name: 'Starter Mensuel',
          id: 'starter-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1TGOl1HzZIeB0U46D0mCsd3x',
              name: 'Starter',
              cost: 29,
              type: 'flat' as const,
            },
          ],
        },
        {
          name: 'Starter Annuel',
          id: 'starter-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1TGOl1HzZIeB0U46gPUhWONZ',
              name: 'Starter',
              cost: 290,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: [
        '5 annonces actives',
        'Accès marketplace',
        'Tableau de bord basique',
        'Support email',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Populaire',
      highlighted: true,
      description: 'Annonces illimitées, analytics carbone',
      currency: 'EUR',
      plans: [
        {
          name: 'Pro Mensuel',
          id: 'pro-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1TGOl2HzZIeB0U46YAiJSsS6',
              name: 'Pro',
              cost: 79,
              type: 'flat' as const,
            },
          ],
        },
        {
          name: 'Pro Annuel',
          id: 'pro-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1TGOl2HzZIeB0U46Q7mXDRn0',
              name: 'Pro',
              cost: 790,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: [
        'Annonces illimitées',
        'Accès marketplace',
        'Analytics carbone',
        'Tableau de bord avancé',
        'Support prioritaire',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Tout inclus + API + support dédié',
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
              cost: 199,
              type: 'flat' as const,
            },
          ],
        },
        {
          name: 'Enterprise Annuel',
          id: 'enterprise-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_1TGOl3HzZIeB0U46rSbnUxhk',
              name: 'Enterprise',
              cost: 1990,
              type: 'flat' as const,
            },
          ],
        },
      ],
      features: [
        'Annonces illimitées',
        'Accès marketplace',
        'Analytics carbone avancés',
        'Accès API',
        'Support dédié',
        'Rapports RSE',
        'Traçabilité blockchain',
      ],
    },
  ],
});
