-- ============================================================
-- UsNow Local — Step 3b fix: reliable account-panel query
-- Run in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- The client-side memberships->communities join returns empty in some RLS
-- configurations even when the data and policies are correct. This function
-- returns the signed-in user's communities + roles directly and reliably,
-- the same pattern as list_communities(). The panel calls this instead.

create or replace function my_communities()
returns table(community_id uuid, name text, role_level int, status text)
language sql stable security definer set search_path = public as $$
  select m.community_id, c.name, m.role_level, m.status
  from memberships m
  join communities c on c.id = m.community_id
  where m.profile_id = auth.uid()
    and m.status = 'active'
    and c.deleted_at is null
  order by c.name;
$$;
