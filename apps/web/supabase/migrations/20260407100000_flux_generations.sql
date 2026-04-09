/*
 * Flux AI image generations — usage tracking for plan limits.
 */

create table if not exists public.flux_generations (
  id uuid unique not null default extensions.uuid_generate_v4(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  context text not null,          -- 'certificates', 'listings', 'esg_reports', 'enterprise'
  context_id text not null,       -- lot id, listing id, report section, etc.
  storage_path text not null,     -- path in generated-images bucket
  created_at timestamptz default now(),
  primary key (id)
);

create index idx_flux_generations_account_id on public.flux_generations(account_id);
create index idx_flux_generations_created_at on public.flux_generations(created_at desc);

alter table public.flux_generations enable row level security;

revoke all on public.flux_generations from authenticated, service_role;
-- Intentionally no update/delete: generation records are immutable audit entries
grant select, insert on table public.flux_generations to authenticated;

-- Users can read their own generations
create policy "flux_generations_read" on public.flux_generations
  for select to authenticated
  using (
    account_id = (select auth.uid())
    or public.has_role_on_account(account_id)
  );

-- Users can insert their own generations
create policy "flux_generations_insert" on public.flux_generations
  for insert to authenticated
  with check (
    account_id = (select auth.uid())
    or public.has_role_on_account(account_id)
  );
