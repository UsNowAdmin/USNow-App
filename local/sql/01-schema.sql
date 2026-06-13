-- ============================================================
-- UsNow Local — Step 2 Schema
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- The mapping engine
create extension if not exists postgis;

-- ------------------------------------------------------------
-- COMMUNITIES: the polygons. Any scale — a building to a county.
-- ------------------------------------------------------------
create table communities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  notes       text,
  geom        geometry(Polygon, 4326) not null,
  status      text not null default 'draft'
              check (status in ('draft','live','archived')),
  parent_id   uuid references communities(id),
  created_by  uuid,                       -- the Creator, forever on record
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz                 -- soft delete: nothing truly erased
);
create index communities_geom_idx on communities using gist (geom);

-- ------------------------------------------------------------
-- HOUSEHOLDS: containers inside a community. May hold members,
-- or be just an address with a presence status.
-- ------------------------------------------------------------
create table households (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references communities(id),
  label         text not null,            -- "12 Maple"
  geom          geometry(Point, 4326),
  presence      text not null default 'unknown'
                check (presence in ('connected','present','vacant','unknown')),
  steward_notes text,                     -- plain-view facts only; auditable
  created_by    uuid,
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);
create index households_geom_idx on households using gist (geom);

-- ------------------------------------------------------------
-- PROFILES: people. One row per account (links to Supabase auth).
-- ------------------------------------------------------------
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MEMBERSHIPS: the hinge. One row per person-per-community.
-- role_level numbers are permanent; display words can change freely.
--   10 = member (account, anchored here but unranked)
--   20 = resident (claimed a household spot; present, owing nothing)
--   30 = neighbor (vouched; trusted, helpful)
--   40 = trusted neighbor
--   50 = professional badge tier (credentialed; badge, not caste)
--   60 = steward (full moderation; first one is the creator)
-- ------------------------------------------------------------
create table memberships (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  community_id uuid not null references communities(id),
  household_id uuid references households(id),
  role_level   int not null default 10
               check (role_level in (10,20,30,40,50,60)),
  vouched_by   uuid references profiles(id),
  status       text not null default 'active'
               check (status in ('pending','active','removed')),
  created_at   timestamptz not null default now(),
  unique (profile_id, community_id)       -- one role per person per community
);

-- ------------------------------------------------------------
-- THE CONTAINMENT QUERY: which communities contain this point,
-- smallest first. This is the fractal, as a function.
-- usage: select * from communities_at_point(-73.18, 40.745);
-- ------------------------------------------------------------
create or replace function communities_at_point(lng float8, lat float8)
returns setof communities
language sql stable as $$
  select * from communities
  where deleted_at is null
    and st_contains(geom, st_setsrid(st_makepoint(lng, lat), 4326))
  order by st_area(geom) asc;
$$;

-- ------------------------------------------------------------
-- AUTO-PARENTING: on insert/update, a community's parent becomes
-- the smallest other community that fully contains it.
-- ------------------------------------------------------------
create or replace function set_community_parent()
returns trigger language plpgsql as $$
begin
  select id into new.parent_id
  from communities
  where deleted_at is null
    and id is distinct from new.id
    and st_contains(geom, new.geom)
  order by st_area(geom) asc
  limit 1;
  return new;
end;
$$;

create trigger community_parent_trg
before insert or update of geom on communities
for each row execute function set_community_parent();

-- ------------------------------------------------------------
-- ROW-LEVEL SECURITY: the three rings, enforced in the data.
-- ------------------------------------------------------------
alter table communities enable row level security;
alter table households  enable row level security;
alter table profiles    enable row level security;
alter table memberships enable row level security;

-- Ring 1 (public): community shapes are visible to everyone.
create policy "public read communities"
  on communities for select
  using (deleted_at is null);

-- TEMPORARY — Step 2 sketch phase only. Anyone may draw a draft.
-- Replaced in Step 3 by: authenticated users only, stewards manage.
create policy "sketch phase: open draft drawing"
  on communities for insert
  with check (status = 'draft');

-- Households, profiles, memberships: NO policies yet.
-- With RLS on and no policy, these tables return nothing to anyone
-- through the API. The inner ring does not exist for outsiders —
-- locked by default until Step 3 writes the real rules.
