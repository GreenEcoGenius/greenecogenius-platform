/*
 * Compliance Engine — per-account norm compliance tracking
 * Table: account_norm_compliance
 *
 * Stores the evaluation result of each of the 42 norms for each account.
 * Updated automatically by the compliance engine when transactions,
 * carbon records, blockchain records, certificates, or ESG data change.
 */

create table if not exists public.account_norm_compliance (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  norm_id text not null,
  status text not null default 'not_evaluated'
    check (status in ('compliant', 'partial', 'non_compliant', 'not_evaluated')),
  verification_method text default 'pending'
    check (verification_method in (
      'auto_transaction', 'auto_blockchain', 'auto_carbon',
      'auto_esg', 'auto_platform', 'manual', 'pending'
    )),
  evidence_summary text,
  evidence_data jsonb default '{}',
  last_evaluated_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(account_id, norm_id)
);

alter table public.account_norm_compliance enable row level security;

-- Users can read their own compliance data
create policy "account_norm_compliance_read_own"
  on public.account_norm_compliance for select
  using (account_id = (select auth.uid()));

-- Service role can write (engine runs server-side)
grant select on public.account_norm_compliance to authenticated;
grant all on public.account_norm_compliance to service_role;

-- Indexes
create index idx_anc_account on public.account_norm_compliance (account_id);
create index idx_anc_status on public.account_norm_compliance (account_id, status);
create index idx_anc_norm on public.account_norm_compliance (norm_id);
