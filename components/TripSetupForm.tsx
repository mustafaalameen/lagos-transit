"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveTripDetails } from "@/data/tripDetails";
import { useAuth } from "@/components/AuthProvider";
import { createTrip } from "@/lib/supabase/trips";

export default function TripSetupForm({ routeSlug, databaseRouteId }: { routeSlug: string; databaseRouteId?: string }) {
  const router = useRouter();
  const [busColour, setBusColour] = useState("");
  const [description, setDescription] = useState("");
  const { session, loading } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || loading) return;
    if (!session) {
      setError("Please log in to save and start your trip.");
      return;
    }
    if (submitting.current || loading) return;
    if (!session) { setError("Please log in before starting a trip."); return; }
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      requestId.current ??= crypto.randomUUID();
      const trip = await createTrip({ id: requestId.current, userId: session.user.id, routeSlug, databaseRouteId, colour: busColour, description });
      saveTripDetails(routeSlug, { busColour: trip.vehicle_colour ?? "", description: trip.vehicle_description ?? "" }, trip.id);
      router.push(`/trip/active?route=${encodeURIComponent(routeSlug)}&trip=${encodeURIComponent(trip.id)}`);
    } catch {
      setError("We couldn’t start your trip. Your details are still here. Check your connection and try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset disabled={pending} className="space-y-5 disabled:opacity-60">
      <legend className="sr-only">Vehicle details</legend>
      <div>
        <label htmlFor="bus-colour" className="mb-2 block text-sm font-semibold text-slate-800">Bus colour <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="bus-colour" name="busColour" value={busColour} onChange={(event) => setBusColour(event.target.value)} maxLength={80} placeholder="e.g. Yellow with black stripes" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
      </div>
      <div>
        <label htmlFor="crew-description" className="mb-2 block text-sm font-semibold text-slate-800">Driver or conductor description <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id="crew-description" name="crewDescription" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows={3} placeholder="e.g. Conductor wearing a blue shirt" className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
      </div>
      <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50">{pending ? "Starting trip…" : "Start Trip"}</button>
      </fieldset>
      {!loading && !session && <p className="text-sm text-slate-600"><Link href="/login" className="font-semibold text-brand underline">Log in</Link> to save and start your trip.</p>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <p className="text-xs text-slate-500">Your trip is saved before the journey preview opens.</p>
    </form>
  );
}
