/*
 * Le Comptoir Circulaire — Marketplace B2B
 * Tables: material_categories, listings, listing_images
 */

-- Material categories (seed data)
create table if not exists public.material_categories (
  id uuid unique not null default extensions.uuid_generate_v4(),
  name text not null,
  name_fr text not null,
  slug text unique not null,
  icon text,
  created_at timestamptz default now(),
  primary key (id)
);

alter table public.material_categories enable row level security;

-- Everyone can read categories
grant select on table public.material_categories to authenticated, anon;

create policy "material_categories_read" on public.material_categories
  for select using (true);

-- Seed categories
insert into public.material_categories (name, name_fr, slug, icon) values
  ('Metals', 'Métaux', 'metals', 'metal'),
  ('Plastics', 'Plastiques', 'plastics', 'plastic'),
  ('Paper & Cardboard', 'Papier & Carton', 'paper-cardboard', 'paper'),
  ('Glass', 'Verre', 'glass', 'glass'),
  ('Wood', 'Bois', 'wood', 'wood'),
  ('Textiles', 'Textiles', 'textiles', 'textile'),
  ('Electronic Waste (WEEE)', 'Déchets Électroniques (DEEE)', 'electronic-waste', 'electronic'),
  ('Organic Waste', 'Déchets Organiques', 'organic', 'organic'),
  ('Construction & Demolition', 'Construction & Démolition', 'construction', 'construction'),
  ('Chemicals', 'Produits Chimiques', 'chemicals', 'chemical')
on conflict (slug) do nothing;

-- Listings (marketplace ads)
create table if not exists public.listings (
  id uuid unique not null default extensions.uuid_generate_v4(),
  account_id uuid references public.accounts(id) on delete cascade not null,
  category_id uuid references public.material_categories(id) not null,
  title text not null,
  description text,
  material_details text,
  quantity numeric not null check (quantity > 0),
  unit text not null default 'kg' check (unit in ('kg', 'tonnes', 'units', 'liters', 'm3')),
  price_per_unit numeric check (price_per_unit >= 0),
  currency text not null default 'EUR',
  location_city text,
  location_country text default 'FR',
  location_postal_code text,
  listing_type text not null default 'sell' check (listing_type in ('sell', 'buy', 'collect')),
  status text not null default 'active' check (status in ('active', 'sold', 'expired', 'draft')),
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

create index idx_listings_account_id on public.listings(account_id);
create index idx_listings_category_id on public.listings(category_id);
create index idx_listings_status on public.listings(status);
create index idx_listings_listing_type on public.listings(listing_type);
create index idx_listings_created_at on public.listings(created_at desc);

alter table public.listings enable row level security;

revoke all on public.listings from authenticated, service_role;
grant select, insert, update, delete on table public.listings to authenticated;
grant select on table public.listings to anon;

-- Anyone can read active listings
create policy "listings_read_active" on public.listings
  for select using (
    status = 'active'
    or account_id = (select auth.uid())
    or public.has_role_on_account(account_id)
  );

-- Owner can insert
create policy "listings_insert" on public.listings
  for insert to authenticated
  with check (
    account_id = (select auth.uid())
    or public.has_role_on_account(account_id)
  );

-- Owner can update their own
create policy "listings_update" on public.listings
  for update to authenticated
  using (
    account_id = (select auth.uid())
    or public.has_role_on_account(account_id)
  )
  with check (
    account_id = (select auth.uid())
    or public.has_role_on_account(account_id)
  );

-- Owner can delete their own
create policy "listings_delete" on public.listings
  for delete to authenticated
  using (
    account_id = (select auth.uid())
    or public.has_role_on_account(account_id)
  );

-- Listing images
create table if not exists public.listing_images (
  id uuid unique not null default extensions.uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  storage_path text not null,
  position integer not null default 0,
  created_at timestamptz default now(),
  primary key (id)
);

create index idx_listing_images_listing_id on public.listing_images(listing_id);

alter table public.listing_images enable row level security;

revoke all on public.listing_images from authenticated, service_role;
grant select, insert, delete on table public.listing_images to authenticated;
grant select on table public.listing_images to anon;

-- Same RLS as parent listing
create policy "listing_images_read" on public.listing_images
  for select using (
    exists (
      select 1 from public.listings
      where listings.id = listing_images.listing_id
    )
  );

create policy "listing_images_insert" on public.listing_images
  for insert to authenticated
  with check (
    exists (
      select 1 from public.listings
      where listings.id = listing_images.listing_id
      and (
        listings.account_id = (select auth.uid())
        or public.has_role_on_account(listings.account_id)
      )
    )
  );

create policy "listing_images_delete" on public.listing_images
  for delete to authenticated
  using (
    exists (
      select 1 from public.listings
      where listings.id = listing_images.listing_id
      and (
        listings.account_id = (select auth.uid())
        or public.has_role_on_account(listings.account_id)
      )
    )
  );

-- Auto-update updated_at on listings
create or replace function public.update_listing_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_listing_updated_at
  before update on public.listings
  for each row
  execute function public.update_listing_updated_at();
