-- EventLink Database Schema
-- Run this ENTIRE script in Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('vendor', 'manager', 'admin')) default 'manager',
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. VENDOR PROFILES
create table if not exists public.vendor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  slug text not null unique,
  primary_city text not null,
  serviceable_cities text[] not null default '{}',
  categories text[] not null default '{}',
  bio text,
  years_experience integer,
  team_size integer,
  languages text[] default '{}',
  contact_preferences jsonb default '{"phone": true, "whatsapp": true, "email": true, "visibility": "inquiry_only"}'::jsonb,
  packages jsonb default '[]'::jsonb,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'self_claimed', 'verified')),
  profile_completion_score integer not null default 0 check (profile_completion_score between 0 and 100),
  average_rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  view_count integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vendor_profiles_slug on public.vendor_profiles(slug);
create index if not exists idx_vendor_profiles_primary_city on public.vendor_profiles(primary_city);
create index if not exists idx_vendor_profiles_categories on public.vendor_profiles using gin(categories);
create index if not exists idx_vendor_profiles_rating on public.vendor_profiles(average_rating desc);

-- 3. MEDIA
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  type text not null check (type in ('image', 'video', 'youtube', 'vimeo')),
  url text not null,
  thumbnail_url text,
  caption text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_media_vendor on public.media(vendor_id);

-- 4. REVIEWS
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  manager_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  photos text[] default '{}',
  created_at timestamptz not null default now(),
  unique(vendor_id, manager_id)
);
create index if not exists idx_reviews_vendor on public.reviews(vendor_id);

-- 5. FAVORITES
create table if not exists public.favorites (
  manager_id uuid not null references public.profiles(id) on delete cascade,
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (manager_id, vendor_id)
);

-- 6. INQUIRIES
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  manager_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  event_date date,
  event_type text,
  city text,
  budget_range text,
  status text not null default 'pending' check (status in ('pending', 'responded', 'closed')),
  created_at timestamptz not null default now()
);
create index if not exists idx_inquiries_vendor on public.inquiries(vendor_id);
create index if not exists idx_inquiries_manager on public.inquiries(manager_id);

-- Triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger vendor_profiles_updated_at before update on public.vendor_profiles
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'manager')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_vendor_rating()
returns trigger as $$
begin
  update public.vendor_profiles
  set
    average_rating = (select coalesce(round(avg(rating)::numeric, 2), 0) from public.reviews where vendor_id = coalesce(new.vendor_id, old.vendor_id)),
    review_count = (select count(*) from public.reviews where vendor_id = coalesce(new.vendor_id, old.vendor_id))
  where id = coalesce(new.vendor_id, old.vendor_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger reviews_rating_update
  after insert or update or delete on public.reviews
  for each row execute function public.update_vendor_rating();

-- RLS
alter table public.profiles enable row level security;
alter table public.vendor_profiles enable row level security;
alter table public.media enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.inquiries enable row level security;

create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Active vendor profiles are public" on public.vendor_profiles for select using (is_active = true);
create policy "Vendors can insert own profile" on public.vendor_profiles for insert with check (auth.uid() = user_id);
create policy "Vendors can update own profile" on public.vendor_profiles for update using (auth.uid() = user_id);

create policy "Media of active vendors is public" on public.media for select using (exists (select 1 from public.vendor_profiles vp where vp.id = media.vendor_id and vp.is_active = true));
create policy "Vendors can manage own media" on public.media for all using (exists (select 1 from public.vendor_profiles vp where vp.id = media.vendor_id and vp.user_id = auth.uid()));

create policy "Reviews are public" on public.reviews for select using (true);
create policy "Managers can create reviews" on public.reviews for insert with check (auth.uid() = manager_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'manager'));

create policy "Users can manage own favorites" on public.favorites for all using (auth.uid() = manager_id);

create policy "Vendors can see their inquiries" on public.inquiries for select using (exists (select 1 from public.vendor_profiles vp where vp.id = inquiries.vendor_id and vp.user_id = auth.uid()));
create policy "Managers can see their own inquiries" on public.inquiries for select using (auth.uid() = manager_id);
create policy "Managers can create inquiries" on public.inquiries for insert with check (auth.uid() = manager_id);
create policy "Vendors can update inquiry status" on public.inquiries for update using (exists (select 1 from public.vendor_profiles vp where vp.id = inquiries.vendor_id and vp.user_id = auth.uid()));
