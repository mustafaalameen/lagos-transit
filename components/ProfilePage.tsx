"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import AccountNav from "@/components/AccountNav";
import { getSupabase } from "@/lib/supabase/client";

type Profile = { id: string; full_name: string | null; phone: string | null; accessibility_mode: boolean; created_at: string };

function ProfileForm({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const fields = "id,full_name,phone,accessibility_mode,created_at";
  const fieldStyle = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100";

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true);
    setError("");
    Promise.resolve(getSupabase().from("profiles").select(fields).eq("id", userId).abortSignal(controller.signal).maybeSingle<Profile>())
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) setError("We couldn’t load your profile. Please try again.");
        else setProfile(data);
      }, () => { if (active) setError("We couldn’t load your profile. Please try again."); })
      .finally(() => { clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [userId, attempt]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    setMessage("");
    try {
      const { data, error } = await getSupabase().from("profiles").update({
        full_name: String(form.get("full_name") ?? "").trim() || null,
        phone: String(form.get("phone") ?? "").trim() || null,
        accessibility_mode: form.get("accessibility_mode") === "on",
      }).eq("id", userId).select(fields).single<Profile>();
      if (error || !data) throw new Error("Profile update failed.");
      setProfile(data);
      setMessage("Profile saved.");
    } catch {
      setError("We couldn’t save your profile. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (loading) return <p role="status" className="mt-5 text-sm text-slate-600">Loading your profile…</p>;
  if (!profile) return <div className="mt-5"><p role="alert" className="text-sm text-red-700">{error}</p><button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-3 rounded-lg bg-brand px-4 py-2 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Try again</button></div>;

  return (
    <form onSubmit={save} className="mt-6 space-y-5">
      <fieldset disabled={pending} className="space-y-5 disabled:opacity-60">
        <legend className="sr-only">Your profile details</legend>
        <label htmlFor="profile-name" className="block text-sm font-semibold text-slate-800">Full name<input id="profile-name" name="full_name" maxLength={200} autoComplete="name" defaultValue={profile.full_name ?? ""} className={fieldStyle} /></label>
        <label htmlFor="profile-phone" className="block text-sm font-semibold text-slate-800">Phone<input id="profile-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" defaultValue={profile.phone ?? ""} className={fieldStyle} /></label>
        <label className="flex items-center gap-3 text-sm text-slate-800"><input name="accessibility_mode" type="checkbox" defaultChecked={profile.accessibility_mode} className="h-5 w-5 accent-brand" />Accessibility mode preference</label>
        <button type="submit" className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{pending ? "Saving…" : "Save profile"}</button>
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-blue-50 p-4 text-sm text-slate-700">{message}</p>}
    </form>
  );
}

export default function ProfilePage() {
  const { session, loading, error } = useAuth();
  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-6 inline-block rounded text-sm font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Back to Home</Link>
        <AccountNav />
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="profile-title">
          <p className="text-sm font-semibold text-brand">Lagos Transit Safety Companion</p>
          <h1 id="profile-title" className="mt-1 text-2xl font-bold text-slate-900">My profile</h1>
          {loading ? <p role="status" className="mt-5 text-sm text-slate-600">Checking account…</p> : error ? <p role="alert" className="mt-5 text-sm text-red-700">{error}</p> : session ? <ProfileForm key={session.user.id} userId={session.user.id} /> : <p className="mt-5 text-sm text-slate-600">Please <Link href="/login" className="font-semibold text-brand underline">log in</Link> to view your profile.</p>}
        </section>
      </div>
    </main>
  );
}
