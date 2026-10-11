"use client";

import { useState, type FormEvent } from "react";

export default function TripSetupForm({ origin, destination }: { origin: string; destination: string }) {
  const [busColour, setBusColour] = useState("");
  const [description, setDescription] = useState("");
  const [started, setStarted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStarted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="bus-colour" className="mb-2 block text-sm font-semibold text-slate-800">Bus colour <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="bus-colour" name="busColour" value={busColour} onChange={(event) => { setBusColour(event.target.value); setStarted(false); }} maxLength={80} placeholder="e.g. Yellow with black stripes" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
      </div>
      <div>
        <label htmlFor="crew-description" className="mb-2 block text-sm font-semibold text-slate-800">Driver or conductor description <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id="crew-description" name="crewDescription" value={description} onChange={(event) => { setDescription(event.target.value); setStarted(false); }} maxLength={500} rows={3} placeholder="e.g. Conductor wearing a blue shirt" className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
      </div>
      <button type="submit" className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">Start Trip</button>
      <p className="text-xs text-slate-500">Start Trip shows a demo confirmation only.</p>
      {started && (
        <div role="status" className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-800">
          <p className="font-semibold">Demo trip started: {origin} → {destination}</p>
          <p className="mt-2">Bus colour: {busColour.trim() || "Not provided"}</p>
          <p className="mt-1 whitespace-pre-wrap break-words">Driver or conductor: {description.trim() || "Not provided"}</p>
          <p className="mt-2 text-slate-600">This is a local preview. No trip is being tracked or saved.</p>
        </div>
      )}
    </form>
  );
}
