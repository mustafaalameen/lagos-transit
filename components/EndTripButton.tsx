"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearTripDetails } from "@/data/tripDetails";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function EndTripButton({ routeId, origin, destination }: {
  routeId: string;
  origin: string;
  destination: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  function endTrip() {
    setConfirmationOpen(false);
    if (!clearTripDetails(routeId)) {
      setError("Vehicle details could not be cleared. The trip has not ended. Please allow browser session storage and try again.");
      return;
    }
    setError("");
    router.replace(`/trip/complete?route=${encodeURIComponent(routeId)}`);
  }

  return (
    <div className="mt-4">
      <button type="button" onClick={() => setConfirmationOpen(true)} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">End Trip</button>
      <ConfirmationModal open={confirmationOpen} title="End this trip?" description="Your trip will be marked as complete and the saved vehicle details for this route will be cleared." context={`${origin} → ${destination}`} cancelLabel="Continue Trip" confirmLabel="End Trip" onCancel={() => setConfirmationOpen(false)} onConfirm={endTrip} />
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
