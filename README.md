# Lagos Transit Safety Companion — Day 1 Starter

This is a **frontend-only** Next.js prototype of the Home screen from the uploaded design preview. Route fares/times are illustration data, not verified public-transport information. There is **no** authentication, GPS, family tracking, or SOS action implemented yet.

## Run on Windows

1. Extract the ZIP to your preferred development folder.
2. Open the extracted `lagos-transit-starter` folder in VS Code (File > Open Folder).
3. Open **Terminal > New Terminal**.
4. Run:

   ```powershell
   npm install
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

Stop the dev server with **Ctrl+C**.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

## First instruction to Codex

> Inspect this project and explain the folder structure in beginner-friendly language. Do not change any files yet. After reviewing it, propose the smallest next step for implementing the Trip Setup page using only mock data.

## Supabase connectivity

The Supabase JavaScript package is installed, and `lib/supabase/client.ts` exports
`getSupabase()` for future database work. The client initializes only when called.
The current screens continue using mock data without making Supabase requests.

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` to your Supabase project URL.
3. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project's publishable key
   beginning with `sb_publishable_`.
4. Restart the development server after changing environment variables.

Use Node.js 22.18+ (Node.js 24 also works). Verify connectivity from the terminal:

```powershell
npm run check:supabase
```

The command loads local environment files using Next.js's environment loader,
initializes the reusable client, and calls Supabase's documented project health
endpoint (`/auth/v1/health`) with the publishable key. It needs no tables and
performs no sign-in or database operation. A PASS confirms project connectivity
and acceptance of the key; it does not test table permissions or writes.
Missing configuration, an invalid key, or an unreachable API produces a FAIL and
a nonzero exit code. No authentication or realtime connection is started.

In Vercel, add both variables under Project Settings > Environment Variables for
the deployment environments you use (Production and, if needed, Preview and
Development). Redeploy after adding or changing them: `NEXT_PUBLIC_` values are
included at build time. Use the publishable key only. Keep `.env.local` out of Git;
the existing `.gitignore` excludes it, while `.env.example` can be committed.
Select Node.js 22.x or 24.x in Vercel's project settings to match the installed
Supabase package's Node.js requirement.

## Important

- Don't commit `.env.local`, keys, or passwords.
- Do not mistake demonstration fares and durations for verified route data.
- Test before every commit.
