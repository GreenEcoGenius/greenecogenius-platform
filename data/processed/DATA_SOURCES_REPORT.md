# Rapport de traçabilité des données — Explorateur de Matières GreenEcoGenius

**Date de génération :** 2026-04-04

---

## France

### Source principale : ADEME/SINOE
- **URL** : https://data.ademe.fr
- **Date de téléchargement** : 2026-04-04
- **Année des données** : 2019 (DMA) et 2021 (déchèteries + OMA)
- **Nombre de lignes importées** :
  - 10 001 sources géolocalisées (déchèteries, ISDND, UIOM)
  - 91 stats régionales (13 régions × 7 catégories)
  - 7 stats nationales (7 catégories sur 9)
- **Catégories couvertes** : Papier-Carton, Plastiques, Métaux, Verre, Bois, DEEE, Biodéchets, BTP (pas de données Textiles isolées dans SINOE)
- **Transformations appliquées** :
  1. Téléchargement via l'API data-fair de l'ADEME (format CSV)
  2. Filtrage des lignes avec tonnage > 0
  3. Filtrage sur les 13 régions métropolitaines
  4. Sélection de l'année la plus récente par dataset
  5. Mapping des codes SINOE (07x, 02x, 08x) vers les 9 catégories GreenEcoGenius
  6. Agrégation par région et par catégorie
  7. Filtrage GPS : latitude 41-52°N, longitude -5.5 à 10°E (France métropolitaine)

### Datasets ADEME utilisés

| Dataset | URL | Lignes | Usage |
|---------|-----|--------|-------|
| SINOE Annuaire des déchèteries DMA | https://data.ademe.fr/datasets/sinoe-(r)-annuaire-des-decheteries-dma | 10 000 | Sources géolocalisées |
| SINOE Annuaire ISDND 2016 | https://data.ademe.fr/datasets/sinoe-annuaire-isdnd-2016-ok | 233 | Sources géolocalisées |
| SINOE Annuaire UIOM 2016 | https://data.ademe.fr/datasets/sinoe-annuaire-uiom-2016 | 129 | Sources géolocalisées |
| SINOE Tonnage DMA par type de déchet | https://data.ademe.fr/datasets/sinoe-(r)-tonnage-dma-par-type-de-dechet | 4 182 | Stats régionales |
| SINOE Tonnage déchèteries par type et dept | https://data.ademe.fr/datasets/tonnage-decheterie-par-type-dechet-par-dept | 5 300 | Stats régionales |
| SINOE Performance collecte OMA par type et dept | https://data.ademe.fr/datasets/performances-collecte-oma-par-type-dechet-par-dept | 2 356 | Stats régionales |
| MODECOM 2024 - Composition OMR et CS | https://data.ademe.fr/datasets/omrcs-compo-jdd | 72 | Référence composition |
| MODECOM 2024 - Composition déchèteries | https://data.ademe.fr/datasets/dech-compo-jdd | 87 | Référence composition |

### Données manquantes France
- **Textiles** : pas de catégorie Textiles isolée dans SINOE DMA/OMA (intégré partiellement dans "Autres" ou "Encombrants")
- **Prix par tonne** : non disponible dans SINOE (nécessiterait données FEDEREC ou bourses de matières)
- **Taux de recyclage régionaux** : non disponible directement (SINOE donne des tonnages collectés, pas des taux)
- **GéoRisques/IREP** : le portail nécessite un téléchargement interactif via JavaScript — non automatisable sans navigateur

---

## Europe

### Source principale : Eurostat
- **URL** : https://ec.europa.eu/eurostat/databrowser/
- **Date de téléchargement** : 2026-04-04
- **Année des données** : 2020-2022 (selon disponibilité par pays)
- **Pays couverts** : 28 (UE-27 + Norvège ; Royaume-Uni et Suisse partiellement couverts selon les datasets)
- **Nombre de lignes importées** : 252 stats nationales
- **Transformations appliquées** :
  1. Téléchargement des fichiers TSV compressés via l'API SDMX 2.1
  2. Filtrage : unit=T (tonnes), hazard=HAZ_NHAZ (total), nace=TOTAL_HH (toutes activités)
  3. Sélection de la valeur la plus récente pour chaque combinaison pays/catégorie
  4. Mapping des codes EWC-Stat vers les 9 catégories GreenEcoGenius
  5. Fusion des 3 datasets avec priorité waspac (taux de recyclage) > wasgen (volumes) > wasmun (taux globaux)

### Datasets Eurostat utilisés

| Dataset | Code | URL | Contenu |
|---------|------|-----|---------|
| Generation of waste by waste category | env_wasgen | https://ec.europa.eu/eurostat/databrowser/view/env_wasgen | Volumes par catégorie de déchet et par pays |
| Packaging waste by waste management operations | env_waspac | https://ec.europa.eu/eurostat/databrowser/view/env_waspac | Emballages : volumes + taux de recyclage par matière |
| Municipal waste by waste management operations | env_wasmun | https://ec.europa.eu/eurostat/databrowser/view/env_wasmun | Déchets municipaux : taux recyclage, valorisation, mise en décharge |

