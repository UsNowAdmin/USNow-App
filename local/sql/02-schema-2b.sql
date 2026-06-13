-- ============================================================
-- UsNow Local — Step 2b: portal helper functions
-- Run in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- List all living communities as GeoJSON (smallest detail the page needs)
create or replace function list_communities()
returns table(id uuid, name text, notes text, status text, geojson text)
language sql stable as $$
  select c.id, c.name, c.notes, c.status, st_asgeojson(c.geom)
  from communities c
  where c.deleted_at is null
  order by c.created_at;
$$;

-- Draw a new draft community from the page
create or replace function add_community(p_name text, p_notes text, p_geojson text)
returns uuid language plpgsql as $$
declare new_id uuid;
begin
  insert into communities(name, notes, geom, status)
  values (p_name, nullif(p_notes,''),
          st_setsrid(st_geomfromgeojson(p_geojson), 4326), 'draft');
  select id into new_id from communities
    where name = p_name order by created_at desc limit 1;
  return new_id;
end;
$$;

-- Soft-remove: drafts only, nothing ever truly erased
create or replace function remove_community(p_id uuid)
returns void language sql as $$
  update communities set deleted_at = now()
  where id = p_id and status = 'draft' and deleted_at is null;
$$;

-- TEMPORARY — sketch phase only, replaced in Step 3:
-- drafts may be edited/retired by anyone (there are no accounts yet)
create policy "sketch phase: retire drafts"
  on communities for update
  using (status = 'draft')
  with check (status = 'draft');
