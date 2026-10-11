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

## Important

- Don't commit `.env.local`, keys, or passwords.
- Do not mistake demonstration fares and durations for verified route data.
- Test before every commit.
