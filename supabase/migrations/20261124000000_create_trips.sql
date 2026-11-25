begin;

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  route_id uuid not null references public.routes(id) on delete restrict,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  expected_arrival_at timestamptz,
  vehicle_colour text,
  vehicle_description text,
  share_token text unique,
  created_at timestamptz not null default now(),
  constraint trips_status_valid check (status in ('active', 'completed', 'cancelled')),
  constraint trips_end_time_valid check (ended_at >= started_at),
  constraint trips_expected_time_valid check (expected_arrival_at >= started_at),
  constraint trips_status_end_consistent check (
    (status = 'active' and ended_at is null)
    or (status in ('completed', 'cancelled') and ended_at is not null)
  )
);

create index trips_user_started_at_idx on public.trips (user_id, started_at desc);
create index trips_route_id_idx on public.trips (route_id);

alter table public.trips enable row level security;
revoke all privileges on table public.trips from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.trips to authenticated;
grant insert (id, user_id, route_id, vehicle_colour, vehicle_description)
  on table public.trips to authenticated;
grant update (status, vehicle_colour, vehicle_description, expected_arrival_at)
  on table public.trips to authenticated;

create policy trips_insert_own on public.trips
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'active'
    and exists (select 1 from public.routes where routes.id = trips.route_id and routes.active)
  );

create policy trips_read_own on public.trips
  for select to authenticated using ((select auth.uid()) = user_id);

create policy trips_update_own on public.trips
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- The database owns completion time; repeat completion preserves the first time.
create function public.set_trip_end_time()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.status <> 'active' then
    if new.status <> old.status then
      raise exception 'An ended trip cannot change status.';
    end if;
    new.ended_at := old.ended_at;
  elsif new.status in ('completed', 'cancelled') then
    new.ended_at := now();
  else
    new.ended_at := null;
  end if;
  return new;
end;
$$;
revoke all privileges on function public.set_trip_end_time() from public, anon, authenticated;
create trigger trips_set_end_time before update on public.trips
  for each row execute function public.set_trip_end_time();

commit;
