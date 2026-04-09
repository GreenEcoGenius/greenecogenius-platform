/**
 * GHG Protocol emission factors — Base Carbone ADEME v23
 *
 * Scope 1: Direct emissions (combustion, fleet, refrigerants)
 * Scope 2: Indirect energy (electricity, district heating)
 * Scope 3: Value chain (purchases, transport, waste, travel, commuting, digital)
 */

export interface EmissionFactor {
  factor: number;
  unit: string;
  source: string;
  help_fr: string;
  help_en: string;
}

export const SCOPE1_FACTORS: Record<string, EmissionFactor> = {
  natural_gas:       { factor: 0.227,  unit: 'kWh',    source: 'Base Carbone ADEME v23', help_fr: 'Trouvez cette valeur sur vos factures de gaz (kWh PCI)', help_en: 'Find this on your gas bills (kWh LCV)' },
  heating_oil:       { factor: 3.25,   unit: 'litres', source: 'Base Carbone ADEME v23', help_fr: 'Litres de fioul domestique pour le chauffage', help_en: 'Liters of heating oil consumed' },
  propane:           { factor: 1.55,   unit: 'litres', source: 'Base Carbone ADEME v23', help_fr: 'Litres de propane ou GPL', help_en: 'Liters of propane or LPG' },
  fleet_diesel:      { factor: 3.16,   unit: 'litres', source: 'Base Carbone ADEME v23', help_fr: 'Litres de diesel (vehicules)', help_en: 'Liters of diesel (vehicles)' },
  fleet_gasoline:    { factor: 2.80,   unit: 'litres', source: 'Base Carbone ADEME v23', help_fr: "Litres d'essence (vehicules)", help_en: 'Liters of gasoline (vehicles)' },
  fleet_lpg:         { factor: 1.86,   unit: 'litres', source: 'Base Carbone ADEME v23', help_fr: 'Litres de GPL (vehicules)', help_en: 'Liters of LPG (vehicles)' },
  fleet_electric:    { factor: 0,      unit: 'kWh',    source: 'GHG Protocol', help_fr: 'Vehicules electriques : 0 emission directe (Scope 2)', help_en: 'Electric vehicles: 0 direct emissions (Scope 2)' },
  refrigerant_r410a: { factor: 2088,   unit: 'kg',     source: 'GIEC AR5 / ADEME', help_fr: 'Kg de R-410A recharges (factures maintenance clim)', help_en: 'Kg of R-410A recharged (AC maintenance)' },
  refrigerant_r32:   { factor: 675,    unit: 'kg',     source: 'GIEC AR5 / ADEME', help_fr: 'Kg de R-32 recharges', help_en: 'Kg of R-32 recharged' },
  refrigerant_r134a: { factor: 1430,   unit: 'kg',     source: 'GIEC AR5 / ADEME', help_fr: 'Kg de R-134a recharges', help_en: 'Kg of R-134a recharged' },
};

export const ELECTRICITY_FACTORS: Record<string, { factor: number; source: string }> = {
  FR:     { factor: 0.052, source: 'ADEME 2023 — mix electrique francais' },
  DE:     { factor: 0.385, source: 'UBA 2023 — mix allemand' },
  UK:     { factor: 0.207, source: 'DEFRA 2023' },
  ES:     { factor: 0.210, source: 'MITECO 2023' },
  IT:     { factor: 0.256, source: 'ISPRA 2023' },
  US:     { factor: 0.417, source: 'EPA eGRID 2023' },
  EU_AVG: { factor: 0.230, source: 'AIE 2023 — moyenne UE-27' },
};

export const SCOPE2_FACTORS = {
  electricity_renewable: { factor: 0.010, source: 'ADEME — eolien/solaire lifecycle' },
  district_heating_FR:   { factor: 0.110, source: 'ADEME — reseau de chaleur France' },
  district_heating_EU:   { factor: 0.150, source: 'Estimation moyenne UE' },
};

export const SCOPE3_PURCHASE_FACTORS: Record<string, { factor: number; label_fr: string; label_en: string }> = {
  manufacturing:   { factor: 0.43, label_fr: 'Achats industriels / matieres premieres', label_en: 'Manufacturing / raw materials' },
  services:        { factor: 0.12, label_fr: 'Services (conseil, sous-traitance)', label_en: 'Services (consulting, outsourcing)' },
  food:            { factor: 0.55, label_fr: 'Alimentaire (restauration, cantine)', label_en: 'Food (catering, cafeteria)' },
  it_equipment:    { factor: 0.35, label_fr: 'Equipement IT (ordinateurs, serveurs)', label_en: 'IT equipment (computers, servers)' },
  office_supplies: { factor: 0.20, label_fr: 'Fournitures bureau', label_en: 'Office supplies' },
  textiles:        { factor: 0.38, label_fr: 'Textiles / EPI', label_en: 'Textiles / PPE' },
  construction:    { factor: 0.48, label_fr: 'Construction / BTP', label_en: 'Construction' },
  chemicals:       { factor: 0.50, label_fr: 'Chimie', label_en: 'Chemicals' },
};

