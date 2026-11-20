-- Transport schema only. This migration deliberately inserts no transport data.
begin;

create table public.stops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  alternative_names text[],
  latitude double precision,
  longitude double precision,
  area text,
  created_at timestamptz not null default now(),
  constraint stops_name_not_blank check (btrim(name) <> ''),
  constraint stops_latitude_valid check (latitude between -90 and 90),
  constraint stops_longitude_valid check (longitude between -180 and 180)
);

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  origin_stop_id uuid not null references public.stops(id) on delete restrict,
  destination_stop_id uuid not null references public.stops(id) on delete restrict,
  transport_type text,
  estimated_min_fare integer,
  estimated_max_fare integer,
  estimated_duration_minutes integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint routes_name_not_blank check (btrim(name) <> ''),
  constraint routes_min_fare_nonnegative check (estimated_min_fare >= 0),
  constraint routes_max_fare_nonnegative check (estimated_max_fare >= 0),
  constraint routes_fare_range_valid check (estimated_min_fare <= estimated_max_fare),
  constraint routes_duration_nonnegative check (estimated_duration_minutes >= 0)
);

create table public.route_stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  stop_id uuid not null references public.stops(id) on delete restrict,
  stop_order integer not null,
  estimated_minutes_from_origin integer,
  constraint route_stops_route_order_unique unique (route_id, stop_order),
  constraint route_stops_order_positive check (stop_order >= 1),
  constraint route_stops_minutes_nonnegative check (estimated_minutes_from_origin >= 0)
);

-- Primary keys and the unique constraint already create their own indexes.
-- The composite unique index also supports lookups by route_id alone.
create index stops_name_idx on public.stops (name);
create index routes_origin_stop_id_idx on public.routes (origin_stop_id);
create index routes_destination_stop_id_idx on public.routes (destination_stop_id);
create index route_stops_stop_id_idx on public.route_stops (stop_id);

alter table public.stops enable row level security;
alter table public.routes enable row level security;
alter table public.route_stops enable row level security;

-- Remove any inherited default table grants before granting read-only access.
-- Schema usage permits access to these tables, not creation of schema objects.
revoke all privileges on table public.stops, public.routes, public.route_stops
  from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.stops, public.routes, public.route_stops
  to anon, authenticated;

create policy stops_public_read on public.stops
  for select to anon, authenticated using (true);

create policy routes_public_read on public.routes
  for select to anon, authenticated using (true);

create policy route_stops_public_read on public.route_stops
  for select to anon, authenticated using (true);

-- No INSERT, UPDATE, DELETE, or other write policies are created.
commit;
