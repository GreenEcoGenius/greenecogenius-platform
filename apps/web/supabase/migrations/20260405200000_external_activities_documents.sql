/*
 * External Activities — document uploads
 *
 * Creates a private 'documents' bucket in Supabase Storage scoped to the
 * authenticated user: each user may only read/write files under
 * documents/<auth.uid()>/... The existing external_activities table gets a
 * new document_path column so uploaded files can be referenced alongside
 * the pre-existing document_url (used for external links).
 */

-- ─── Bucket ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760, -- 10 MB
  array[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ─── RLS policies on storage.objects for the documents bucket ──────────
-- Each user can only access files whose storage key begins with their uid.
-- storage.foldername(name) returns an array of path segments; [1] is the
-- top-level folder name (= the user id in our convention).

drop policy if exists "documents_select_own" on storage.objects;
create policy "documents_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "documents_insert_own" on storage.objects;
create policy "documents_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "documents_update_own" on storage.objects;
create policy "documents_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "documents_delete_own" on storage.objects;
create policy "documents_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- ─── New column on external_activities ────────────────────────────────
alter table public.external_activities
  add column if not exists document_path text;

comment on column public.external_activities.document_path is
  'Storage key inside the private documents bucket (e.g. <user_id>/<uuid>-<name>.pdf). Mutually exclusive with document_url which stores an external link.';
