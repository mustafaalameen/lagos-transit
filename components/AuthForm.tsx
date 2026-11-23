"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const { session, loading, error: authError } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const fieldStyle = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || loading) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (signup && password !== form.get("confirmPassword")) {
      setError("The passwords do not match.");
      return;
    }
    setPending(true);
    setError("");
    setMessage("");
    try {
      const client = getSupabase();
      const result = signup
        ? await client.auth.signUp({ email, password, options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: { full_name: String(form.get("full_name") ?? "").trim(), phone: String(form.get("phone") ?? "").trim(), accessibility_mode: form.get("accessibility_mode") === "on" },
        } })
        : await client.auth.signInWithPassword({ email, password });
      if (result.error) {
        if (result.error.code === "email_not_confirmed") setError("Please confirm your email before logging in.");
        else if (result.error.status === 429) setError("Too many attempts. Please wait before trying again.");
        else setError(signup ? "We couldn’t create your account. Check your details and try again." : "We couldn’t log you in. Check your email and password and try again.");
        return;
      }
      if (result.data.session) router.replace("/profile");
      else setMessage("Check your email to confirm your account, then log in. If you already have an account, use Log in.");
    } catch {
      setError("We couldn’t reach account services. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-6 inline-block rounded text-sm font-semibold text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Back to Home</Link>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="auth-title">
          <p className="text-sm font-semibold text-brand">Lagos Transit Safety Companion</p>
          <h1 id="auth-title" className="mt-1 text-2xl font-bold text-slate-900">{signup ? "Create an account" : "Log in"}</h1>
          {loading ? <p role="status" className="mt-5 text-sm text-slate-600">Checking account…</p> : session ? <p className="mt-5 text-sm text-slate-600">You are signed in. <Link href="/profile" className="font-semibold text-brand underline">Open your profile</Link></p> : (
            <form onSubmit={submit} className="mt-6 space-y-5">
              <fieldset disabled={pending || !!authError} className="space-y-5 disabled:opacity-60">
                <legend className="sr-only">{signup ? "Sign up details" : "Login details"}</legend>
                {signup && <>
                  <label className="block text-sm font-semibold text-slate-800" htmlFor="full-name">Full name<input id="full-name" name="full_name" required maxLength={200} autoComplete="name" className={fieldStyle} /></label>
                  <label className="block text-sm font-semibold text-slate-800" htmlFor="phone">Phone (optional)<input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={fieldStyle} /></label>
                </>}
                <label className="block text-sm font-semibold text-slate-800" htmlFor="email">Email<input id="email" name="email" type="email" required autoComplete="email" className={fieldStyle} /></label>
                <label className="block text-sm font-semibold text-slate-800" htmlFor="password">Password<input id="password" name="password" type="password" required minLength={signup ? 8 : undefined} autoComplete={signup ? "new-password" : "current-password"} className={fieldStyle} />{signup && <span className="mt-1 block text-xs font-normal text-slate-500">Use at least 8 characters.</span>}</label>
                {signup && <>
                  <label className="block text-sm font-semibold text-slate-800" htmlFor="confirm-password">Confirm password<input id="confirm-password" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className={fieldStyle} /></label>
                  <label className="flex items-center gap-3 text-sm text-slate-800"><input name="accessibility_mode" type="checkbox" className="h-5 w-5 accent-brand" />Accessibility mode preference</label>
                </>}
                <button type="submit" className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{pending ? "Please wait…" : signup ? "Sign up" : "Log in"}</button>
              </fieldset>
            </form>
          )}
          {(error || authError) && <p role="alert" className="mt-4 text-sm text-red-700">{error || authError}</p>}
          {message && <p role="status" className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-slate-700">{message}</p>}
          <p className="mt-5 text-sm text-slate-600">{signup ? "Already have an account?" : "New here?"} <Link href={signup ? "/login" : "/signup"} className="rounded font-semibold text-brand underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">{signup ? "Log in" : "Sign up"}</Link></p>
        </section>
      </div>
    </main>
  );
}
