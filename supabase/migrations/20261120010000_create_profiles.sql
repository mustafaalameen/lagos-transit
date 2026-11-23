begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  accessibility_mode boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all privileges on table public.profiles from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name, phone, accessibility_mode) on table public.profiles to authenticated;

create policy profiles_read_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Auth creates the profile; clients cannot insert arbitrary profile identities.
create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone, accessibility_mode)
  values (
    new.id,
    left(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), 200),
    left(nullif(btrim(new.raw_user_meta_data ->> 'phone'), ''), 40),
    coalesce((new.raw_user_meta_data -> 'accessibility_mode') = 'true'::jsonb, false)
  );
  return new;
end;
$$;

revoke all privileges on function public.create_profile_for_new_user()
  from public, anon, authenticated;

create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

-- Give any existing Auth users the same one-to-one profile layer.
insert into public.profiles (id, full_name, phone, accessibility_mode)
select
  id,
  left(nullif(btrim(raw_user_meta_data ->> 'full_name'), ''), 200),
  left(nullif(btrim(raw_user_meta_data ->> 'phone'), ''), 40),
  coalesce((raw_user_meta_data -> 'accessibility_mode') = 'true'::jsonb, false)
from auth.users
on conflict (id) do nothing;

commit;
