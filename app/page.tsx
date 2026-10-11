import { ShieldCheck } from "lucide-react";
import DestinationSearch from "@/components/DestinationSearch";
import RouteCard from "@/components/RouteCard";
import { savedRoutes } from "@/data/routes";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white"><ShieldCheck aria-hidden="true" size={24} /></div>
          <div><p className="text-sm font-semibold text-brand">Lagos Transit</p><h1 className="text-xl font-bold tracking-tight text-slate-900">Safety Companion</h1></div>
        </header>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="welcome">
          <div className="mb-6"><p className="text-sm text-slate-500">Good morning</p><h2 id="welcome" className="text-2xl font-bold text-slate-900">Welcome aboard</h2></div>
          <DestinationSearch />
          <div className="mb-3 mt-8 flex items-center justify-between"><h2 className="font-semibold text-slate-900">Saved routes</h2><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-brand">Demo</span></div>
          <div className="space-y-3">{savedRoutes.map((route) => <RouteCard key={route.id} route={route} />)}</div>
          <p className="mt-5 text-xs leading-relaxed text-slate-500">Sample fares and times are from the design preview and have not been independently verified. Route search and live tracking will be added later.</p>
        </section>
        <p className="mt-6 text-center text-xs text-slate-500">Day 1 starter · Interface only · No GPS or family tracking yet</p>
      </div>
    </main>
  );
}
