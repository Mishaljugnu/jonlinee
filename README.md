# J Online Shopping — Supabase Backend

This version no longer uses `data/database.json` for application data. The server reads and writes the catalog, sourcing requests, promotions, settings, quotations, and orders in Supabase. Image uploads use Supabase Storage.

## Environment variables

Browser-safe:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Server-only:
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Never put `SUPABASE_SECRET_KEY` in a `VITE_` variable or commit the real value.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Put your Supabase publishable key in the two `VITE_` variables.
3. Put the Supabase secret key in `SUPABASE_SECRET_KEY`.
4. Run `npm install`.
5. Run `npm run dev`.

The admin login uses Supabase Auth email/password. An authenticated user must have `public.profiles.role = 'admin'` to access admin APIs.

## Vercel

The local development server is `dev-server.ts`; Vercel serves the Express API through `api/index.ts` and the Vite build from `dist`. Set the four environment variables above in Vercel Project Settings → Environment Variables.
