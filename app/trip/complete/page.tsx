import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { savedRoutes } from "@/data/routes";

export default async function TripComplete({ searchParams }: {
  searchParams: Promise<{ route?: string | string[] }>;
}) {
  const { route: routeId } = await searchParams;
  const route = savedRoutes.find((item) => item.id === routeId) ?? savedRoutes[0];

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm sm:p-7" aria-labelledby="trip-complete-title">
          <p className="text-sm font-semibold text-brand">Lagos Transit Safety Companion</p>
          <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-brand">Demo</span>
          <CircleCheck size={48} className="mx-auto my-5 text-brand" aria-hidden="true" />
          <h1 id="trip-complete-title" className="text-2xl font-bold text-slate-900">Trip completed</h1>
          <p className="mt-2 text-sm text-slate-600">Your mock journey is complete.</p>
          <section className="my-6 rounded-xl bg-stone-100 p-4 text-left" aria-labelledby="completed-route-title">
            <h2 id="completed-route-title" className="font-semibold text-slate-900">Selected route</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-slate-600">Origin</dt><dd className="mt-1 font-semibold text-slate-900">{route.origin}</dd></div>
              <div><dt className="text-slate-600">Destination</dt><dd className="mt-1 font-semibold text-slate-900">{route.destination}</dd></div>
            </dl>
          </section>
          <Link href="/" className="block rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">Back to Home</Link>
          <p className="mt-5 text-xs leading-relaxed text-slate-500">This is a mock completion screen. Arrival has not been verified and no trip history is saved.</p>
        </section>
      </div>
    </main>
  );
}
