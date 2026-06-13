-- ============================================================
-- UsNow Local — Step 3: Accounts
-- Run in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. Every new signup automatically gets a profile row.
-- ------------------------------------------------------------
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- ------------------------------------------------------------
-- 2. Communities now record their creator automatically.
-- ------------------------------------------------------------
alter table communities alter column created_by set default auth.uid();

-- ------------------------------------------------------------
-- 3. The creator of a community automatically becomes its
--    first steward (role 60). Provenance + power, both recorded.
-- ------------------------------------------------------------
create or replace function grant_creator_stewardship()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.created_by is not null then
    insert into memberships (profile_id, community_id, role_level, status)
    values (new.created_by, new.id, 60, 'active')
    on conflict (profile_id, community_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger community_creator_steward_trg
after insert on communities
for each row execute function grant_creator_stewardship();

-- ------------------------------------------------------------
-- 4. Retire the sketch-phase training wheels.
-- ------------------------------------------------------------
drop policy "sketch phase: open draft drawing" on communities;
drop policy "sketch phase: retire drafts" on communities;

-- Signed-in members may draw drafts (and the row is theirs).
create policy "members draw drafts"
  on communities for insert to authenticated
  with check (status = 'draft' and created_by = auth.uid());

-- Only the creator or a steward of that community may change it.
create policy "creators and stewards manage"
  on communities for update to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1 from memberships m
      where m.community_id = communities.id
        and m.profile_id  = auth.uid()
        and m.role_level >= 60
        and m.status = 'active'
    )
  );

-- ------------------------------------------------------------
-- 5. Minimal personal-data policies: you may see and edit
--    yourself; your memberships are visible to you.
--    (Community-wide visibility rules arrive with vouching.)
-- ------------------------------------------------------------
create policy "read own profile"
  on profiles for select to authenticated
  using (id = auth.uid());

create policy "edit own profile"
  on profiles for update to authenticated
  using (id = auth.uid());

create policy "read own memberships"
  on memberships for select to authenticated
  using (profile_id = auth.uid());

-- ------------------------------------------------------------
-- 6. TEMPORARY — solo-phase helper, drop before real users:
--    areas drawn before accounts existed have no owner.
--    Calling this adopts every orphan as yours.
--    usage (after signing in via the page is not enough —
--    run from the page console or we wire a button):
--      select adopt_orphans();
-- ------------------------------------------------------------
create or replace function adopt_orphans()
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update communities set created_by = auth.uid()
  where created_by is null and deleted_at is null;
  get diagnostics n = row_count;
  insert into memberships (profile_id, community_id, role_level, status)
  select auth.uid(), id, 60, 'active' from communities
  where created_by = auth.uid()
  on conflict (profile_id, community_id) do nothing;
  return n;
end;
$$;
