"use client";

import { useEffect, useState } from "react";
import RouteCard from "@/components/RouteCard";
import { fetchActiveRoutes, type TransportRoute } from "@/lib/supabase/routes";

type RouteState =
  | { status: "loading" }
  | { status: "ready"; routes: TransportRoute[] }
  | { status: "error" };

export default function HomeRoutes() {
  const [state, setState] = useState<RouteState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setState({ status: "loading" });

    fetchActiveRoutes(controller.signal)
      .then((routes) => {
        if (!cancelled) setState({ status: "ready", routes });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  if (state.status === "loading") {
    return <p role="status" className="rounded-xl bg-stone-100 p-4 text-sm text-slate-600">Loading routes…</p>;
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-stone-200 p-4">
        <p role="alert" className="text-sm text-slate-700">We couldn’t load routes. Check your connection and try again.</p>
        <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">Try again</button>
      </div>
    );
  }

  if (state.routes.length === 0) {
    return <p role="status" className="rounded-xl bg-stone-100 p-4 text-sm text-slate-600">No active routes are available right now.</p>;
  }

  return <div className="space-y-3">{state.routes.map((route) => <RouteCard key={route.id} route={route} />)}</div>;
}
