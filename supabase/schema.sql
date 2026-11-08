-- Run this whole file in Supabase > SQL Editor
create extension if not exists pgcrypto with schema extensions;

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique not null,
  password_hash text not null,
  photo_url text,
  giving_to uuid unique references members(id),   -- unique = a person can be picked only once
  check (giving_to <> id)                          -- nobody gets themselves
);
alter table members enable row level security;     -- no policies: the public key can't read the table

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
     order by random() limit 1;
    update members set giving_to = cand where id = me.id;
    me.giving_to := cand;
  end if;

  select * into t from members where id = me.giving_to;
  return json_build_object('name', me.name, 'photo', me.photo_url,
         'target', json_build_object('name', t.name, 'photo', t.photo_url));
end $$;
grant execute on function santa_login(text, text) to anon;

-- Seed the 11 Family Members with their actual credentials
insert into members (name, phone, password_hash, photo_url) values
  ('Aadhi', '9361386647', crypt('sakthikarthikadithya', gen_salt('bf')), null),
  ('Sreedharan Kandavel', '6383659695', crypt('jeffnippard', gen_salt('bf')), null),
  ('Harikrishnan', '7695898730', crypt('harik1338', gen_salt('bf')), null),
  ('Brinda', '9344858175', crypt('brindakumar', gen_salt('bf')), null),
  ('Sathya', '9080636525', crypt('saththikumar', gen_salt('bf')), null),
  ('Shruthi', '7010151872', crypt('suruthijoke', gen_salt('bf')), null),
  ('Swarna Akshita', '7812854115', crypt('achudhandam', gen_salt('bf')), null),
  ('Sailoga Prakash', '6382896498', crypt('powerstar', gen_salt('bf')), null),
  ('Aadhu', '6383335626', crypt('aadhuiiii', gen_salt('bf')), null),
  ('Sarath Vikram', '7010043287', crypt('sree anna', gen_salt('bf')), null),
  ('Sakthi', '9344626769', crypt('adminlogin', gen_salt('bf')), null)
on conflict (phone) do update set
  password_hash = excluded.password_hash,
  name = excluded.name;
