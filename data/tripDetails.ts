export type TripDetails = {
  busColour: string;
  description: string;
};

function storageKey(routeId: string, tripId?: string) {
  return `lagos-transit:vehicle:${tripId ? `trip:${tripId}` : routeId}`;
}

export function clearTripDetails(routeId: string, tripId?: string): boolean {
  try {
    sessionStorage.removeItem(storageKey(routeId, tripId));
    return true;
  } catch {
    return false;
  }
}

export function saveTripDetails(routeId: string, details: TripDetails, tripId?: string) {
  try {
    sessionStorage.setItem(storageKey(routeId, tripId), JSON.stringify(details));
  } catch {
    // The mock journey still works if browser storage is unavailable.
  }
}

export function readTripDetails(routeId: string, tripId?: string): TripDetails | null {
  try {
    const stored = sessionStorage.getItem(storageKey(routeId, tripId));
    if (!stored) return null;
    const details: unknown = JSON.parse(stored);
    if (typeof details !== "object" || details === null || !("busColour" in details) || !("description" in details)) return null;
    if (typeof details.busColour !== "string" || typeof details.description !== "string") return null;
    return { busColour: details.busColour.slice(0, 80), description: details.description.slice(0, 500) };
  } catch {
    return null;
  }
}
