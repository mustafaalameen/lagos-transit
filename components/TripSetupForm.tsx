"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function TripSetupForm({ routeId }: { routeId: string }) {
  const router = useRouter();
  const [busColour, setBusColour] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/trip/active?route=${encodeURIComponent(routeId)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="bus-colour" className="mb-2 block text-sm font-semibold text-slate-800">Bus colour <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="bus-colour" name="busColour" value={busColour} onChange={(event) => setBusColour(event.target.value)} maxLength={80} placeholder="e.g. Yellow with black stripes" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
      </div>
      <div>
        <label htmlFor="crew-description" className="mb-2 block text-sm font-semibold text-slate-800">Driver or conductor description <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id="crew-description" name="crewDescription" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows={3} placeholder="e.g. Conductor wearing a blue shirt" className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
      </div>
      <button type="submit" className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">Start Trip</button>
      <p className="text-xs text-slate-500">Start Trip opens a mock journey preview. Vehicle details are not carried into the preview.</p>
    </form>
  );
}
