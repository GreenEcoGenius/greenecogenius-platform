export const LEGAL_ENTITIES = {
  europe: {
    name: 'GreenEcoGenius OÜ',
    shortName: 'GreenEcoGenius OÜ',
    jurisdiction: 'Estonia',
    jurisdictionFR: 'Estonie',
    registrationNumber: '16917315',
    registrationType: 'E-Business Register',
    legalForm: 'Private limited company (OÜ)',
    legalFormFR: 'Société à responsabilité limitée de droit estonien',
    address: 'Tornimäe tn 5, 10145 Tallinn, Harju maakond, Estonia',
    addressFR: 'Tornimäe tn 5, 10145 Tallinn, Harju maakond, Estonie',
    capital: '10 000,00 €',
    director: 'Ervis Ago',
    emtakCode: '70221',
    naceCode: '70.22',
    incorporationDate: '2024-02-08',
  },
  usa: {
    name: 'GreenEcoGenius, Inc.',
    shortName: 'GreenEcoGenius, Inc.',
    jurisdiction: 'Delaware, USA',
    jurisdictionFR: 'Delaware, États-Unis',
    registeredAgent: 'Legalinc Corporate Services Inc.',
    legalForm: 'C-Corporation (Delaware General Corporation Law)',
    legalFormFR: 'C-Corporation de droit du Delaware',
    address: '131 Continental Dr, Suite 305, Newark, DE 19713, USA',
    addressFR:
      '131 Continental Dr, Suite 305, Newark, Delaware 19713, États-Unis',
    authorizedShares: '10,000,000 Common Stock',
    parValue: '$0.00001',
    incorporator: 'Ervis Ago',
    incorporationDate: '2025-11-04',
  },
  common: {
    founder: 'Ervis Ago',
    email: 'contact@greenecogenius.tech',
    privacyEmail: 'privacy@greenecogenius.tech',
    phone: '+33 7 83 32 42 74',
    website: 'greenecogenius.tech',
    blockchain: {
      network: 'Polygon Mainnet',
      chainId: 137,
      contractAddress: '0x9EB83c7Acd57E228Cc3f9316eC4f27ce1fE94cF6',
      explorer: 'https://polygonscan.com',
    },
    taglineFR: "Bâtir Aujourd'hui Pour Préserver Demain.",
    taglineEN: 'Building Today to Preserve Tomorrow.',
  },
} as const;

export function getFooterText(lang: 'fr' | 'en'): string {
  const year = new Date().getFullYear();
  if (lang === 'fr') {
    return `© ${year} ${LEGAL_ENTITIES.europe.name} (${LEGAL_ENTITIES.europe.jurisdictionFR}) · ${LEGAL_ENTITIES.usa.name} (${LEGAL_ENTITIES.usa.jurisdictionFR})`;
  }
  return `© ${year} ${LEGAL_ENTITIES.usa.name} (${LEGAL_ENTITIES.usa.jurisdiction}) · ${LEGAL_ENTITIES.europe.name} (${LEGAL_ENTITIES.europe.jurisdiction})`;
}

export function getEntityLine(lang: 'fr' | 'en'): string {
  if (lang === 'fr') {
    return `${LEGAL_ENTITIES.europe.name} (${LEGAL_ENTITIES.europe.jurisdictionFR}) · ${LEGAL_ENTITIES.usa.name} (${LEGAL_ENTITIES.usa.jurisdictionFR})`;
  }
  return `${LEGAL_ENTITIES.usa.name} (${LEGAL_ENTITIES.usa.jurisdiction}) · ${LEGAL_ENTITIES.europe.name} (${LEGAL_ENTITIES.europe.jurisdiction})`;
}

export function getPDFFooterEntity(lang: 'fr' | 'en'): string {
  return `${getEntityLine(lang)} — ${LEGAL_ENTITIES.common.website}`;
}

export function getPDFLegalMentions(lang: 'fr' | 'en'): string {
  if (lang === 'fr') {
    return [
      `Éditeur Europe : ${LEGAL_ENTITIES.europe.name} — Registre estonien ${LEGAL_ENTITIES.europe.registrationNumber}`,
      LEGAL_ENTITIES.europe.addressFR,
      '',
      `Éditeur USA : ${LEGAL_ENTITIES.usa.name} — C-Corporation Delaware`,
      LEGAL_ENTITIES.usa.addressFR,
      '',
      `Fondateur et Directeur : ${LEGAL_ENTITIES.common.founder}`,
      `Contact : ${LEGAL_ENTITIES.common.email} | ${LEGAL_ENTITIES.common.phone}`,
      '',
      `Blockchain : ${LEGAL_ENTITIES.common.blockchain.network} — Smart Contract ${LEGAL_ENTITIES.common.blockchain.contractAddress}`,
    ].join('\n');
  }
  return [
    `US Publisher: ${LEGAL_ENTITIES.usa.name} — Delaware C-Corporation`,
    LEGAL_ENTITIES.usa.address,
    '',
    `EU Publisher: ${LEGAL_ENTITIES.europe.name} — Estonian Registry ${LEGAL_ENTITIES.europe.registrationNumber}`,
    LEGAL_ENTITIES.europe.address,
    '',
    `Founder & Director: ${LEGAL_ENTITIES.common.founder}`,
    `Contact: ${LEGAL_ENTITIES.common.email} | ${LEGAL_ENTITIES.common.phone}`,
    '',
    `Blockchain: ${LEGAL_ENTITIES.common.blockchain.network} — Smart Contract ${LEGAL_ENTITIES.common.blockchain.contractAddress}`,
  ].join('\n');
}

export function getCertificateLegalLine(lang: 'fr' | 'en'): string {
  return getEntityLine(lang);
}
