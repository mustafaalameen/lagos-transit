"use client";
import { useState } from "react";
import { Search } from "lucide-react";
export default function DestinationSearch() {
  const [destination, setDestination] = useState("");
  return (
    <div>
      <label htmlFor="destination" className="mb-2 block text-sm font-semibold text-slate-800">Where are you headed?</label>
      <div className="relative">
        <Search aria-hidden="true" size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Obalende" autoComplete="off" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
      </div>
      {destination.trim() && <p className="mt-2 text-xs text-slate-500" role="status">Route search will be connected in a later stage.</p>}
    </div>
  );
}
