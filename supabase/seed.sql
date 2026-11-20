-- Prototype examples only; fares and durations are approximate, not verified.
-- No coordinates, intermediate stops, or transfer instructions are supplied.
begin;

-- Names/endpoints are not unique in the general transport schema. Serialize
-- seed runs so the NOT EXISTS checks cannot race with another insertion.
lock table public.stops, public.routes in share row exclusive mode;

insert into public.stops (name)
select prototype.name
from (values ('Yaba'), ('Obalende'), ('CMS')) as prototype(name)
where not exists (
  select 1 from public.stops as existing where existing.name = prototype.name
);

with prototype_routes (name, destination_name, min_fare, max_fare, minutes) as (
  values
    ('Yaba → Obalende', 'Obalende', 300, 500, 45),
    ('Yaba → CMS', 'CMS', 250, 400, 35)
), resolved_routes as (
  select
    prototype.*,
    (select id from public.stops where name = 'Yaba') as origin_id,
    (select id from public.stops where name = prototype.destination_name) as destination_id
  from prototype_routes as prototype
)
insert into public.routes (
  name,
  origin_stop_id,
  destination_stop_id,
  estimated_min_fare,
  estimated_max_fare,
  estimated_duration_minutes
)
select name, origin_id, destination_id, min_fare, max_fare, minutes
from resolved_routes as prototype
where not exists (
  select 1
  from public.routes as existing
  where existing.origin_stop_id = prototype.origin_id
    and existing.destination_stop_id = prototype.destination_id
);

-- Unknown fields remain NULL; IDs, timestamps, and active use table defaults.
-- route_stops is deliberately left empty because stop sequences are unknown.
-- Ambiguous duplicate stop names cause scalar subqueries to fail and roll back
-- the transaction rather than guess which stop a route should reference.
commit;
