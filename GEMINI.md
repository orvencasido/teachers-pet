# Agent Governance & System Invariants

## Project Overview: Teacher's Pet
Teacher's Pet is an intuitive, all-in-one classroom management and instructional planning web application for teachers.
- Frontend: React (TypeScript) + Tailwind CSS + Lucide Icons
- Backend & DB: Supabase (Project Ref: `jyapwvlpsptvhvilnjny`, Local/Remote instance via `npx supabase`)
- Data Client: `@supabase/supabase-js`
- Package Manager: `npm` (or `pnpm`)

### Supabase Cloud Environment
- **Project Ref**: `jyapwvlpsptvhvilnjny` (Name: `teacherpet`, Region: `ap-northeast-1`)
- **Querying Supabase**: Use `npx supabase db query --linked --project-ref jyapwvlpsptvhvilnjny "<SQL>"` to query the database via the Supabase Management API.

## Core Functional Requirements
1. **Student Management**:
   - Register and manage student profiles (student ID, first name, last name, grade level, section/class, contact info).
   - Roster organization by class/subject.
2. **Grading & Assessment**:
   - Assessment types: Quizzes, Exams, and Performance Tasks.
   - Grade entry and tracking for individual students and batch score entry per assessment.
   - Configurable grading weights and automated total/percentage calculation.
3. **Calendar & Scheduling**:
   - Interactive academic calendar (month/week/day views).
   - Event and deadline scheduling (lesson dates, quiz/exam periods, submission deadlines, meetings).
4. **Lesson Planning**:
   - Structured lesson planner (objectives, materials, procedure/steps, assessment, notes).
   - Organization by subject, date, unit, or curriculum standard.

## Agent Work Separation & Designated Task Boundaries
Agents and subagents must strictly operate within their designated task areas:
- **Database & Backend Agent (`supabase/`)**:
  - Responsible for declarative migrations in `supabase/migrations/`, RLS policies, and seed data.
  - Follows `.agent/rules/database.md`.
  - Must synchronize TypeScript types to `src/types/database.types.ts`.
- **Frontend & UI Agent (`src/`)**:
  - Responsible for React components, views, layouts, and Tailwind styling.
  - Follows `.agent/rules/frontend.md` and design tokens in `.agent/skills/modern-ui/`.
  - Isolates data calls in custom hooks (`src/hooks/`) and services (`src/lib/`).
- **Quality & Testing Agent (`tests/`)**:
  - Responsible for unit, integration, and smoke tests in `tests/`.
  - Follows `.agent/skills/test-runner/`.
  - Ensures all gates in `make verify` execute deterministically and pass.

## Hard Invariants (Never Violate)
1. **Database Schema Changes**: NEVER run ad-hoc raw SQL directly against the DB. All schema changes MUST be authored as declarative migrations inside `supabase/migrations/<timestamp>_<name>.sql` and applied via `make db-diff` or `make db-reset`.
2. **Deterministic Primitives**: Always invoke tasks through the `Makefile` (`make verify`, `make test`, `make lint`). Do not invent shell flags.
3. **Secrets & Keys**: Never hardcode credentials. Local development relies strictly on local keys output by `npx supabase status` loaded via `.env.local`.
4. **Git Safety**: Never run destructive git operations (`git reset --hard`, `git push --force`).

## Definition of Done
Any task completed by an agent or subagent must pass `make verify`.
