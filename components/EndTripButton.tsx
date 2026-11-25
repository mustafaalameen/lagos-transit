"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearTripDetails } from "@/data/tripDetails";
import ConfirmationModal from "@/components/ConfirmationModal";
import { completeTrip } from "@/lib/supabase/trips";

export default function EndTripButton({ routeId, origin, destination, tripId }: {
  routeId: string;
  origin: string;
  destination: string;
  tripId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const submitting = useRef(false);

  async function endTrip() {
    if (!tripId || submitting.current) return;
    submitting.current = true;
    setConfirmationOpen(false);
    setPending(true);
    setError("");
    try {
      if (!saved) {
        await completeTrip(tripId, routeId);
        setSaved(true);
      }
      if (!clearTripDetails(routeId, tripId)) {
        setError("Your trip was saved as completed, but local vehicle details could not be cleared. Please allow browser session storage and finish completion.");
        return;
      }
      router.replace(`/trip/complete?route=${encodeURIComponent(routeId)}&trip=${encodeURIComponent(tripId)}`);
    } catch {
      setError("We couldn’t confirm completion. Your vehicle details have been kept. Check your connection and try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <div className="mt-4">
      <button type="button" disabled={pending || !tripId} onClick={() => saved ? endTrip() : setConfirmationOpen(true)} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50">{pending ? "Saving completion…" : saved ? "Finish completion" : "End Trip"}</button>
      {!tripId && <p className="mt-2 text-xs text-slate-500">Start a saved trip from Trip Setup before ending it.</p>}
      <ConfirmationModal open={confirmationOpen} title="End this trip?" description="Your trip will be marked as complete and the saved vehicle details for this route will be cleared." context={`${origin} → ${destination}`} cancelLabel="Continue Trip" confirmLabel="End Trip" onCancel={() => setConfirmationOpen(false)} onConfirm={endTrip} />
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
