/*
 * generated-images bucket, declaration + RLS policies.
 *
 * Contexte du bug :
 * Le bucket est reference depuis longtemps par :
 *   - apps/web/app/api/flux/generate/route.ts (admin client, bypass RLS)
 *   - apps/web/app/[locale]/home/[account]/marketplace/new/_components/create-listing-form.tsx
 *     (authenticated client, path 'listings/{accountId}/{uuid}.{ext}')
 * Mais jamais declare dans les migrations. En prod le bucket a pu etre
 * cree manuellement via le dashboard, mais sans policies, l'upload
 * cote marketplace echoue silencieusement.
 *
 * Conventions de path dans ce bucket :
 *   - flux/{context}/{fileKey}.png               (ecrit par Flux admin)
 *   - listings/{accountId}/{uuid}.{ext}          (ecrit par l'utilisateur)
 *
 * Bucket public pour que les images listings soient servies sans signature.
 */

-- Bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'generated-images',
  'generated-images',
  true,
  10485760, -- 10 MB
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ── RLS storage.objects pour generated-images ──

-- Lecture : bucket public, tout le monde peut lire
drop policy if exists "generated_images_select_public" on storage.objects;
create policy "generated_images_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'generated-images');

-- Insertion listings/{uid}/... : utilisateur authentifie proprietaire du path
drop policy if exists "generated_images_insert_own_listing" on storage.objects;
create policy "generated_images_insert_own_listing"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'generated-images'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = (select auth.uid()::text)
  );

-- Mise a jour listings/{uid}/... : utilisateur authentifie proprietaire du path
drop policy if exists "generated_images_update_own_listing" on storage.objects;
create policy "generated_images_update_own_listing"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'generated-images'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'generated-images'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = (select auth.uid()::text)
  );

-- Suppression listings/{uid}/... : utilisateur authentifie proprietaire du path
drop policy if exists "generated_images_delete_own_listing" on storage.objects;
create policy "generated_images_delete_own_listing"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'generated-images'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = (select auth.uid()::text)
  );

-- Les writes sur 'flux/*' passent par le service_role (admin client),
-- pas besoin de policy pour ce path.
