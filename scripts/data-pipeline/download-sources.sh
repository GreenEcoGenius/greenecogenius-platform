#!/usr/bin/env bash
# download-sources.sh — Fetch open-data CSVs from GEREP, ADEME SINOE, etc.
#
# Usage:  bash scripts/data-pipeline/download-sources.sh
# Outputs raw files to data/raw/{gerep,ademe}/

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
RAW="$ROOT/data/raw"

echo "==> Creating directories"
mkdir -p "$RAW/gerep" "$RAW/ademe"

# ── GEREP — Registre des émissions polluantes et déchets ────────────────
echo "==> Downloading GEREP datasets from data.gouv.fr …"

# Main emissions + waste by establishment
# Replace the URL with the actual resource URL from:
# https://www.data.gouv.fr/datasets/registre-francais-des-emissions-polluantes/
curl -fSL \
  "https://www.data.gouv.fr/fr/datasets/r/registre-emissions-polluantes-dechets.csv" \
  -o "$RAW/gerep/emissions-dechets.csv" 2>/dev/null \
  || echo "   ⚠  GEREP CSV not available — will use seed data instead."

# Georisques API — first page of classified installations (sample)
curl -fSL \
  "https://georisques.gouv.fr/api/v1/installations_classees?page=1&page_size=100" \
  -o "$RAW/gerep/installations-page1.json" 2>/dev/null \
  || echo "   ⚠  Georisques API not reachable."

# ── ADEME — Économie circulaire et déchets ──────────────────────────────
echo "==> Downloading ADEME datasets …"

curl -fSL \
  "https://data.ademe.fr/datasets/sinoe-dechets/exports/csv" \
  -o "$RAW/ademe/sinoe-dechets.csv" 2>/dev/null \
  || echo "   ⚠  SINOE CSV not available."

curl -fSL \
  "https://data.ademe.fr/datasets/modecom-2024/exports/csv" \
  -o "$RAW/ademe/modecom-2024.csv" 2>/dev/null \
  || echo "   ⚠  MODECOM CSV not available."

curl -fSL \
  "https://data.ademe.fr/datasets/base-carbone/exports/csv" \
  -o "$RAW/ademe/base-carbone.csv" 2>/dev/null \
  || echo "   ⚠  Base Carbone CSV not available."

echo "==> Done.  Raw files are in $RAW"
ls -lhR "$RAW"
