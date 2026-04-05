/*
 * Contract signatures — legal e-signature layer on marketplace_transactions
 *
 * Adds a parallel contract state machine to existing marketplace_transactions
 * rows. The existing `status` column (pending_payment → paid → in_transit →
 * delivered → completed) is left untouched. `contract_status` runs alongside:
 *
 *   (none) → contract_generated → pending_signatures →
 *   seller_signed | buyer_signed → fully_signed → blockchain_certified
 *
 * It's entered only once a transaction reaches `paid`, so the Stripe flow is
 * unchanged. Full flow:
 *
 *   buyer checks out → paid → contract generated + sent to DocuSign →
 *   both parties sign → signed PDF stored in private 'contracts' bucket →
 *   blockchain hash includes the signed PDF SHA-256 → certificate released.
 *
 * A private Supabase Storage bucket `contracts` stores both the unsigned and
 * signed PDFs under one folder per transaction: contracts/<transaction_id>/*.
 */

-- ─── 1. Contract columns on marketplace_transactions ──────────────────
alter table public.marketplace_transactions
  add column if not exists contract_id text,
  add column if not exists contract_status text
    check (contract_status in (
      'not_started',
      'contract_generated',
      'pending_signatures',
      'seller_signed',
      'buyer_signed',
      'fully_signed',
      'blockchain_certified',
      'cancelled',
      'expired'
    )),
  add column if not exists contract_pdf_path text,
  add column if not exists contract_signed_pdf_path text,
  add column if not exists contract_signed_pdf_sha256 text,
  add column if not exists signature_envelope_id text,
  add column if not exists signature_provider text default 'docusign',
  add column if not exists seller_signed boolean not null default false,
  add column if not exists buyer_signed boolean not null default false,
  add column if not exists seller_signed_at timestamptz,
  add column if not exists buyer_signed_at timestamptz,
  add column if not exists contract_sent_at timestamptz,
  add column if not exists contract_expires_at timestamptz;

comment on column public.marketplace_transactions.contract_id is
  'Human-readable contract reference, e.g. CTR-2026-ABC12.';
comment on column public.marketplace_transactions.contract_status is
  'Independent of payment status. Runs from contract_generated through blockchain_certified.';
comment on column public.marketplace_transactions.contract_pdf_path is
  'Storage key under the private contracts bucket for the unsigned PDF.';
comment on column public.marketplace_transactions.contract_signed_pdf_path is
  'Storage key for the fully-signed PDF, populated by the DocuSign webhook.';
comment on column public.marketplace_transactions.contract_signed_pdf_sha256 is
  'SHA-256 of the signed PDF — embedded in the blockchain record as tamper-proof reference.';
comment on column public.marketplace_transactions.signature_envelope_id is
  'DocuSign envelope id (or equivalent for other providers).';

create index if not exists idx_transactions_contract_status
  on public.marketplace_transactions(contract_status);
create index if not exists idx_transactions_envelope
  on public.marketplace_transactions(signature_envelope_id);

-- ─── 2. Private Storage bucket for contract PDFs ─────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'contracts',
  'contracts',
  false,
  20971520, -- 20 MB
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ─── 3. RLS on storage.objects for the contracts bucket ──────────────
-- Each file lives at contracts/<transaction_id>/<filename>.pdf. A user is
-- allowed to read a file iff they are the buyer OR seller of the matching
-- transaction. Writes are done exclusively by the service role (server
-- actions use the admin client to upload), so there is no INSERT/UPDATE
-- policy for authenticated users here.

drop policy if exists "contracts_select_own_party" on storage.objects;
create policy "contracts_select_own_party"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'contracts'
    and exists (
      select 1
      from public.marketplace_transactions t
      where
        t.id::text = (storage.foldername(name))[1]
        and (
          t.buyer_account_id = (select auth.uid())
          or t.seller_account_id = (select auth.uid())
        )
    )
  );
