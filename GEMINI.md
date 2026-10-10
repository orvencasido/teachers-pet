# Agent Governance & System Invariants

## Project Overview
Modern web application with a React frontend and Supabase (PostgreSQL, Auth, Edge Functions) backend managed locally via `npx supabase`.

## Technology Stack
- Frontend: React (TypeScript) + Tailwind CSS + Lucide Icons
- Backend & DB: Supabase (Local instance via `npx supabase`)
- Data Client: `@supabase/supabase-js`
- Package Manager: `pnpm` (or `npm`)

## Hard Invariants (Never Violate)
1. **Database Schema Changes**: NEVER run ad-hoc raw SQL directly against the DB. All schema changes MUST be authored as declarative migrations inside `supabase/migrations/<timestamp>_<name>.sql` and applied via `make db-diff` or `make db-reset`.
2. **Deterministic Primitives**: Always invoke tasks through the `Makefile` (`make verify`, `make test`, `make lint`). Do not invent shell flags.
3. **Secrets & Keys**: Never hardcode credentials. Local development relies strictly on local keys output by `npx supabase status` loaded via `.env.local`.
4. **Git Safety**: Never run destructive git operations (`git reset --hard`, `git push --force`).

## Definition of Done
Any task completed by an agent or subagent must pass `make verify`.
