"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import type { MockJourney } from "@/data/journeys";

export default function ActiveTripPanel({ journey }: { journey: MockJourney }) {
  const [view, setView] = useState<"text" | "map">("text");
  const [alertShown, setAlertShown] = useState(false);

  return (
    <div>
      <div role="group" aria-label="Journey view" className="mb-4 flex gap-2 rounded-xl bg-stone-100 p-1">
        {(["text", "map"] as const).map((option) => (
          <button key={option} type="button" aria-pressed={view === option} aria-controls="journey-view" onClick={() => setView(option)} className={`flex-1 rounded-lg px-3 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${view === option ? "bg-brand text-white" : "text-slate-700 hover:bg-stone-200"}`}>
            {option === "text" ? "Text Updates" : "Map View"}
          </button>
        ))}
      </div>
      <section id="journey-view" className="rounded-xl border border-stone-200 p-4" aria-label={view === "text" ? "Text updates" : "Map placeholder"}>
        {view === "text" ? (
          <><h2 className="font-semibold text-slate-900">Latest update · Mock</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{journey.latestUpdate}</p></>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-lg bg-stone-100 p-4 text-center">
            <h2 className="font-semibold text-slate-900">Map View placeholder</h2>
            <p className="mt-2 text-sm text-slate-600">A map preview will appear here in a later stage. No location data is used.</p>
          </div>
        )}
      </section>
      <dl className="my-5 grid grid-cols-2 gap-4 rounded-xl bg-blue-50 p-4 text-sm">
        <div><dt className="text-slate-600">Next stop · Mock</dt><dd className="mt-1 font-semibold text-slate-900">{journey.nextStop}</dd></div>
        <div><dt className="text-slate-600">Estimated time to next stop</dt><dd className="mt-1 font-semibold text-slate-900">{journey.minutesToNextStop} minutes</dd></div>
      </dl>
      <button type="button" onClick={() => setAlertShown(true)} aria-describedby="emergency-demo-note" className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-4 font-bold text-white hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"><TriangleAlert size={22} aria-hidden="true" /> Emergency alert · Demo</button>
      <p id="emergency-demo-note" className="mt-2 text-xs text-slate-500">Demo only. This button does not contact emergency services or notify anyone.</p>
      {alertShown && <div role="status" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">Demo emergency button pressed. No alert was sent and no emergency action was taken.</div>}
    </div>
  );
}
