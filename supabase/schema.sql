-- Complete Clean Slate Setup for Supabase SQL Editor
-- Run this entire script in Supabase > SQL Editor

-- 1. Enable pgcrypto for secure bcrypt password hashing
create extension if not exists pgcrypto with schema extensions;

-- 2. Clean start: Drop existing table & functions
drop table if exists members cascade;
drop function if exists santa_login(text, text);
drop function if exists admin_get_members(text);
drop function if exists admin_reset_all_draws(text);
drop function if exists admin_reset_single_draw(text, uuid);
drop function if exists admin_add_member(text, text, text, text, text);
drop function if exists admin_remove_member(text, uuid);

-- 3. Create members table
create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique not null,
  password_hash text not null,
  photo_url text,
  giving_to uuid unique references members(id),   -- unique = a person can be picked only once
  check (giving_to <> id)                          -- nobody gets themselves
);

alter table members enable row level security;     -- no policies: public key can't read directly

-- 4. Create the secure login and draw function with relationship weighting
create or replace function santa_login(p_phone text, p_password text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare me members; t members; cand uuid; other uuid; undrawn int;
begin
  select * into me from members where phone = p_phone and password_hash = crypt(p_password, password_hash);
  if not found then return null; end if;

  perform pg_advisory_xact_lock(42);               -- one draw at a time
  select * into me from members where id = me.id;
  if me.giving_to is null then
    select count(*) into undrawn from members where giving_to is null;
    select id into other from members where giving_to is null and id <> me.id limit 1;
    select c.id into cand from members c
     where c.id <> me.id
       and not exists (select 1 from members x where x.giving_to = c.id)        -- not already assigned
       and (undrawn <> 2 or c.id = other                                        -- avoid a dead end
            or exists (select 1 from members x where x.giving_to = other))      -- last giver never left with themselves
     order by 
       -ln(greatest(random(), 0.00001)) / 
       case 
         -- 70% reduced probability (0.30 weight) for close siblings / cousin pairs:
         when (me.name = 'Aadhi' and c.name = 'Sakthi') or (me.name = 'Sakthi' and c.name = 'Aadhi') then 0.30
         when (me.name = 'Aadhu' and c.name = 'Sarath Vikram') or (me.name = 'Sarath Vikram' and c.name = 'Aadhu') then 0.30
         when (me.name = 'Swarna Akshita' and c.name = 'Shruthi') or (me.name = 'Shruthi' and c.name = 'Swarna Akshita') then 0.30
         else 1.00
       end
     limit 1;

    update members set giving_to = cand where id = me.id;
    me.giving_to := cand;
  end if;

  select * into t from members where id = me.giving_to;
  return json_build_object('name', me.name, 'photo', me.photo_url,
         'target', json_build_object('name', t.name, 'photo', t.photo_url));
end $$;

grant execute on function santa_login(text, text) to anon;

-- ====================================================
-- 5. SECURE ADMIN CONTROL PANEL RPC FUNCTIONS
-- Protected by Admin Sakthi's password ('adminlogin')
-- ====================================================

-- 5A. Admin: Get all members & live draw status
create or replace function admin_get_members(p_admin_pw text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare admin_valid boolean;
begin
  select exists (
    select 1 from members 
    where phone = '9344626769' 
      and password_hash = crypt(p_admin_pw, password_hash)
  ) into admin_valid;
  
  if not admin_valid and p_admin_pw <> 'adminlogin' then
    return json_build_object('error', 'Unauthorized: Invalid Admin Password');
  end if;

  return (
    select json_agg(
      json_build_object(
        'id', m.id,
        'name', m.name,
        'phone', m.phone,
        'photo_url', m.photo_url,
        'has_drawn', (m.giving_to is not null),
        'target_name', t.name
      ) order by m.name
    )
    from members m
    left join members t on m.giving_to = t.id
  );
end $$;
grant execute on function admin_get_members(text) to anon;

-- 5B. Admin: Reset all Secret Santa draws to fresh (giving_to = null)
create or replace function admin_reset_all_draws(p_admin_pw text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare admin_valid boolean;
begin
  select exists (
    select 1 from members 
    where phone = '9344626769' 
      and password_hash = crypt(p_admin_pw, password_hash)
  ) into admin_valid;
  
  if not admin_valid and p_admin_pw <> 'adminlogin' then
    return json_build_object('error', 'Unauthorized');
  end if;

  update members set giving_to = null;
  return json_build_object('success', true, 'message', 'All draws successfully reset to fresh!');
end $$;
grant execute on function admin_reset_all_draws(text) to anon;

-- 5C. Admin: Reset single member draw
create or replace function admin_reset_single_draw(p_admin_pw text, p_member_id uuid)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare admin_valid boolean;
begin
  select exists (
    select 1 from members 
    where phone = '9344626769' 
      and password_hash = crypt(p_admin_pw, password_hash)
  ) into admin_valid;
  
  if not admin_valid and p_admin_pw <> 'adminlogin' then
    return json_build_object('error', 'Unauthorized');
  end if;

  update members set giving_to = null where id = p_member_id;
  return json_build_object('success', true);
end $$;
grant execute on function admin_reset_single_draw(text, uuid) to anon;

-- 5D. Admin: Add new member to database
create or replace function admin_add_member(p_admin_pw text, p_name text, p_phone text, p_password text, p_photo text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare admin_valid boolean;
begin
  select exists (
    select 1 from members 
    where phone = '9344626769' 
      and password_hash = crypt(p_admin_pw, password_hash)
  ) into admin_valid;
  
  if not admin_valid and p_admin_pw <> 'adminlogin' then
    return json_build_object('error', 'Unauthorized');
  end if;

  insert into members (name, phone, password_hash, photo_url)
  values (
    p_name,
    p_phone,
    crypt(p_password, gen_salt('bf')),
    coalesce(nullif(p_photo, ''), '/santa_shh.jpg')
  )
  on conflict (phone) do update set
    name = excluded.name,
    password_hash = excluded.password_hash,
    photo_url = excluded.photo_url;

  return json_build_object('success', true, 'message', 'Member added/updated successfully!');
end $$;
grant execute on function admin_add_member(text, text, text, text, text) to anon;

-- 5E. Admin: Remove member from database
create or replace function admin_remove_member(p_admin_pw text, p_member_id uuid)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare admin_valid boolean;
begin
  select exists (
    select 1 from members 
    where phone = '9344626769' 
      and password_hash = crypt(p_admin_pw, password_hash)
  ) into admin_valid;
  
  if not admin_valid and p_admin_pw <> 'adminlogin' then
    return json_build_object('error', 'Unauthorized');
  end if;

  -- First remove any references to this member as a target
  update members set giving_to = null where giving_to = p_member_id;
  delete from members where id = p_member_id;

  return json_build_object('success', true, 'message', 'Member removed successfully!');
end $$;
grant execute on function admin_remove_member(text, uuid) to anon;

-- 6. Seed the 11 Active Family Members (Hari Krishnan removed)
insert into members (name, phone, password_hash, photo_url) values
  ('Aadhi', '9361386647', crypt('sakthikarthikadithya', gen_salt('bf')), '/elves/aadhi.jpg'),
  ('Sreedharan Kandavel', '6383659695', crypt('jeffnippard', gen_salt('bf')), '/elves/sreedharan.jpg'),
  ('Brinda', '9344858175', crypt('brindakumar', gen_salt('bf')), '/elves/brinda.jpg'),
  ('Sathya', '9080636525', crypt('saththikumar', gen_salt('bf')), '/elves/sathya.jpg'),
  ('Shruthi', '7010151872', crypt('suruthijoke', gen_salt('bf')), '/elves/shruthi.jpg'),
  ('Swarna Akshita', '7812854115', crypt('achudhandam', gen_salt('bf')), '/elves/achu.jpg'),
  ('Sailoga Prakash', '6382896498', crypt('powerstar', gen_salt('bf')), '/elves/sailoga.jpg'),
  ('Aadhu', '6383335626', crypt('aadhuiiii', gen_salt('bf')), '/elves/aadhu.jpg'),
  ('Sarath Vikram', '7010043287', crypt('sree anna', gen_salt('bf')), '/elves/sarath.jpg'),
  ('Srenithi', '9080369299', crypt('srenithi2026', gen_salt('bf')), '/elves/srenithi.jpg'),
  ('Sakthi', '9344626769', crypt('adminlogin', gen_salt('bf')), '/elves/sakthi.jpg');
