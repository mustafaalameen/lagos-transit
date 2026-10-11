import Link from "next/link";
import { ArrowLeft, BusFront } from "lucide-react";
import TripSetupForm from "@/components/TripSetupForm";
import { savedRoutes } from "@/data/routes";

export default async function TripSetup({
  searchParams,
}: {
  searchParams: Promise<{ route?: string | string[] }>;
}) {
  const { route: routeId } = await searchParams;
  const route = savedRoutes.find((item) => item.id === routeId) ?? savedRoutes[0];

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <ArrowLeft size={18} aria-hidden="true" /> Back to Home
        </Link>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="trip-setup-title">
          <p className="text-sm font-semibold text-brand">Lagos Transit Safety Companion</p>
          <h1 id="trip-setup-title" className="mt-1 text-2xl font-bold text-slate-900">Trip Setup</h1>
          <p className="mt-2 text-sm text-slate-600">Review your route and add details about your bus.</p>

          <section className="my-6 rounded-xl bg-stone-100 p-4" aria-labelledby="route-summary-title">
            <h2 id="route-summary-title" className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
              <BusFront size={21} className="text-brand" aria-hidden="true" /> Route summary
              <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-brand">Demo</span>
            </h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-slate-600">Origin</dt><dd className="mt-1 font-semibold text-slate-900">{route.origin}</dd></div>
              <div><dt className="text-slate-600">Destination</dt><dd className="mt-1 font-semibold text-slate-900">{route.destination}</dd></div>
              <div><dt className="text-slate-600">Estimated duration</dt><dd className="mt-1 font-semibold text-slate-900">{route.estimatedMinutes} minutes</dd></div>
              <div><dt className="text-slate-600">Estimated fare</dt><dd className="mt-1 font-semibold text-slate-900">{route.fareRange}</dd></div>
              <div><dt className="text-slate-600">Number of stops</dt><dd className="mt-1 font-semibold text-slate-900">{route.stops}</dd></div>
            </dl>
          </section>

          <TripSetupForm key={route.id} origin={route.origin} destination={route.destination} />
          <p className="mt-5 text-xs leading-relaxed text-slate-500">All route details are mock data and have not been verified. Vehicle details stay on this page and reset when you reload.</p>
        </section>
      </div>
    </main>
  );
}
