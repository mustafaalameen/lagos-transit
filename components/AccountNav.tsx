"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";

export default function AccountNav() {
  const { session, loading, error: authError } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const linkStyle = "rounded px-1 py-2 font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  async function logout() {
    setPending(true);
    setError("");
    try {
      const { error } = await getSupabase().auth.signOut({ scope: "local" });
      if (error) throw error;
      router.replace("/");
    } catch {
      setError("We couldn’t log you out. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (loading) return <p role="status" className="mb-4 text-sm text-slate-500">Checking account…</p>;
  return (
    <div className="mb-4">
      <nav aria-label="Account" className="flex flex-wrap items-center gap-4 text-sm">
        {session ? <><Link href="/profile" className={linkStyle}>My profile</Link><button type="button" disabled={pending} onClick={logout} className={`${linkStyle} disabled:opacity-50`}>{pending ? "Logging out…" : "Log out"}</button></> : <><Link href="/login" className={linkStyle}>Log in</Link><Link href="/signup" className={linkStyle}>Sign up</Link></>}
      </nav>
      {(error || authError) && <p role="alert" className="mt-2 text-sm text-red-700">{error || authError}</p>}
    </div>
  );
}
