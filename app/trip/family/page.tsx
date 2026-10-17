import Link from "next/link";
import { ArrowLeft, Battery, Map, MessageSquare, Phone } from "lucide-react";
import FamilyVehicleDetails from "@/components/FamilyVehicleDetails";
import { savedRoutes } from "@/data/routes";
import { mockJourneys } from "@/data/journeys";

export default async function FamilyTracking({ searchParams }: {
  searchParams: Promise<{ route?: string | string[] }>;
}) {
  const { route: routeId } = await searchParams;
  const route = savedRoutes.find((item) => item.id === routeId) ?? savedRoutes[0];
  const journey = mockJourneys[route.id as keyof typeof mockJourneys] ?? mockJourneys["yaba-obalende"];

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <Link href={`/trip/active?route=${encodeURIComponent(route.id)}`} className="mb-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"><ArrowLeft size={18} aria-hidden="true" /> Back to Active Trip</Link>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="family-title">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-brand">Lagos Transit Safety Companion</p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-brand">Demo</span>
          </div>
          <h1 id="family-title" className="mt-1 text-2xl font-bold text-slate-900">Family Tracking</h1>
          <p className="mt-2 text-sm text-slate-600">Read-only preview of a mock passenger journey.</p>
          <dl className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-stone-100 p-4 text-sm">
            <div><dt className="text-slate-600">Passenger · Mock</dt><dd className="mt-1 font-semibold text-slate-900">{journey.passengerName}</dd></div>
            <div><dt className="text-slate-600">Destination</dt><dd className="mt-1 font-semibold text-slate-900">{route.destination}</dd></div>
            <div><dt className="flex items-center gap-1 text-slate-600"><Battery size={16} aria-hidden="true" /> Battery · Mock</dt><dd className="mt-1 font-semibold text-slate-900">{journey.batteryPercentage}%</dd></div>
            <div><dt className="text-slate-600">ETA · Mock</dt><dd className="mt-1 font-semibold text-slate-900">{journey.etaMinutes} minutes to arrival</dd></div>
          </dl>
          <section aria-labelledby="family-map-title" className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-100 p-5 text-center">
            <Map size={32} className="mb-3 text-brand" aria-hidden="true" />
            <h2 id="family-map-title" className="font-semibold text-slate-900">Mock map placeholder</h2>
            <p className="mt-2 text-sm text-slate-600">{route.origin} → {route.destination}</p>
            <p className="mt-2 text-xs text-slate-500">No live location is displayed.</p>
          </section>
          <FamilyVehicleDetails key={route.id} routeId={route.id} />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" disabled aria-describedby="contact-demo-note" className="flex items-center justify-center gap-2 rounded-xl bg-stone-200 px-4 py-3 font-semibold text-slate-500 disabled:cursor-not-allowed"><MessageSquare size={18} aria-hidden="true" /> Message</button>
            <button type="button" disabled aria-describedby="contact-demo-note" className="flex items-center justify-center gap-2 rounded-xl bg-stone-200 px-4 py-3 font-semibold text-slate-500 disabled:cursor-not-allowed"><Phone size={18} aria-hidden="true" /> Call</button>
          </div>
          <p id="contact-demo-note" className="mt-2 text-xs text-slate-500">Message and Call are unavailable in this demo.</p>
          <p className="mt-5 text-xs leading-relaxed text-slate-500">Passenger, battery and ETA are fixed mock values. This preview does not track a person or share a trip.</p>
        </section>
      </div>
    </main>
  );
}
