# GreenEcoGenius Platform

## Project
B2B circular economy SaaS platform. Marketplace + Blockchain + AI + ESG reporting.
Two legal entities: GreenEcoGenius OÜ (Estonia, reg. 16917315) + GreenEcoGenius, Inc. (Delaware, USA).

## Stack
- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Template**: Makerkit (uses `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY` not `ANON_KEY`)
- **Database**: Supabase (region: Ireland/EU), RLS enabled on all tables
- **Auth**: Supabase Auth (email + Google OAuth)
- **Deployment**: Vercel (domain: greenecogenius.tech)
- **Blockchain**: Polygon Mainnet via Alchemy, contract: `0x9EB83c7Acd57E228Cc3f9316eC4f27ce1fE94cF6`
- **AI**: Anthropic Claude API (Haiku for fast, Sonnet for analysis, Opus for audits)
- **Payments**: Stripe Connect
- **Icons**: Lucide React (stroke-width 1.5) — NEVER use emojis in the UI
- **Font**: Inter

## Commands
```bash
pnpm dev          # local dev server
pnpm build        # production build (check for errors before deploy)
pnpm lint         # linting
```

## Key Directories
```
app/(site)/       # public pages (landing, explorer, normes, pricing, contact)
app/(app)/        # authenticated app (dashboard, comptoir, carbon, esg, rse, compliance)
components/       # shared components
lib/services/     # business logic (carbon-service, blockchain-service, evaluation-service, genius-service)
lib/config/       # configuration (plans, co2-factors, legal-entities, esrs-indicators)
messages/fr/      # French translations
messages/en/      # English translations
public/images/    # static assets
```

## Critical Rules
1. **ZERO mock data in production** — all data comes from Supabase
2. **Every PDF uses jspdf** — never html2pdf, never window.open
3. **Footer bilingual**: FR → OÜ first / EN → Inc. first
4. **Data entered ONCE** — auto-populate across sections, never ask user to re-enter
5. **Every CO₂ calculation cites ADEME source** — factor value + Base Carbone version
6. **Blockchain hashes include CO₂ avoided** — certified on-chain per transaction
7. **37 norms evaluated automatically** — new account starts at 0%, each action increases score
8. **Feature gating via `useSubscription()` + `canAccess('feature_name')`**
9. **Site title**: "GreenEcoGenius — Plateforme B2B d'Économie Circulaire" (not "Le Comptoir Circulaire")

## Design
- Palette: teal `#0D9488` / emerald `#059669` / green `#16A34A`
- Sidebar: LIGHT background (not dark), active item emerald
- KPI cards: colored gradient at top of each dashboard
- Recharts: teal/emerald/gray palette
- Spacing: 24px between sections
- NO emojis — Lucide icons only

## Plans & Gating
- **Essential** (149€/mo): Scope 1&2, Comptoir, 50 blockchain lots/mo, RSE basic, Genius 10msg/day
- **Advanced** (449€/mo): + Scope 3, CSRD report, unlimited blockchain, SBTi, Genius 100msg/day
- **Enterprise** (custom): + Opus unlimited, API, multi-users, white-label

## Supabase Notes
- Env var is `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY` (Makerkit naming, not standard `ANON_KEY`)
- Explorer tables (`material_sources`, `material_stats_by_region`, `material_stats_national`) have public read RLS
- Auth tables use standard Supabase auth schema

## AI Assistant
- Name: **Genius** (not "assistant" or "chatbot")
- Welcome: "Je suis Genius, l'assistant IA de la plateforme."
- Contextual per section — adapts suggestions based on current page
- Never invents data — always based on user's real data from Supabase

## When Compacting
Always preserve: list of modified files, current task objective, test commands, and any error messages being debugged.

@AGENTS.md