export const SCOPE3_TRANSPORT_FACTORS: Record<string, { factor: number; label_fr: string; label_en: string }> = {
  truck: { factor: 0.117, label_fr: 'Camion', label_en: 'Truck' },
  train: { factor: 0.022, label_fr: 'Train fret', label_en: 'Freight train' },
  ship:  { factor: 0.016, label_fr: 'Bateau', label_en: 'Ship' },
  air:   { factor: 1.060, label_fr: 'Avion fret', label_en: 'Air freight' },
};

export const SCOPE3_WASTE_FACTORS: Record<string, { factor: number; label_fr: string; label_en: string }> = {
  landfill:      { factor: 0.500, label_fr: 'Decharge', label_en: 'Landfill' },
  incineration:  { factor: 0.040, label_fr: 'Incineration', label_en: 'Incineration' },
  recycling:     { factor: 0.021, label_fr: 'Recyclage', label_en: 'Recycling' },
  composting:    { factor: 0.010, label_fr: 'Compostage', label_en: 'Composting' },
};

export const SCOPE3_TRAVEL_FACTORS: Record<string, { factor: number; unit: string; label_fr: string; label_en: string }> = {
  plane_short:   { factor: 0.230, unit: 'km',    label_fr: 'Avion court courrier (<1000km)', label_en: 'Short-haul flight (<1000km)' },
  plane_medium:  { factor: 0.187, unit: 'km',    label_fr: 'Avion moyen courrier', label_en: 'Medium-haul flight' },
  plane_long:    { factor: 0.152, unit: 'km',    label_fr: 'Avion long courrier (>3500km)', label_en: 'Long-haul flight (>3500km)' },
  train_france:  { factor: 0.006, unit: 'km',    label_fr: 'TGV France', label_en: 'Train France (TGV)' },
  train_europe:  { factor: 0.037, unit: 'km',    label_fr: 'Train Europe', label_en: 'Train Europe' },
  car:           { factor: 0.193, unit: 'km',    label_fr: 'Voiture / taxi', label_en: 'Car / taxi' },
  hotel:         { factor: 19.0,  unit: 'nuits', label_fr: "Nuits d'hotel", label_en: 'Hotel nights' },
};

export const SCOPE3_COMMUTING_FACTORS: Record<string, { factor: number; label_fr: string; label_en: string }> = {
  car_solo:       { factor: 0.193, label_fr: 'Voiture solo', label_en: 'Car (solo)' },
  car_carpool:    { factor: 0.097, label_fr: 'Covoiturage', label_en: 'Carpool' },
  public_transit: { factor: 0.049, label_fr: 'Transports en commun', label_en: 'Public transit' },
  bike_walk:      { factor: 0,     label_fr: 'Velo / marche', label_en: 'Bike / walk' },
  electric_car:   { factor: 0.020, label_fr: 'Voiture electrique', label_en: 'Electric car' },
  motorcycle:     { factor: 0.110, label_fr: 'Moto / scooter', label_en: 'Motorcycle / scooter' },
};

export const SCOPE3_DIGITAL_FACTORS = {
  cloud_per_eur:     { factor: 0.020, label_fr: 'Hebergement cloud', label_en: 'Cloud hosting' },
  email:             { factor: 0.004, label_fr: 'Email (sans PJ)', label_en: 'Email (no attachment)' },
  video_call_hour:   { factor: 0.150, label_fr: 'Visioconference', label_en: 'Video call' },
};

export const INDUSTRY_SECTORS = [
  { value: 'industry', label_fr: 'Industrie', label_en: 'Manufacturing' },
  { value: 'construction', label_fr: 'Construction', label_en: 'Construction' },
  { value: 'logistics', label_fr: 'Logistique', label_en: 'Logistics' },
  { value: 'commerce', label_fr: 'Commerce', label_en: 'Retail' },
  { value: 'services', label_fr: 'Services', label_en: 'Services' },
  { value: 'food', label_fr: 'Agroalimentaire', label_en: 'Food & agriculture' },
  { value: 'transport', label_fr: 'Transport', label_en: 'Transport' },
  { value: 'digital', label_fr: 'Numerique', label_en: 'Digital / IT' },
  { value: 'other', label_fr: 'Autre', label_en: 'Other' },
];

export const COUNTRIES = [
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Allemagne / Germany' },
  { value: 'UK', label: 'Royaume-Uni / UK' },
  { value: 'ES', label: 'Espagne / Spain' },
  { value: 'IT', label: 'Italie / Italy' },
  { value: 'US', label: 'USA' },
  { value: 'EU_AVG', label: 'Europe (moyenne / average)' },
];
