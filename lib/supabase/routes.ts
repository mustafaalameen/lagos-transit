import { getSupabase } from "./client";

export type TransportRoute = {
  id: string;
  name: string;
  estimated_duration_minutes: number | null;
  estimated_min_fare: number | null;
  estimated_max_fare: number | null;
  origin: { name: string } | null;
  destination: { name: string } | null;
};

// Bridge database records to the existing mock trip flow, not card data.
export function getSetupRouteId(route: TransportRoute): string | null {
  if (route.origin?.name !== "Yaba") return null;
  if (route.destination?.name === "Obalende") return "yaba-obalende";
  if (route.destination?.name === "CMS") return "yaba-cms";
  return null;
}

export async function fetchActiveRoutes(signal: AbortSignal): Promise<TransportRoute[]> {
  const { data, error } = await getSupabase()
    .from("routes")
    .select("id,name,estimated_duration_minutes,estimated_min_fare,estimated_max_fare,origin:stops!routes_origin_stop_id_fkey(name),destination:stops!routes_destination_stop_id_fkey(name)")
    .eq("active", true)
    .order("name")
    .abortSignal(signal)
    .returns<TransportRoute[]>();

  if (error || !data) throw new Error("Unable to load active routes.");
  return data;
}
