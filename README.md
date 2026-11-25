# Lagos Transit Safety Companion — Day 1 Starter

This Next.js prototype loads transport routes from Supabase and supports email/password accounts, private profiles, and saved trips. Route fares/times are illustration data, not verified public-transport information. Journey progress and Family View remain mock previews.

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
`getSupabase()` for browser database and Auth requests. The client initializes only
when called. Browser sessions persist and refresh; terminal use stays stateless.

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

## Accounts and profiles

Apply `supabase/migrations/20261120010000_create_profiles.sql` through the CLI
migration workflow before using accounts. The migration creates one profile per
Auth user through a trigger and backfills profiles for existing users. Public
clients cannot insert/delete profiles or change their identity/creation time.
Authenticated users can read and edit only their own name, phone, and
accessibility preference, enforced by database RLS.

Use `/signup` to register, `/login` to log in, and `/profile` to edit your profile.
The Home account navigation provides logout for the current device. Profile
content requires a session; Home and route setup remain public. Saved trip data
requires login, while old mock-preview URLs remain available. Session
state is browser-based at this stage; no server-side protected pages are added.

In Supabase Auth, keep the project's email confirmation setting as appropriate.
When confirmation is required, signup shows a check-email message rather than
claiming the user is logged in. In Authentication > URL Configuration, set your
production Site URL and allow your login return URLs, including
`http://localhost:3000/login` and `https://YOUR-DEPLOYMENT/login`. If testing on
another local port, allow that port's `/login` URL as well. No additional public
environment variables or packages are required.

Profile changes are real database updates. Accessibility mode currently stores a
preference only.

## Saved trips

Apply `supabase/migrations/20261124000000_create_trips.sql` before starting saved
trips. Route browsing and mock previews stay public; Start Trip requires login.
Home carries the database route UUID into Setup alongside the existing route
slug. Direct slug-only Setup links resolve a matching active database route.

Start Trip saves the signed-in user's trip and vehicle details before navigating
to `/trip/active?route=...&trip=...`. The trip UUID stays in the URL through Family
Preview and completion. RLS denies anonymous access and limits authenticated
users to their own trips. The server sets completion timestamps; clients cannot
change trip identity, ownership, creation times, or share tokens. No sharing is
enabled, and unknown expected arrival times remain NULL.

On creation failure, Setup retains its fields. On completion failure, Active Trip
retains its local vehicle notes. Retries reuse the creation request UUID or
recognize an already completed trip, handling a lost success response without
creating duplicates or resetting `ended_at`. Local Family Preview notes are
scoped by trip UUID and cleared only after confirmed database completion. If
local cleanup fails after completion is saved, Finish completion retries cleanup.
Family Preview links carrying a saved trip ID verify the same trip ownership
before displaying local notes.
Progress, next stops, map placeholders, and Family Preview remain mock displays.

## Important

- Don't commit `.env.local`, keys, or passwords.
- Do not mistake demonstration fares and durations for verified route data.
- Test before every commit.
