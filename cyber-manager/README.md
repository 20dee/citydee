# Cyber Manager

This is a separate React/Supabase cyber-café manager application.

## Planned structure

- `package.json`
- `vite.config.ts`
- `index.html`
- `src/`
- `src/lib/supabase.ts`
- `src/lib/format.ts`
- `src/App.tsx`
- `src/styles.css`
- `supabase/schema.sql`

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env`.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. Install and run:

```bash
cd cyber-manager
npm install
npm run dev
```

This app keeps authentication and role enforcement in Supabase; the browser-only PIN login is not used for this project.
