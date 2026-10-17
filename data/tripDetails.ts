export type TripDetails = {
  busColour: string;
  description: string;
};

export function clearTripDetails(routeId: string): boolean {
  try {
    sessionStorage.removeItem(`lagos-transit:vehicle:${routeId}`);
    return true;
  } catch {
    return false;
  }
}

export function saveTripDetails(routeId: string, details: TripDetails) {
  try {
    sessionStorage.setItem(`lagos-transit:vehicle:${routeId}`, JSON.stringify(details));
  } catch {
    // The mock journey still works if browser storage is unavailable.
  }
}

export function readTripDetails(routeId: string): TripDetails | null {
  try {
    const stored = sessionStorage.getItem(`lagos-transit:vehicle:${routeId}`);
    if (!stored) return null;
    const details: unknown = JSON.parse(stored);
    if (typeof details !== "object" || details === null || !("busColour" in details) || !("description" in details)) return null;
    if (typeof details.busColour !== "string" || typeof details.description !== "string") return null;
    return { busColour: details.busColour.slice(0, 80), description: details.description.slice(0, 500) };
  } catch {
    return null;
  }
}
