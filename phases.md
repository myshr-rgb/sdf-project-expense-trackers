# phases.md — Build Plan (Frontend-First Milestone)

Rules for using this file:
- Do phases in order. Each phase ends with a checkpoint: all exit-checklist boxes ticked, tests green, `memory.md` updated.
- Tick tasks (`[x]`) as you finish them. Each task should take roughly one focused session.
- Phase 0–1 give a working skeleton; Phase 2–6 deliver P0 features; Phases 7–9 polish and document.

Effort guide: S ≈ ≤1 h, M ≈ 2–4 h, L ≈ 1 day.

---

## Phase 0 — Project setup (S)
**Goal:** repo, tooling, empty frontend app running with exact design tokens.
- [x] Verify root `.md` files and unpack `stitch_custom_ui_design_implementation.zip` into `docs/stitch_design/`; add `.gitignore` and `README.md`
- [x] Scaffold `frontend/` with Vite + React 18 + TypeScript + Tailwind CSS v3 (`tailwind.config.ts` with exact tokens from `design.md` and `docs/stitch_design/plumledger_design_system.md`)
- [x] Configure Google Fonts (`Afacad Flux`, `Instrument Sans`, `Spline Sans Mono`) + `Material Symbols Outlined` in `index.html` / `src/styles/index.css`
- [x] Configure ESLint, Prettier, `npm run typecheck` (`tsc --noEmit`), and Vitest + React Testing Library (jsdom entry-point smoke test passes)
- [x] Add core domain types (`src/types/domain.ts`) and money/date utilities (`src/lib/money.ts`, `src/lib/date.ts`, `src/lib/format.ts`) with unit tests
**Exit:** `npm run dev`, `npm run lint`, `npm run typecheck`, and `npm run test` all succeed.

## Phase 1 — Storage repository, auth flow, and app shell (M) — FR1, NFR1, NFR9
- [x] Implement `DataRepository` interface and `LocalStorageRepository` (`src/repositories/`) with schema versioning, per-user scoping, and reconciling demo seed data (`src/lib/seed.ts`)
- [x] Implement `authService.ts` (register with SHA-256 password hash + DPDP consent timestamp, login, demo one-click login, logout, delete account)
- [x] Build `SignInPage.tsx` matching `docs/stitch_design/sign_in_register_desktop/code.html` ("Private & Secure Tracking" copy, Sign In / Create Account tabs, show/hide password, validation)
- [x] Build `AppShell` (`Sidebar` desktop `w-64`, `BottomNav` mobile `< 1024px`, sticky `Header` with dynamic user name, `ProtectedRoute`, profile logout & delete-account controls)
- [x] Unit/component tests: register/login success + failure, protected route redirect, delete account data wipe
**Exit:** user can register, log in (or use Demo Account), see the shell, and log out; protected routes redirect when logged out.

## Phase 2 — Transactions CRUD (L) — FR2, FR3, FR4, FR12, NFR8
- [ ] Implement `transactionService.ts` (add, update, delete, list by `userId`, default categories: Food, Transportation, Education, Shopping, Entertainment, Bills, Income)
- [ ] Build `TransactionsPage.tsx`, `LedgerTable.tsx`, and `EntryForm.tsx` matching `docs/stitch_design/transactions_desktop/code.html` (Expense/Income toggle, title, amount in ₹ converted to integer paise, category, date, optional note, recurring bill flag)
- [ ] Add edit modal/inline editing, delete confirmation dialog, and loading/empty/error states
- [ ] Tests: create/edit/delete income & expenses, integer paise accuracy, invalid amount rejection, persistence across reload
**Exit:** user can add, edit, and delete income and expenses; totals are exact; data persists after reload.

## Phase 3 — Search and filters (M) — FR6
- [ ] Implement combined filtering & sorting in `transactionService.ts` (`q` text query, `type`, `category`, `dateFrom`, `dateTo`, `minPaise`, `maxPaise`, `sort`)
- [ ] Build `FilterBar.tsx` matching `transactions_desktop/code.html` (debounced search input, category chips with `aria-pressed`, date presets + custom range, amount range inputs, clear-filters button)
- [ ] Sync filter state with URL search params (`useSearchParams`)
- [ ] Tests: individual filters, combined AND filters, empty "no matching transactions" state
**Exit:** all filters combine accurately; URL query reflects active filters.

