-- ============================================================
-- UsNow Local — Step 3b patch: account panel query support
-- Run in Supabase: SQL Editor -> New query -> paste -> Run
-- ============================================================

-- Members may read all memberships in communities they belong to.
-- This powers the account panel's community + role list.
create policy "members read community memberships"
  on memberships for select to authenticated
  using (
    community_id in (
      select community_id from memberships
      where profile_id = auth.uid()
        and status = 'active'
    )
  );

-- Stewards may insert/update memberships in their communities.
-- This powers vouching (Step 3b proper) and role changes.
create policy "stewards manage memberships"
  on memberships for insert to authenticated
  with check (
    community_id in (
      select community_id from memberships
      where profile_id = auth.uid()
        and role_level >= 60
        and status = 'active'
    )
  );

create policy "stewards update memberships"
  on memberships for update to authenticated
  using (
    community_id in (
      select community_id from memberships
      where profile_id = auth.uid()
        and role_level >= 60
        and status = 'active'
    )
  );
