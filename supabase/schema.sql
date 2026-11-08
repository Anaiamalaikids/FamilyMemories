-- Complete Clean Slate Setup for Supabase SQL Editor
-- Run this entire script in Supabase > SQL Editor

-- 1. Enable pgcrypto for secure bcrypt password hashing
create extension if not exists pgcrypto with schema extensions;

-- 2. Clean start: Drop existing table & function if they exist
drop table if exists members cascade;
drop function if exists santa_login(text, text);

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
       and (undrawn <> 2 or c.id = other                                        -- avoid a dead end:
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

-- 5. Seed the 11 Active Family Members (Hari Krishnan removed as requested)
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
