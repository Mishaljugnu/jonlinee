# Step 10 — Deployment Audit

## Deployment-safe changes
- Kept the Vite SPA build output as `dist`.
- Kept `/api` as the Vercel serverless entry through `api/index.ts`.
- Renamed the local development launcher from `server.ts` to `dev-server.ts` so Vercel's current zero-configuration Node-server detection does not accidentally treat the development launcher as the production app entrypoint.
- Updated `npm run dev` and `npm start` to use `dev-server.ts`.
- Kept the existing API rewrite and application routes unchanged.
- Kept Supabase public configuration in `VITE_*` variables and server-only secret access in `process.env.SUPABASE_SECRET_KEY`.

## Vercel environment requirements
Production must have:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

`SUPABASE_SECRET_KEY` must remain a Secret/server-only variable and must never use the `VITE_` prefix.

## Verification note
The sandbox could not complete a fresh `npm ci` because package downloads timed out. Therefore a complete Vercel-equivalent production build could not be executed here. Source parsing, configuration inspection, and deployment-entrypoint checks were performed instead; no claim of a completed Vite production build is made.
