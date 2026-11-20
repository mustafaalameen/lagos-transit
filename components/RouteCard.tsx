import { ChevronRight, BusFront } from "lucide-react";
import Link from "next/link";
import { getSetupRouteId, type TransportRoute } from "@/lib/supabase/routes";

export default function RouteCard({ route }: { route: TransportRoute }) {
  const setupRouteId = getSetupRouteId(route);
  const duration = route.estimated_duration_minutes === null ? "Duration unavailable" : `~${route.estimated_duration_minutes} min`;
  const minFare = route.estimated_min_fare;
  const maxFare = route.estimated_max_fare;
  const fare = minFare !== null && maxFare !== null ? `₦${minFare}–${maxFare}` : minFare !== null ? `From ₦${minFare}` : maxFare !== null ? `Up to ₦${maxFare}` : "Fare unavailable";
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand"><BusFront size={21} aria-hidden="true" /></div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{route.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{duration} · {fare}</p>
        {!setupRouteId && <p className="mt-1 text-xs text-slate-500">Trip Setup is not available for this route yet.</p>}
      </div>
      {setupRouteId && <ChevronRight size={18} className="text-slate-500" aria-hidden="true" />}
    </>
  );

  if (!setupRouteId) return <article className="flex items-center gap-3 rounded-xl bg-stone-100 p-4">{content}</article>;

  return <Link href={`/trip/setup?route=${encodeURIComponent(setupRouteId)}`} className="flex items-center gap-3 rounded-xl bg-stone-100 p-4 transition-colors hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{content}</Link>;
}
