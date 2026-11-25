import { getSupabase } from "./client";
import { fetchActiveRoutes, getSetupRouteId, type TransportRoute } from "./routes";

export type Trip = {
  id: string;
  user_id: string;
  route_id: string;
  status: "active" | "completed" | "cancelled";
  started_at: string;
  ended_at: string | null;
  expected_arrival_at: string | null;
  vehicle_colour: string | null;
  vehicle_description: string | null;
  share_token: string | null;
  created_at: string;
  route: TransportRoute | null;
};

const fields = "id,user_id,route_id,status,started_at,ended_at,expected_arrival_at,vehicle_colour,vehicle_description,share_token,created_at,route:routes!trips_route_id_fkey(id,name,estimated_duration_minutes,estimated_min_fare,estimated_max_fare,origin:stops!routes_origin_stop_id_fkey(name),destination:stops!routes_destination_stop_id_fkey(name))";
const timeout = () => AbortSignal.timeout(15000);

async function findTrip(id: string, signal: AbortSignal = timeout()): Promise<Trip | null> {
  const { data, error } = await getSupabase().from("trips").select(fields).eq("id", id).abortSignal(signal).maybeSingle<Trip>();
  if (error) throw new Error("Trip request failed.");
  return data;
}

export async function fetchTrip(id: string, signal?: AbortSignal): Promise<Trip> {
  const trip = await findTrip(id, signal);
  if (!trip || !trip.route) throw new Error("Trip is unavailable.");
  return trip;
}

export async function createTrip(input: {
  id: string; userId: string; routeSlug: string; databaseRouteId?: string;
  colour: string; description: string;
}): Promise<Trip> {
  const client = getSupabase();
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user || user.id !== input.userId) throw new Error("Please log in again.");

  const routes = await fetchActiveRoutes(timeout());
  const matches = routes.filter(route => getSetupRouteId(route) === input.routeSlug && (!input.databaseRouteId || route.id === input.databaseRouteId));
  if (matches.length !== 1) throw new Error("The selected route is unavailable.");
  const routeId = matches[0].id;

  // Reuse the request identity if an earlier insert committed but its reply was lost.
  const existing = await findTrip(input.id);
  if (existing) {
    if (existing.user_id !== user.id || existing.route_id !== routeId || existing.status !== "active") throw new Error("Trip request is no longer active.");
    return existing;
  }
  const { data, error } = await client.from("trips").insert({
    id: input.id,
    user_id: user.id,
    route_id: routeId,
    vehicle_colour: input.colour.trim() || null,
    vehicle_description: input.description.trim() || null,
  }).select(fields).abortSignal(timeout()).single<Trip>();
  if (error || !data) {
    if (error?.code === "23505") {
      const retry = await fetchTrip(input.id);
      if (retry.user_id === user.id && retry.route_id === routeId && retry.status === "active") return retry;
    }
    throw new Error("Trip creation failed.");
  }
  return data;
}

export async function completeTrip(id: string, routeSlug: string): Promise<Trip> {
  const current = await fetchTrip(id);
  if (!current.route || getSetupRouteId(current.route) !== routeSlug) throw new Error("Trip route does not match.");
  if (current.status === "completed" && current.ended_at) return current;
  if (current.status !== "active") throw new Error("This trip cannot be completed.");
  const { data, error } = await getSupabase().from("trips")
    .update({ status: "completed" }).eq("id", id).eq("status", "active")
    .select(fields).abortSignal(timeout()).maybeSingle<Trip>();
  if (error) throw new Error("Trip completion failed.");
  const completed = data ?? await fetchTrip(id);
  if (completed.status !== "completed" || !completed.ended_at) throw new Error("Trip completion was not confirmed.");
  return completed;
}
