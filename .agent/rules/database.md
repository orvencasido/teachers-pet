# Scoped Rules: Database & Backend (supabase/)
- All new public tables must have an `id uuid default gen_random_uuid() primary key`.
- Add `created_at timestamptz default now() not null`.
- Always enable RLS and write granular policies.
- Type definitions must be synchronized: run `npx supabase gen types typescript --local > src/types/database.types.ts`.
