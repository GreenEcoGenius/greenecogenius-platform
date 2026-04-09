/*
 * External Activities — manually declared ESG / RSE data that lives outside
 * the platform (governance, HR, environment beyond recycling, procurement,
 * community engagement).
 *
 * These rows are merged with auto-collected data by the compliance engine
 * to score norms such as ISO 26000, CSRD/ESRS, EcoVadis, CSDDD, Devoir de
 * Vigilance and to enrich label eligibility (B Corp, Lucie, etc.).
 */

create table if not exists public.external_activities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  category text not null check (category in (
    'governance', 'social', 'environment', 'procurement', 'community'
  )),
  subcategory text not null,
  title text not null,
  description text,
  quantitative_value numeric,
  quantitative_unit text,
  qualitative_value text,
  document_url text,
  date_start date,
  date_end date,
  norms_impacted text[] default '{}',
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.external_activities enable row level security;

-- Personal accounts only: account_id matches the authenticated user id.
create policy "external_activities_select_own"
  on public.external_activities for select
  using (account_id = (select auth.uid()));

create policy "external_activities_insert_own"
  on public.external_activities for insert
  with check (account_id = (select auth.uid()));

create policy "external_activities_update_own"
  on public.external_activities for update
  using (account_id = (select auth.uid()))
  with check (account_id = (select auth.uid()));

create policy "external_activities_delete_own"
  on public.external_activities for delete
  using (account_id = (select auth.uid()));

grant select, insert, update, delete on public.external_activities to authenticated;
grant all on public.external_activities to service_role;

create index if not exists idx_ext_activities_account on public.external_activities (account_id);
create index if not exists idx_ext_activities_category on public.external_activities (account_id, category);

-- Maintain updated_at automatically
create or replace function public.set_external_activities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_external_activities_updated_at on public.external_activities;
create trigger trg_external_activities_updated_at
  before update on public.external_activities
  for each row execute function public.set_external_activities_updated_at();
