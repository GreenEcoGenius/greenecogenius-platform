# Makerkit SaaS Starter

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** (Postgres, Auth, Storage)
- **Tailwind CSS 4** + Shadcn UI
- **Turborepo** monorepo

## Monorepo Structure

| Directory           | Purpose                       | Details                           |
| ------------------- | ----------------------------- | --------------------------------- |
| `apps/web`          | Main Next.js app              | See `apps/web/AGENTS.md`          |
| `apps/web/supabase` | Database schemas & migrations | See `apps/web/supabase/AGENTS.md` |
| `apps/e2e`          | Playwright E2E tests          | See `apps/e2e/AGENTS.md`          |
| `packages/ui`       | UI components (@kit/ui)       | See `packages/ui/AGENTS.md`       |
| `packages/supabase` | Supabase clients              | See `packages/supabase/AGENTS.md` |
| `packages/next`     | Next.js utilities             | See `packages/next/AGENTS.md`     |
| `packages/features` | Feature packages              | See `packages/features/AGENTS.md` |

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `apps/web/node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## Multi-Tenant Architecture

- **Personal Accounts**: `auth.users.id = accounts.id`
- **Team Accounts**: Shared workspaces with members, roles, permissions
- Data links to accounts via `account_id` foreign key

## Essential Commands

```bash
pnpm dev                          # Start development
pnpm supabase:web:start           # Start local Supabase
pnpm supabase:web:reset           # Reset database
pnpm supabase:web:typegen         # Generate TypeScript types
pnpm typecheck                    # Type check
pnpm lint:fix                     # Fix linting
pnpm format:fix                   # Format code
```

## Key Patterns (Quick Reference)

| Pattern        | Import                                                       | Details                       |
| -------------- | ------------------------------------------------------------ | ----------------------------- |
| Server Actions | `authActionClient` from `@kit/next/safe-action`              | `packages/next/AGENTS.md`     |
| Route Handlers | `enhanceRouteHandler` from `@kit/next/routes`                | `packages/next/AGENTS.md`     |
| Server Client  | `getSupabaseServerClient` from `@kit/supabase/server-client` | `packages/supabase/AGENTS.md` |
| UI Components  | `@kit/ui/{component}`                                        | `packages/ui/AGENTS.md`       |
| Translations   | `Trans` from `@kit/ui/trans`                                 | `packages/ui/AGENTS.md`       |

## Authorization

- **RLS enforces access control** - no manual auth checks needed with standard client
- **Admin client** (`getSupabaseServerAdminClient`) bypasses RLS - use sparingly with manual validation

## Verification

After implementation, always run:

1. `pnpm typecheck`
2. `pnpm lint:fix`
3. `pnpm format:fix`
4. Run code quality reviewer agent

## Cursor Cloud specific instructions

### Services overview

| Service | Port | Start command |
|---------|------|---------------|
| Next.js web app | 3000 | `pnpm dev` (via Turborepo) |
| Next.js dev-tool | 3010 | Started automatically with `pnpm dev` |
| Supabase (Postgres, Auth, Storage, Studio, Mailpit) | 54321–54327 | `pnpm supabase:web:start` |

### Startup sequence

1. **Docker must be running** before Supabase can start. Start dockerd if not already running: `sudo dockerd &>/tmp/dockerd.log &` then `sudo chmod 666 /var/run/docker.sock`.
2. Start Supabase: `pnpm supabase:web:start` (pulls ~10 containers on first run, ~1 min).
3. Reset DB to apply all migrations and seeds: `pnpm supabase:web:reset`.
4. Start dev servers: `pnpm dev` (web on :3000, dev-tool on :3010).

### Gotchas

- The `.env.development` sets `NEXT_PUBLIC_SITE_URL=http://localhost:3001` but `pnpm dev` starts Next.js on port **3000**. Supabase auth `site_url` in `config.toml` also references port 3001. Auth callback redirects may go to :3001. For browser testing use `http://localhost:3000`.
- Email confirmations are enabled. New signups require email verification. In local dev, use Mailpit at `http://127.0.0.1:54324` to view emails, or confirm users directly via the Supabase DB: `docker exec -i supabase_db_next-supabase-saas-kit-turbo psql -U postgres -d postgres -c "UPDATE auth.users SET email_confirmed_at = now() WHERE email = '<email>';"`.
- `pnpm install` warns about ignored build scripts (esbuild, sharp, etc.) — these are handled by `pnpm.onlyBuiltDependencies` in `pnpm-workspace.yaml` and do not need manual approval.
- Linter (`pnpm lint` / `oxlint`) has a few pre-existing warnings/errors in the codebase; these are not introduced by new changes.
- Stripe keys in `.env.development` are empty. Billing features will not work without Stripe configuration, but core app functionality (auth, dashboard, marketplace) works fine without them.
