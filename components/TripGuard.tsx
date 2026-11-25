"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchTrip, type Trip } from "@/lib/supabase/trips";
import { getSetupRouteId } from "@/lib/supabase/routes";

export default function TripGuard({ tripId, routeSlug, stage, children }: {
  tripId?: string; routeSlug: string; stage: "active" | "complete" | "preview"; children: ReactNode;
}) {
  const { session, loading, error: authError } = useAuth();
  const userId = session?.user.id;
  const [state, setState] = useState<{ owner?: string; trip?: Trip; error?: boolean }>({});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!tripId || !userId) return;
    let cancelled = false;
    const controller = new AbortController();
    setState({});
    fetchTrip(tripId, controller.signal).then(trip => {
      if (!cancelled) setState({ owner: userId, trip });
    }).catch(() => { if (!cancelled) setState({ owner: userId, error: true }); });
    const timer = setTimeout(() => controller.abort(), 15000);
    return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [tripId, userId, attempt]);

  if (!tripId) return children;
  let content: ReactNode;
  if (loading) content = <p role="status">Checking account…</p>;
  else if (!session || authError) content = <p>Please <Link href="/login" className="font-semibold text-brand underline">log in</Link> to view this trip.</p>;
  else if (state.owner !== userId) content = <p role="status">Loading your trip…</p>;
  else if (state.error || !state.trip?.route) content = <><p role="alert">We couldn’t load your trip. Check your connection and try again.</p><button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-4 rounded-xl bg-brand px-4 py-3 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Try again</button></>;
  else {
    const actualSlug = getSetupRouteId(state.trip.route);
    const targetStage = state.trip.status === "completed" ? "complete" : "active";
    if (actualSlug === routeSlug && (stage === "preview" || (stage === "active" && state.trip.status === "active") || (stage === "complete" && state.trip.status === "completed"))) return children;
    content = <><p>{actualSlug !== routeSlug ? "The saved trip uses a different route." : state.trip.status === "active" ? "This trip is still active." : `This trip is ${state.trip.status}.`}</p>{actualSlug && state.trip.status !== "cancelled" && <Link href={`/trip/${targetStage}?route=${encodeURIComponent(actualSlug)}&trip=${encodeURIComponent(tripId)}`} className="mt-4 inline-block font-semibold text-brand underline">Open the saved trip</Link>}</>;
  }
  return <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16"><section className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-5 text-sm text-slate-700 shadow-sm sm:p-7">{content}<Link href="/" className="mt-5 block font-semibold text-brand underline">Back to Home</Link></section></main>;
}
