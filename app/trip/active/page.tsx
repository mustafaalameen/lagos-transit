import Link from "next/link";
import { ArrowLeft, BusFront } from "lucide-react";
import ActiveTripPanel from "@/components/ActiveTripPanel";
import { savedRoutes } from "@/data/routes";
import { mockJourneys } from "@/data/journeys";

export default async function ActiveTrip({ searchParams }: {
  searchParams: Promise<{ route?: string | string[] }>;
}) {
  const { route: routeId } = await searchParams;
  const route = savedRoutes.find((item) => item.id === routeId) ?? savedRoutes[0];
  const journey = mockJourneys[route.id as keyof typeof mockJourneys] ?? mockJourneys["yaba-obalende"];

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <Link href={`/trip/setup?route=${encodeURIComponent(route.id)}`} className="mb-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <ArrowLeft size={18} aria-hidden="true" /> Back to Trip Setup
        </Link>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="active-trip-title">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-brand">Lagos Transit Safety Companion</p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-brand">Demo</span>
          </div>
          <h1 id="active-trip-title" className="mt-1 text-2xl font-bold text-slate-900">Active Trip</h1>
          <div className="my-6 rounded-xl bg-stone-100 p-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><BusFront size={21} className="text-brand" aria-hidden="true" /> {route.origin} → {route.destination}</h2>
            <p className="mt-2 text-sm text-slate-600">Estimated total: {route.estimatedMinutes} minutes · {route.fareRange} · {route.stops} stops</p>
          </div>
          <label htmlFor="journey-progress" className="mb-2 flex justify-between text-sm font-semibold text-slate-800"><span>Mock journey progress</span><span>{journey.progress}%</span></label>
          <progress id="journey-progress" max={100} value={journey.progress} className="mb-6 h-3 w-full overflow-hidden rounded-full accent-brand" />
          <ActiveTripPanel key={route.id} journey={journey} />
          <p className="mt-5 text-xs leading-relaxed text-slate-500">All journey information is mock data. Progress and updates are fixed examples, with no live tracking.</p>
        </section>
      </div>
    </main>
  );
}
