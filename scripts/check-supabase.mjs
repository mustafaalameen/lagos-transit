import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), true);

try {
  // Node 22.18+ can load the same TypeScript client used by the application.
  const { getSupabase } = await import("../lib/supabase/client.ts");
  getSupabase();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL.trim().replace(/\/+$/, "");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim();
  const response = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: publishableKey },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    console.error(`FAIL: Supabase connectivity check (HTTP ${response.status}). Check the project URL, publishable key, and project availability.`);
    process.exitCode = 1;
  } else {
    const health = await response.json();
    if (typeof health?.name !== "string" || typeof health?.version !== "string") {
      throw new Error("Unexpected health response.");
    }
    console.log("PASS: Supabase project health check (HTTP 200). The publishable key was accepted. No sign-in or database operation was performed.");
  }
} catch {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    console.error("FAIL: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local, then rerun npm run check:supabase.");
  } else {
    // Do not print remote error bodies, environment values, or credentials.
    console.error("FAIL: Supabase client initialization or connection failed. Check the URL, sb_publishable_ key, network access, and Node version (22.18+).");
  }
  process.exitCode = 1;
}
