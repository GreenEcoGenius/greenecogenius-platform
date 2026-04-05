export type QuestionType = 'scale' | 'boolean' | 'text';

export interface RSEOption {
  value: number;
  label_fr: string;
  label_en: string;
}

export interface RSEQuestion {
  id: string;
  pillar_id: string;
  question_fr: string;
  question_en: string;
  help_fr: string;
  help_en: string;
  type: QuestionType;
  options?: RSEOption[];
  max_score: number;
  norms_impacted: string[];
  labels_impacted: string[];
  auto_from?: string;
}

export interface RSEPillar {
  id: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  icon: string;
  color: string;
  weight: number;
  questions: RSEQuestion[];
}

export const RSE_PILLARS: RSEPillar[] = [
  {
    id: 'governance',
    name_fr: 'Gouvernance',
    name_en: 'Governance',
    description_fr: 'Structure decisionnelle, transparence, ethique et conduite des affaires',
    description_en: 'Decision-making structure, transparency, ethics and business conduct',
    icon: 'Building2',
    color: 'blue',
    weight: 20,
    questions: [
      {
        id: 'gov_1', pillar_id: 'governance',
        question_fr: 'Votre entreprise a-t-elle une structure de gouvernance formalisee ?',
        question_en: 'Does your company have a formalized governance structure?',
        help_fr: "Conseil d'administration, comite de direction, organigramme documente",
        help_en: 'Board of directors, management committee, documented organization chart',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Aucune structure formelle', label_en: 'No formal structure' },
          { value: 1, label_fr: 'Structure basique (organigramme)', label_en: 'Basic structure (org chart)' },
          { value: 2, label_fr: 'Structure documentee avec roles definis', label_en: 'Documented structure with defined roles' },
          { value: 3, label_fr: 'Gouvernance complete avec comites', label_en: 'Full governance with committees' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_g1'], labels_impacted: ['b_corp', 'lucie'],
      },
      {
        id: 'gov_2', pillar_id: 'governance',
        question_fr: 'Avez-vous un code de conduite ou une charte ethique ?',
        question_en: 'Do you have a code of conduct or ethics charter?',
        help_fr: 'Document ecrit, diffuse aux employes, accessible publiquement',
        help_en: 'Written document, shared with employees, publicly accessible',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'En cours de redaction', label_en: 'Being drafted' },
          { value: 2, label_fr: 'Redige mais pas diffuse', label_en: 'Written but not shared' },
          { value: 3, label_fr: 'Redige, diffuse et applique', label_en: 'Written, shared and enforced' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_g1'], labels_impacted: ['b_corp', 'lucie'],
      },
      {
        id: 'gov_3', pillar_id: 'governance',
        question_fr: 'Avez-vous une politique anti-corruption formalisee ?',
        question_en: 'Do you have a formalized anti-corruption policy?',
        help_fr: "Politique ecrite, formation des employes, procedure d'alerte",
        help_en: 'Written policy, employee training, whistleblowing procedure',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Politique basique', label_en: 'Basic policy' },
          { value: 2, label_fr: 'Politique + formation', label_en: 'Policy + training' },
          { value: 3, label_fr: 'Politique + formation + alerte + audit', label_en: 'Policy + training + whistleblowing + audit' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'loi_sapin2'], labels_impacted: ['b_corp', 'ecovadis'],
      },
      {
        id: 'gov_4', pillar_id: 'governance',
        question_fr: 'Integrez-vous les parties prenantes dans vos decisions strategiques ?',
        question_en: 'Do you involve stakeholders in your strategic decisions?',
        help_fr: 'Employes, clients, fournisseurs, communautes locales consultes',
        help_en: 'Employees, clients, suppliers, local communities consulted',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Jamais', label_en: 'Never' },
          { value: 1, label_fr: 'Rarement (informel)', label_en: 'Rarely (informal)' },
          { value: 2, label_fr: 'Regulierement (enquetes, reunions)', label_en: 'Regularly (surveys, meetings)' },
          { value: 3, label_fr: 'Systematiquement (processus formalise)', label_en: 'Systematically (formalized process)' },
        ],
        max_score: 3, norms_impacted: ['iso_26000'], labels_impacted: ['b_corp', 'lucie'],
      },
      {
        id: 'gov_5', pillar_id: 'governance',
        question_fr: 'Avez-vous designe un responsable RSE ou developpement durable ?',
        question_en: 'Have you appointed a CSR or sustainability officer?',
        help_fr: "Personne dediee ou referent identifie au sein de l'organisation",
        help_en: 'Dedicated person or identified point of contact within the organization',
        type: 'boolean',
        max_score: 2, norms_impacted: ['iso_26000', 'csrd'], labels_impacted: ['b_corp', 'lucie', 'greentech'],
      },
    ],
  },
  {
    id: 'social',
    name_fr: 'Social & Droits humains',
    name_en: 'Social & Human Rights',
    description_fr: 'Conditions de travail, diversite, formation, dialogue social, droits fondamentaux',
    description_en: 'Working conditions, diversity, training, social dialogue, fundamental rights',
    icon: 'Users',
    color: 'purple',
    weight: 25,
    questions: [
      {
        id: 'soc_1', pillar_id: 'social',
        question_fr: 'Quel est votre effectif total ?',
        question_en: 'What is your total headcount?',
        help_fr: 'CDI, CDD, alternants, stagiaires',
        help_en: 'Permanent, fixed-term, apprentices, interns',
        type: 'text',
        max_score: 0, norms_impacted: ['iso_26000', 'csrd_s1'], labels_impacted: [],
        auto_from: 'external_activities.social.employee_count',
      },
      {
        id: 'soc_2', pillar_id: 'social',
        question_fr: 'Proposez-vous des formations regulieres a vos employes ?',
        question_en: 'Do you offer regular training to your employees?',
        help_fr: "Nombre d'heures de formation par an et par employe",
        help_en: 'Number of training hours per year per employee',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Aucune formation', label_en: 'No training' },
          { value: 1, label_fr: '< 10h/an/employe', label_en: '< 10h/year/employee' },
          { value: 2, label_fr: '10-20h/an/employe', label_en: '10-20h/year/employee' },
          { value: 3, label_fr: '> 20h/an/employe', label_en: '> 20h/year/employee' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_s1'], labels_impacted: ['b_corp', 'lucie'],
      },
      {
        id: 'soc_3', pillar_id: 'social',
        question_fr: 'Avez-vous une politique de diversite et inclusion ?',
        question_en: 'Do you have a diversity and inclusion policy?',
        help_fr: 'Egalite femmes-hommes, handicap, age, origine',
        help_en: 'Gender equality, disability, age, origin',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Engagement verbal', label_en: 'Verbal commitment' },
          { value: 2, label_fr: 'Politique ecrite', label_en: 'Written policy' },
          { value: 3, label_fr: 'Politique + indicateurs + actions', label_en: 'Policy + KPIs + actions' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_s1'], labels_impacted: ['b_corp', 'lucie', 'ecovadis'],
      },
      {
        id: 'soc_4', pillar_id: 'social',
        question_fr: 'Mesurez-vous le bien-etre et la satisfaction de vos employes ?',
        question_en: 'Do you measure employee well-being and satisfaction?',
        help_fr: 'Enquetes internes, entretiens reguliers, indicateurs QVT',
        help_en: 'Internal surveys, regular interviews, QWL indicators',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Informel', label_en: 'Informal' },
          { value: 2, label_fr: 'Enquete annuelle', label_en: 'Annual survey' },
          { value: 3, label_fr: "Suivi continu + plan d'action", label_en: 'Continuous monitoring + action plan' },
        ],
        max_score: 3, norms_impacted: ['iso_26000'], labels_impacted: ['b_corp', 'lucie'],
      },
      {
        id: 'soc_5', pillar_id: 'social',
        question_fr: 'Avez-vous des mecanismes de dialogue social ?',
        question_en: 'Do you have social dialogue mechanisms?',
        help_fr: "CSE, representants du personnel, reunions d'equipe regulieres",
        help_en: 'Works council, staff representatives, regular team meetings',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Aucun', label_en: 'None' },
          { value: 1, label_fr: "Reunions d'equipe informelles", label_en: 'Informal team meetings' },
          { value: 2, label_fr: 'Instances formelles (CSE ou equivalent)', label_en: 'Formal bodies (works council or equivalent)' },
          { value: 3, label_fr: 'Dialogue structure + accords collectifs', label_en: 'Structured dialogue + collective agreements' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_s1'], labels_impacted: ['b_corp', 'lucie'],
      },
      {
        id: 'soc_6', pillar_id: 'social',
        question_fr: "Garantissez-vous l'egalite salariale femmes-hommes ?",
        question_en: 'Do you guarantee gender pay equality?',
        help_fr: 'Index Egapro, audit salarial, mesures correctives',
        help_en: 'Gender pay index, salary audit, corrective measures',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non mesure', label_en: 'Not measured' },
          { value: 1, label_fr: 'Mesure mais ecarts constates', label_en: 'Measured but gaps identified' },
          { value: 2, label_fr: 'Mesure + plan de correction', label_en: 'Measured + corrective plan' },
          { value: 3, label_fr: 'Egalite atteinte et verifiee', label_en: 'Equality achieved and verified' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_s1'], labels_impacted: ['b_corp', 'lucie'],
      },
    ],
  },
  {
    id: 'environment',
    name_fr: 'Environnement',
    name_en: 'Environment',
    description_fr: 'Emissions carbone, gestion des dechets, economie circulaire, biodiversite, ressources',
    description_en: 'Carbon emissions, waste management, circular economy, biodiversity, resources',
    icon: 'Leaf',
    color: 'emerald',
    weight: 25,
    questions: [
      {
        id: 'env_1', pillar_id: 'environment',
        question_fr: 'Avez-vous realise votre bilan carbone ?',
        question_en: 'Have you completed your carbon footprint assessment?',
        help_fr: 'Scopes 1, 2 et/ou 3 selon la methodologie GHG Protocol',
        help_en: 'Scopes 1, 2 and/or 3 according to GHG Protocol methodology',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Scope 1 et 2 realises', label_en: 'Scope 1 and 2 completed' },
          { value: 2, label_fr: 'Scope 1, 2 et 3 realises', label_en: 'Scope 1, 2 and 3 completed' },
          { value: 3, label_fr: 'Bilan complet + plan de reduction', label_en: 'Full assessment + reduction plan' },
        ],
        max_score: 3, norms_impacted: ['ghg_protocol', 'iso_14064', 'csrd_e1'], labels_impacted: ['b_corp', 'label_bas_carbone', 'sbti', 'cdp'],
        auto_from: 'carbon_impact',
      },
      {
        id: 'env_2', pillar_id: 'environment',
        question_fr: 'Quelle part de votre energie provient de sources renouvelables ?',
        question_en: 'What share of your energy comes from renewable sources?',
        help_fr: 'Electricite verte, panneaux solaires, geothermie, etc.',
        help_en: 'Green electricity, solar panels, geothermal, etc.',
        type: 'scale',
        options: [
          { value: 0, label_fr: '0%', label_en: '0%' },
          { value: 1, label_fr: '1-25%', label_en: '1-25%' },
          { value: 2, label_fr: '25-75%', label_en: '25-75%' },
          { value: 3, label_fr: '> 75%', label_en: '> 75%' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_e1'], labels_impacted: ['b_corp', 'greentech'],
      },
      {
        id: 'env_3', pillar_id: 'environment',
        question_fr: 'Triez-vous et valorisez-vous vos dechets ?',
        question_en: 'Do you sort and recycle your waste?',
        help_fr: 'Tri selectif, recyclage, valorisation matiere ou energetique',
        help_en: 'Selective sorting, recycling, material or energy recovery',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Tri basique (papier, plastique)', label_en: 'Basic sorting (paper, plastic)' },
          { value: 2, label_fr: 'Tri 5 flux + suivi volumes', label_en: '5-stream sorting + volume tracking' },
          { value: 3, label_fr: 'Tri 9 flux + valorisation + tracabilite', label_en: '9-stream sorting + recovery + traceability' },
        ],
        max_score: 3, norms_impacted: ['loi_agec', 'iso_26000', 'csrd_e5'], labels_impacted: ['b_corp'],
        auto_from: 'comptoir',
      },
      {
        id: 'env_4', pillar_id: 'environment',
        question_fr: 'Avez-vous defini un objectif de reduction de vos emissions ?',
        question_en: 'Have you set an emissions reduction target?',
        help_fr: 'Objectif chiffre, aligne SBTi, trajectoire Net Zero',
        help_en: 'Quantified target, SBTi-aligned, Net Zero trajectory',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Objectif informel', label_en: 'Informal target' },
          { value: 2, label_fr: 'Objectif chiffre avec plan', label_en: 'Quantified target with plan' },
          { value: 3, label_fr: 'Objectif aligne SBTi 1.5C', label_en: 'SBTi 1.5C aligned target' },
        ],
        max_score: 3, norms_impacted: ['sbti', 'csrd_e1'], labels_impacted: ['sbti', 'label_bas_carbone', 'cdp'],
      },
      {
        id: 'env_5', pillar_id: 'environment',
        question_fr: "Mesurez-vous votre consommation d'eau ?",
        question_en: 'Do you measure your water consumption?',
        help_fr: 'Suivi annuel, objectifs de reduction, recyclage des eaux',
        help_en: 'Annual tracking, reduction targets, water recycling',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Suivi basique', label_en: 'Basic tracking' },
          { value: 2, label_fr: 'Suivi + objectif reduction', label_en: 'Tracking + reduction target' },
          { value: 3, label_fr: 'Suivi + reduction + recyclage', label_en: 'Tracking + reduction + recycling' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_e3'], labels_impacted: ['b_corp'],
      },
      {
        id: 'env_6', pillar_id: 'environment',
        question_fr: "Integrez-vous des criteres d'economie circulaire dans votre activite ?",
        question_en: 'Do you integrate circular economy criteria in your business?',
        help_fr: 'Reutilisation, reparation, recyclage, approvisionnement en matieres recyclees',
        help_en: 'Reuse, repair, recycling, sourcing recycled materials',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Quelques initiatives', label_en: 'Some initiatives' },
          { value: 2, label_fr: 'Strategie circulaire definie', label_en: 'Defined circular strategy' },
          { value: 3, label_fr: "Modele circulaire integre + mesure d'impact", label_en: 'Integrated circular model + impact measurement' },
        ],
        max_score: 3, norms_impacted: ['bs_8001', 'iso_59020', 'csrd_e5'], labels_impacted: ['b_corp'],
        auto_from: 'comptoir',
      },
    ],
  },
  {
    id: 'loyalty',
    name_fr: 'Loyaute des pratiques',
    name_en: 'Fair Operating Practices',
    description_fr: 'Achats responsables, relations fournisseurs, concurrence loyale, respect des droits',
    description_en: 'Responsible procurement, supplier relations, fair competition, rights compliance',
    icon: 'Handshake',
    color: 'amber',
    weight: 15,
    questions: [
      {
        id: 'loy_1', pillar_id: 'loyalty',
        question_fr: "Avez-vous une politique d'achats responsables ?",
        question_en: 'Do you have a responsible procurement policy?',
        help_fr: "Criteres ESG dans les appels d'offres, audit fournisseurs",
        help_en: 'ESG criteria in tenders, supplier audits',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Preferences informelles', label_en: 'Informal preferences' },
          { value: 2, label_fr: 'Criteres ESG dans les achats', label_en: 'ESG criteria in procurement' },
          { value: 3, label_fr: 'Politique formalisee + audit fournisseurs', label_en: 'Formalized policy + supplier audits' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csddd'], labels_impacted: ['b_corp', 'ecovadis'],
        auto_from: 'external_activities.procurement',
      },
      {
        id: 'loy_2', pillar_id: 'loyalty',
        question_fr: 'Quelle part de vos achats est locale (< 200 km) ?',
        question_en: 'What share of your purchases is local (< 200 km)?',
        help_fr: 'Fournisseurs locaux, circuits courts, economie locale',
        help_en: 'Local suppliers, short circuits, local economy',
        type: 'scale',
        options: [
          { value: 0, label_fr: '< 10%', label_en: '< 10%' },
          { value: 1, label_fr: '10-30%', label_en: '10-30%' },
          { value: 2, label_fr: '30-60%', label_en: '30-60%' },
          { value: 3, label_fr: '> 60%', label_en: '> 60%' },
        ],
        max_score: 3, norms_impacted: ['iso_26000'], labels_impacted: ['b_corp'],
      },
      {
        id: 'loy_3', pillar_id: 'loyalty',
        question_fr: 'Verifiez-vous les pratiques RSE de vos fournisseurs ?',
        question_en: "Do you verify your suppliers' CSR practices?",
        help_fr: 'Questionnaire RSE, audits, certifications exigees',
        help_en: 'CSR questionnaire, audits, required certifications',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Questionnaire basique', label_en: 'Basic questionnaire' },
          { value: 2, label_fr: 'Evaluation reguliere', label_en: 'Regular assessment' },
          { value: 3, label_fr: "Audit + plan d'amelioration conjoint", label_en: 'Audit + joint improvement plan' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csddd', 'plan_vigilance'], labels_impacted: ['b_corp', 'ecovadis'],
      },
      {
        id: 'loy_4', pillar_id: 'loyalty',
        question_fr: 'Respectez-vous des delais de paiement fournisseurs raisonnables ?',
        question_en: 'Do you respect reasonable supplier payment terms?',
        help_fr: '< 30 jours, pas de retard systematique',
        help_en: '< 30 days, no systematic delays',
        type: 'scale',
        options: [
          { value: 0, label_fr: '> 60 jours regulierement', label_en: '> 60 days regularly' },
          { value: 1, label_fr: '45-60 jours', label_en: '45-60 days' },
          { value: 2, label_fr: '30-45 jours', label_en: '30-45 days' },
          { value: 3, label_fr: '< 30 jours systematiquement', label_en: '< 30 days systematically' },
        ],
        max_score: 3, norms_impacted: ['iso_26000'], labels_impacted: ['b_corp'],
      },
    ],
  },
  {
    id: 'community',
    name_fr: 'Communautes & Territoires',
    name_en: 'Communities & Territories',
    description_fr: 'Engagement local, mecenat, emploi local, impact territorial, parties prenantes',
    description_en: 'Local engagement, sponsorship, local employment, territorial impact, stakeholders',
    icon: 'Heart',
    color: 'rose',
    weight: 15,
    questions: [
      {
        id: 'com_1', pillar_id: 'community',
        question_fr: 'Soutenez-vous des initiatives locales ou associatives ?',
        question_en: 'Do you support local or nonprofit initiatives?',
        help_fr: 'Mecenat financier, mecenat de competences, partenariats associatifs',
        help_en: 'Financial sponsorship, skills-based volunteering, nonprofit partnerships',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Ponctuellement', label_en: 'Occasionally' },
          { value: 2, label_fr: 'Regulierement (budget dedie)', label_en: 'Regularly (dedicated budget)' },
          { value: 3, label_fr: "Strategie structuree + mesure d'impact", label_en: 'Structured strategy + impact measurement' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_s3'], labels_impacted: ['b_corp', 'lucie'],
        auto_from: 'external_activities.community',
      },
      {
        id: 'com_2', pillar_id: 'community',
        question_fr: "Favorisez-vous l'emploi local ?",
        question_en: 'Do you promote local employment?',
        help_fr: 'Recrutement local, stages, alternances, insertion',
        help_en: 'Local recruitment, internships, apprenticeships, inclusion',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Preference informelle', label_en: 'Informal preference' },
          { value: 2, label_fr: 'Actions ciblees (stages, alternance)', label_en: 'Targeted actions (internships, apprenticeships)' },
          { value: 3, label_fr: 'Politique formalisee + partenariats', label_en: 'Formalized policy + partnerships' },
        ],
        max_score: 3, norms_impacted: ['iso_26000'], labels_impacted: ['b_corp', 'lucie'],
      },
      {
        id: 'com_3', pillar_id: 'community',
        question_fr: 'Proposez-vous du benevolat ou du mecenat de competences ?',
        question_en: 'Do you offer volunteering or skills-based sponsorship?',
        help_fr: 'Jours de benevolat offerts aux employes, missions pro bono',
        help_en: 'Volunteer days offered to employees, pro bono missions',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Initiatives individuelles', label_en: 'Individual initiatives' },
          { value: 2, label_fr: 'Programme structure (1-2 jours/an)', label_en: 'Structured program (1-2 days/year)' },
          { value: 3, label_fr: 'Programme genereux (> 3 jours/an) + suivi', label_en: 'Generous program (> 3 days/year) + tracking' },
        ],
        max_score: 3, norms_impacted: ['iso_26000'], labels_impacted: ['b_corp'],
      },
      {
        id: 'com_4', pillar_id: 'community',
        question_fr: 'Mesurez-vous votre impact sur le territoire ?',
        question_en: 'Do you measure your impact on the local territory?',
        help_fr: 'Emplois crees, taxes locales, retombees economiques',
        help_en: 'Jobs created, local taxes, economic benefits',
        type: 'scale',
        options: [
          { value: 0, label_fr: 'Non', label_en: 'No' },
          { value: 1, label_fr: 'Connaissance basique', label_en: 'Basic awareness' },
          { value: 2, label_fr: 'Indicateurs suivis', label_en: 'Tracked indicators' },
          { value: 3, label_fr: "Rapport d'impact territorial publie", label_en: 'Published territorial impact report' },
        ],
        max_score: 3, norms_impacted: ['iso_26000', 'csrd_s3'], labels_impacted: ['b_corp', 'lucie'],
      },
    ],
  },
];

export const TOTAL_SCORED_QUESTIONS = RSE_PILLARS.flatMap((p) => p.questions).filter((q) => q.max_score > 0).length;

export const TOTAL_QUESTIONS = RSE_PILLARS.flatMap((p) => p.questions).length;
