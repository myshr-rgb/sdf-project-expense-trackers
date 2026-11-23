# Agent.md — PlumLedger (AI-Powered Smart Personal Finance & Expense Tracker)

> Entry point for the coding agent (Antigravity / Codex). Read this file first, every session.

## 1. Project in one paragraph
PlumLedger is a web app where students and young earners record income and expenses, categorise them, set budgets, see a dashboard and reports, and get AI-generated spending insights and recommendations. It never connects to banks or moves money. Course: CSC203B Software Development Fundamentals (RUAS). Student: Shrusti M Y (25ETCS002295).

**Current Implementation Scope:** Frontend-first SPA (React + Vite + TypeScript + Tailwind CSS) backed by a clean `DataRepository` abstraction using `localStorage` and a deterministic rule-based insight engine, designed so a FastAPI backend can be swapped in later without rewriting UI components.

## 2. Read order (mandatory at the start of every session)
1. `Agent.md` (this file)
2. `memory.md` — what has happened, what is happening, what is next
3. `phases.md` — find the current phase and its tasks
4. `rules.md` — hard constraints
5. `prd.md`, `architecture.md`, `design.md` — consult as the task requires (plus `docs/stitch_design/` HTML files for exact markup/tokens)

## 3. Source of truth hierarchy
If documents disagree, resolve in this order:
1. `rules.md` (constraints always win)
2. `prd.md` (what to build; FR/NFR IDs are canonical)
3. `architecture.md` (how to build)
4. `design.md` and `docs/stitch_design/` (how it looks)
5. `phases.md` (order of work)
6. `memory.md` (state only; never overrides the above)

## 4. Working protocol
- Work on **one phase at a time**, in order. Never start phase N+1 until phase N's exit checklist in `phases.md` is fully ticked.
- Work in small tasks (≤ ~150 lines changed per task where possible). After each task: run lint, type-check and tests, then fix before moving on.
- **Checkpoint** after every completed task group (end of each phase, or any significant change): update `memory.md` (see its template). A task is not done until `memory.md` is updated.
- If a requirement is ambiguous, pick the simplest option that satisfies the FR/NFR, record it under "Decisions" in `memory.md`, and continue. Ask the user only for blockers.
- Never invent features beyond `prd.md`. Propose additions in `memory.md` → "Open questions".
- Reference requirement IDs (FR1–FR12, NFR1–NFR10) in commit messages, test names and PR notes.

## 5. Tech stack (summary; details in architecture.md)
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS v3 (`tailwind.config.ts` copied from `design.md` / `docs/stitch_design/plumledger_design_system.md`), React Router, TanStack Query, React Hook Form + Zod.
- **Persistence (Current Milestone):** Client-side `DataRepository` (`localStorage` with structured JSON schemas, per-user scoping, and seed data).
- **AI Insights (Current Milestone):** Deterministic `FactsBuilder` + `RuleRecommender` computing real stats and savings recommendations from user entries (provider-agnostic interface ready for future backend LLM phrasing).
- **Future Backend (Deferred Milestone):** Python 3.11+, FastAPI, SQLAlchemy 2 + Alembic, SQLite/PostgreSQL, JWT + Argon2.
- **Testing:** Vitest + React Testing Library + Playwright.

## 6. Repo layout (summary)
```
plumledger/
  Agent.md  prd.md  architecture.md  rules.md  phases.md  design.md  memory.md
  frontend/        # React SPA (current focus)
  docs/
    stitch_design/ # Unpacked reference HTML screens & design system
    report.md      # Course submission report (CO4)
    test-plan.md
    traceability.md
```
Full tree is in `architecture.md` §5.

## 7. Commands (keep updated in memory.md if they change)
```
# frontend
cd frontend && npm install
npm run dev                            # http://localhost:5173
npm run lint && npm run typecheck && npm run test
```

## 8. Definition of done (any task)
- Meets the linked FR/NFR acceptance criteria in `prd.md`.
- Lint, type-check and tests pass.
- Follows `rules.md` and `design.md` (tokens only, no hard-coded colours).
- Accessible: labels, keyboard focus, `aria-*` where needed.
- `memory.md` updated.

## 9. Hard "never" list (full list in rules.md)
- Never commit secrets or `.env`.
- Never store plaintext passwords (even in simulated auth, hash or omit raw password storage).
- Never use floats for money (store integer paise).
- Never call an external LLM API directly from the browser.
- Never bypass per-user data scoping (NFR9).
- Never connect to banks or move real money (out of scope).