### Mapping des codes Eurostat

| Code Eurostat | Catégorie GreenEcoGenius |
|---------------|--------------------------|
| W071 | Verre |
| W072 | Papier-Carton |
| W074 | Plastiques |
| W075 | Bois |
| W076 | Textiles |
| W061, W062, W063 | Métaux |
| W091, W092, W093 | Biodéchets |
| W121 | BTP |
| W081, W08A, W0841 | DEEE |
| W150101 | Papier-Carton (emballages) |
| W150102 | Plastiques (emballages) |
| W150103 | Bois (emballages) |
| W150104 | Métaux (emballages) |
| W150107 | Verre (emballages) |

### Données manquantes Europe
- **Prix par tonne** : non disponible dans Eurostat (nécessiterait données de bourses de matières)
- **Stats régionales** : Eurostat ne fournit pas de données infra-nationales dans ces datasets
- **Suisse et Royaume-Uni** : couverture partielle selon les datasets

---

## USA

### Source principale : EPA
- **URL** : https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling
- **Date de téléchargement** : 2026-04-04
- **Année des données** : 2018 (dernières données complètes EPA)
- **Nombre de lignes importées** : 7 stats nationales
- **Transformations appliquées** :
  1. Téléchargement du fichier Excel "Material Generation and Recycling 1960-2018"
  2. Extraction de la ligne 2018 (génération + recyclage)
  3. Mapping des catégories EPA vers les 9 catégories GreenEcoGenius
  4. Conversion : 1 thousand short tons × 907.185 = tonnes métriques
  5. Calcul des taux de recyclage : recyclage / génération × 100
  6. Ventilation de "All Other" en Textiles (17 030 kt) et Bois (18 090 kt) selon les ventilations détaillées EPA

### Fichiers EPA utilisés

| Fichier | URL | Contenu |
|---------|-----|---------|
| epa_material_generation_recycling_1960-2018_0.xlsx | https://www.epa.gov/sites/default/files/2021-04/epa_material_generation_recycling_1960-2018_0.xlsx | Génération + recyclage par matière 1960-2018 |
| historical_ff_data_1960-2018_12312020.xlsx | https://www.epa.gov/sites/default/files/2021-01/historical_ff_data_1960-2018_12312020.xlsx | Historique gestion des déchets (mise en décharge, incinération, compostage) |

### Mapping EPA → 9 catégories

| Catégorie EPA | Catégorie GreenEcoGenius |
|---------------|--------------------------|
| Paper and Paperboard | Papier-Carton |
| Glass | Verre |
| Metals (Ferrous + Aluminum + Other nonferrous) | Métaux |
| Plastics | Plastiques |
| Food + Yard Trimmings | Biodéchets |
| Textiles (from "All Other" breakdown) | Textiles |
| Wood (from "All Other" breakdown) | Bois |
| Selected Consumer Electronics | DEEE |
| Construction and Demolition | BTP |

### Note conversion
1 short ton = 0.907185 tonnes métriques

### Données manquantes USA
- **DEEE** : non isolé dans le tableau principal EPA (inclus partiellement dans Métaux et Other)
- **BTP** : EPA traite C&D séparément du MSW ; non inclus dans ces données
- **Stats par état** : non disponibles dans le dataset EPA national ; nécessiterait CalRecycle (CA), NYSDEC (NY), TCEQ (TX), etc.
- **Données post-2018** : EPA n'a pas publié de mise à jour complète des Facts & Figures au-delà de 2018 au moment du téléchargement
- **Prix par tonne** : non disponible dans les données EPA

---

## Checklist de validation

| Critère | France | Europe | USA |
|---------|--------|--------|-----|
| `data_source` renseigné | ✅ | ✅ | ✅ |
| `data_source_url` renseigné | ✅ | ✅ | ✅ |
| `year` renseigné | ✅ | ✅ | ✅ |
| Volumes en tonnes métriques | ✅ | ✅ | ✅ (conversion short tons) |
| Taux en pourcentage 0-100 | n/a | ✅ | ✅ |
| Noms de régions normalisés | ✅ | n/a | n/a |
| Country codes ISO 3166-1 alpha-2 | ✅ (FR) | ✅ | ✅ (US) |
| Catégories sur les 9 standard | ✅ (7/9) | ✅ (9/9) | ✅ (7/9) |
| Prix en EUR/USD avec currency | ❌ (non dispo) | ❌ (non dispo) | ❌ (non dispo) |
| Coordonnées GPS vérifiées | ✅ (41-52°N, -5.5-10°E) | n/a | n/a |
| Encodage UTF-8 | ✅ | ✅ | ✅ |
| Apostrophes SQL échappées | ✅ | ✅ | ✅ |
| ZÉRO donnée inventée | ✅ | ✅ | ✅ |
