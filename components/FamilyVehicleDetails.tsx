"use client";

import { useEffect, useState } from "react";
import { readTripDetails, type TripDetails } from "@/data/tripDetails";

export default function FamilyVehicleDetails({ routeId }: { routeId: string }) {
  const [details, setDetails] = useState<TripDetails | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDetails(readTripDetails(routeId));
    setLoaded(true);
  }, [routeId]);

  return (
    <section className="mt-5 rounded-xl border border-stone-200 p-4" aria-labelledby="vehicle-details-title">
      <h2 id="vehicle-details-title" className="font-semibold text-slate-900">Vehicle information</h2>
      <dl className="mt-3 space-y-3 text-sm">
        <div><dt className="text-slate-600">Bus colour</dt><dd className="mt-1 break-words font-medium text-slate-900">{loaded ? details?.busColour.trim() || "Not provided" : "Loading vehicle details…"}</dd></div>
        <div><dt className="text-slate-600">Driver or conductor description</dt><dd className="mt-1 whitespace-pre-wrap break-words font-medium text-slate-900">{loaded ? details?.description.trim() || "Not provided" : "Loading vehicle details…"}</dd></div>
      </dl>
      <p className="mt-3 text-xs text-slate-500">Details entered during Trip Setup in this browser tab. No details are shared with another person.</p>
    </section>
  );
}
