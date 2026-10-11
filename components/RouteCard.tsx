import { ChevronRight, BusFront } from "lucide-react";
import Link from "next/link";
import type { SavedRoute } from "@/data/routes";
export default function RouteCard({ route }: { route: SavedRoute }) {
  return (
    <Link href={`/trip/setup?route=${encodeURIComponent(route.id)}`} className="flex items-center gap-3 rounded-xl bg-stone-100 p-4 transition-colors hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand"><BusFront size={21} aria-hidden="true" /></div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{route.origin} → {route.destination}</h3>
        <p className="mt-1 text-sm text-slate-600">~{route.estimatedMinutes} min · {route.fareRange}</p>
      </div>
      <ChevronRight size={18} className="text-slate-500" aria-hidden="true" />
    </Link>
  );
}
