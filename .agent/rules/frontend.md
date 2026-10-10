# Scoped Rules: Frontend (src/)
- Use TypeScript strictly; avoid `any`.
- Keep Supabase client calls isolated in custom hooks (`src/hooks/`) or service functions (`src/lib/`).
- Do not make raw Supabase client calls directly inside view components.
- Adhere to design tokens specified in `.agent/skills/modern-ui/`.
