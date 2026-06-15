-- ============================================================
-- UsNow Local — Step 3c: Vouching (the loop, single-approval)
-- Run in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================
-- Request to join a community you don't own -> steward sees it ->
-- steward approves at a chosen role, or declines. Role ladder activates.
-- Multi-approval consensus (2 stewards / 2 vouches) is the NEXT pass.

-- A pending join request is just a membership row with status 'pending'
-- and role_level 0 (unset). Approval sets status 'active' + the chosen role.
-- (memberships.status already allows 'pending'/'active'/'removed';
--  role_level check must allow 0 as "unset/pending".)

alter table memberships drop constraint if exists memberships_role_level_check;
alter table memberships add constraint memberships_role_level_check
  check (role_level in (0,10,20,30,40,50,60));

-- ------------------------------------------------------------
-- 1. Request to join a community (creates a pending membership).
-- ------------------------------------------------------------
create or replace function request_join(p_community uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into memberships (profile_id, community_id, role_level, status)
  values (auth.uid(), p_community, 0, 'pending')
  on conflict (profile_id, community_id) do nothing
  returning id into new_id;
  return new_id;
end;
$$;

-- ------------------------------------------------------------
-- 2. A steward of a community sees its pending requests.
-- ------------------------------------------------------------
create or replace function pending_requests(p_community uuid)
returns table(membership_id uuid, profile_id uuid, display_name text, requested_at timestamptz)
language sql stable security definer set search_path = public as $$
  select m.id, m.profile_id, p.display_name, m.created_at
  from memberships m
  join profiles p on p.id = m.profile_id
  where m.community_id = p_community
    and m.status = 'pending'
    and exists (
      select 1 from memberships s
      where s.community_id = p_community
        and s.profile_id = auth.uid()
        and s.role_level >= 60
        and s.status = 'active'
    )
  order by m.created_at;
$$;

-- How many pending requests across all communities I steward (for the badge).
create or replace function my_pending_count()
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int
  from memberships m
  where m.status = 'pending'
    and m.community_id in (
      select community_id from memberships
      where profile_id = auth.uid() and role_level >= 60 and status = 'active'
    );
$$;

-- ------------------------------------------------------------
-- 3. Steward approves a request at a chosen role, or declines.
--    Only a role-60 steward of that community may act.
-- ------------------------------------------------------------
create or replace function approve_request(p_membership uuid, p_role int)
returns void language plpgsql security definer set search_path = public as $$
declare c uuid;
begin
  select community_id into c from memberships where id = p_membership;
  if not exists (
    select 1 from memberships s
    where s.community_id = c and s.profile_id = auth.uid()
      and s.role_level >= 60 and s.status = 'active'
  ) then raise exception 'not a steward of this community'; end if;
  if p_role not in (20,30,40,50,60) then raise exception 'invalid role'; end if;
  update memberships
    set role_level = p_role, status = 'active', vouched_by = auth.uid()
    where id = p_membership and status = 'pending';
end;
$$;

create or replace function decline_request(p_membership uuid)
returns void language plpgsql security definer set search_path = public as $$
declare c uuid;
begin
  select community_id into c from memberships where id = p_membership;
  if not exists (
    select 1 from memberships s
    where s.community_id = c and s.profile_id = auth.uid()
      and s.role_level >= 60 and s.status = 'active'
  ) then raise exception 'not a steward of this community'; end if;
  update memberships set status = 'removed'
    where id = p_membership and status = 'pending';
end;
$$;

-- Note: my_communities() already filters status='active', so a pending
-- request won't show as one of "your communities" until approved. Good.
