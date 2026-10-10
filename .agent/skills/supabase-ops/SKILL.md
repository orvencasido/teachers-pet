---
name: supabase-ops
description: Manages local Supabase services, schema migrations, and database status verification.
---

# Supabase Management Protocol
- **Linked Project Ref**: `jyapwvlpsptvhvilnjny` (Project: `teacherpet`, Region: `ap-northeast-1`)
- **Direct Querying via Management API**:
  ```bash
  npx supabase db query --linked --project-ref jyapwvlpsptvhvilnjny "<SQL_STATEMENT>"
  ```
  Or run SQL from a file:
  ```bash
  npx supabase db query --linked --project-ref jyapwvlpsptvhvilnjny -f <path-to-sql-file>
  ```

1. Check local instance status using `./scripts/check_supabase.sh` or list remote projects with `npx supabase projects list`.
2. Schema Guidelines:
   - Always enable Row Level Security (RLS) on new public tables:
     `ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;`
   - Create explicit RLS policies for `select`, `insert`, `update`, and `delete`.
   - Never commit ad-hoc mutations; generate a timestamped file in `supabase/migrations/`.
3. Apply changes with `make db-reset` or `npx supabase migration up` (or push migrations using `npx supabase db push --project-ref jyapwvlpsptvhvilnjny` / `npx supabase db query`).