## Phase 4 — Budgets and notifications (L) — FR5, FR11
- [ ] Implement `budgetService.ts` (upsert overall monthly cap and per-category caps with 80/90/100% alert thresholds; compute spent, remaining, %, and status `on_track` / `near_limit` / `exceeded`)
- [ ] Implement `notificationService.ts` (triggered automatically on every transaction create/edit/delete; `dedupeKey` prevents duplicate alerts; mark read / dismiss)
- [ ] Build `BudgetsPage.tsx`, `CategoryBudgetCard.tsx`, `BudgetForm.tsx`, and `AlertsPanel.tsx` matching `docs/stitch_design/budgets_desktop/code.html`
- [ ] Build `NotificationBell.tsx` in header with unread badge + dropdown
- [ ] Tests: 79% / 80% / 99% / 100% / 105% threshold boundaries, edit/delete recalculation, duplicate-alert prevention
**Exit:** crossing a budget threshold generates exactly one alert; budget cards match all three visual states.

## Phase 5 — Dashboard (M) — FR7, NFR8
- [ ] Implement `dashboardService.ts` (monthly balance, total income, total expenses, savings, remaining budget, recent transactions, category breakdown shares, upcoming recurring bill)
- [ ] Build `DashboardPage.tsx`, `BalanceCard.tsx`, `QuickMenu.tsx`, and SVG `ActivityDonut.tsx` matching `docs/stitch_design/finance_dashboard_desktop/code.html`
- [ ] Wire month switcher (`Nov 2026`, etc.), Quick Menu actions (opens Entry Form / Budgets / Insights), dismissible budget alert banner, and recent transaction filter chips
- [ ] Tests: dashboard aggregates match Transactions and Budgets for the same month, including zero-data month
**Exit:** dashboard figures reconcile 100% with Transactions and Budgets.

## Phase 6 — Reports (M) — FR8
- [ ] Implement `reportService.ts` (last 6 months income vs expenses, category totals, KPIs: average monthly spend, top category, net savings rate)
- [ ] Build `ReportsPage.tsx`, CSS/SVG paired `IncomeExpenseBars.tsx`, and `CategoryTotals.tsx` matching `docs/stitch_design/reports_desktop/code.html`
- [ ] Add empty state when insufficient history exists
- [ ] Tests: 6-month aggregation accuracy and zero-income edge cases
**Exit:** report metrics reconcile with underlying transactions.

## Phase 7 — AI insights & recommendations (L) — FR9, FR10
- [ ] Implement `services/insights/facts.ts` (savings rate, category shares, 7-day/10-day spending delta, duplicate recurring charges, budget burn rate)
- [ ] Implement `services/insights/healthScore.ts` (0–100 weighted formula + month-over-month delta) with unit tests
- [ ] Implement `services/insights/rules.ts` (generates 1–3 concrete recommendations with `savingPaise` and an executable action, e.g., creating/updating a category budget cap)
- [ ] Build `InsightsPage.tsx`, `HeroSummary.tsx`, and `RecommendationCard.tsx` matching `docs/stitch_design/ai_insights_desktop/code.html` (plus dashboard AI insight card CTA and disclaimer)
- [ ] Tests: health score formula, facts calculations, applying a recommendation updates Budgets
**Exit:** AI Insights displays verifiable metrics from user entries and applying a recommendation creates a real budget cap.

## Phase 8 — Responsive, accessibility, polish (M) — NFR2, NFR3, NFR10
- [ ] Audit and refine mobile layouts (`360 px` to `1024 px`: bottom nav, stacked cards, table → list rows, bottom-sheet entry form, 44 × 44 px touch targets)
- [ ] Accessibility audit: keyboard navigation, focus traps in modals, `aria-label` / `aria-pressed` / `role="alert"`, contrast check, `prefers-reduced-motion`
- [ ] Performance check with 5,000 seeded transactions (ensure instant filtering and smooth rendering)
- [ ] Add global `ErrorBoundary`, toast notifications, and skeleton loaders on all views
- [ ] Optional (P2): CSV export per month, dark theme toggle
**Exit:** responsive from 360 px to 1440 px; Lighthouse accessibility ≥ 90 on Dashboard and Transactions.

## Phase 9 — Testing, documentation, delivery (M) — NFR4–NFR7, Course CO4
- [ ] Add Playwright E2E test: register → add expense → trigger budget alert → apply AI recommendation → delete account
- [ ] Verify test coverage and complete `docs/traceability.md` mapping FR1–FR12 & NFR1–NFR10 to implementation files and tests
- [ ] Complete `docs/report.md` (problem statement, requirements, architecture including future FastAPI design, UI screenshots, testing summary, limitations & future work)
- [ ] Finalize `README.md` with setup instructions, demo credentials, and project structure
**Exit:** fresh clone runs cleanly with `npm install && npm run dev`; all tests green; `memory.md` marked "Delivered".
