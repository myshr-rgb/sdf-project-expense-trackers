# architecture.md — System Architecture

## 1. Overview
Modular React single-page application built with a clean **Service + Repository pattern**. All UI components talk to TanStack Query hooks, which call domain services (`services/`), which read/write through a storage-agnostic `DataRepository` (`repositories/`). In this assignment milestone, `LocalStorageRepository` persists data locally; in the future backend milestone, `ApiRepository` swaps in to talk to FastAPI without changing UI code.

```
┌─────────────────────────────────────────────────────────────────┐
│ React SPA (Vite, TS, Tailwind)                                  │
│  Pages/Features ──▶ TanStack Query ──▶ Domain Services          │
│                                         ├─ transactionService   │
│                                         ├─ budgetService        │
│                                         ├─ notificationService  │
│                                         ├─ dashboardService     │
│                                         ├─ reportService        │
│                                         └─ insightEngine        │
│                                                │                │
│                                                ▼                │
│                                     DataRepository Interface    │
│                                      ├─ LocalStorageRepo (Now)  │
│                                      └─ FastApiRepo (Future)    │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Tech stack and why
| Layer | Choice | Reason |
| --- | --- | --- |
| UI | React 18 + Vite + TypeScript | Fast dev loop, typed, matches the supplied Tailwind HTML designs 1:1 |
| Styling | Tailwind CSS v3 (`tailwind.config.ts` with exact tokens from `design.md`) | Designs use Tailwind v3 config tokens |
| Routing & Async State | React Router v6, TanStack Query | Clean route guards, cache invalidation, loading/error states |
| Forms & Validation | React Hook Form + Zod | Type-safe schema validation on all inputs |
| Persistence (Current) | `LocalStorageRepository` with versioned schema + seed utility | Zero backend setup needed for frontend submission; instant offline performance |
| AI Insights | Deterministic `FactsBuilder` + `RuleRecommender` (`services/insights/`) | Accurate, zero-hallucination insights without needing external API keys |
| Charts | Hand-built SVG/CSS matching `docs/stitch_design/` (donut, bars) | **No chart library**; matches designs 1:1 |
| Testing | Vitest, React Testing Library, Playwright | Unit, component, and E2E coverage |
| Tooling | ESLint, Prettier, `tsc --noEmit` | Consistent code quality |

## 3. App flow
```
Landing/Auth ──register/login/demo──▶ Dashboard
Dashboard ─┬─▶ Transactions (list, filter, add/edit/delete)
           ├─▶ Budgets (caps, thresholds, alerts)
           ├─▶ AI Insights (summary, score, recommendations → apply action)
           ├─▶ Reports (6-month trends, category totals)
           └─▶ Notifications bell (budget alerts)
Any protected route + no active session ──▶ Sign In
```
Sidebar nav (desktop `w-64`) / bottom nav (mobile `< 1024 px`): Dashboard, Transactions, Budgets, AI Insights, Reports.

## 4. Data model & Service contracts (money = integer paise)
### 4.1 Entities
| Entity | Fields |
| --- | --- |
| `User` | `id`, `email`, `name`, `passwordHash`, `consentedAt`, `createdAt` |
| `Category` | `id`, `name`, `kind` (`'expense' \| 'income'`), `icon`, `colorToken` |
| `Transaction` | `id`, `userId`, `type` (`'income' \| 'expense'`), `title`, `amountPaise` (> 0), `categoryId`, `occurredOn` (`YYYY-MM-DD`), `note?`, `isRecurring?`, `recurrenceDay?`, `createdAt`, `updatedAt` |
| `Budget` | `id`, `userId`, `month` (`YYYY-MM`), `categoryId` (`null` = overall), `limitPaise`, `alertThresholdPct` (`80 \| 90 \| 100`) |
| `Notification` | `id`, `userId`, `kind` (`'budget_warning' \| 'budget_exceeded' \| 'insight'`), `message`, `budgetId?`, `readAt?`, `createdAt`, `dedupeKey` |
| `InsightSnapshot` | `month`, `healthScore`, `healthDelta`, `potentialSavingsPaise`, `insights[]`, `recommendations[]` |

### 4.2 Budget alert logic (FR11)
On every transaction create/update/delete: recompute spent for the affected category and overall for that month. If `%` crosses the user's threshold or `100%` and no notification with the same `dedupeKey` (`${budgetId}:${month}:${level}`) exists for that user, create one. Status: `<80` `on_track`, `80–99` `near_limit`, `≥100` `exceeded`.

### 4.3 Insight engine (FR9, FR10)
```
transactions + budgets ──▶ FactsBuilder (savings rate, category shares, 7/10-day change,
                                         duplicate subscriptions, budget burn rate)
                                │
                                ▼
                        RuleRecommender ──▶ candidate recommendations (id, category, savingPaise, title, explanation, action)
                                │
                                ▼
                        HealthScoreCalculator (0–100 score + delta vs prior month)
```

## 5. Folder and file structure
```
plumledger/
├─ Agent.md  prd.md  architecture.md  rules.md  phases.md  design.md  memory.md
├─ .gitignore  README.md
├─ frontend/
│  ├─ package.json  vite.config.ts  tailwind.config.ts  tsconfig.json  postcss.config.js
│  └─ src/
│     ├─ main.tsx  App.tsx  routes.tsx
│     ├─ styles/       index.css               # Google Fonts, Material Symbols, base tokens
│     ├─ types/        domain.ts               # User, Category, Transaction, Budget, Notification, Insight
│     ├─ lib/          money.ts date.ts format.ts crypto.ts seed.ts
│     ├─ repositories/ repository.ts localStorageRepo.ts
│     ├─ services/
│     │  ├─ authService.ts
│     │  ├─ transactionService.ts
│     │  ├─ budgetService.ts
│     │  ├─ notificationService.ts
│     │  ├─ dashboardService.ts
│     │  ├─ reportService.ts
│     │  └─ insights/  facts.ts rules.ts healthScore.ts index.ts
│     ├─ components/
│     │  ├─ ui/        Button.tsx Card.tsx Chip.tsx Input.tsx Select.tsx Badge.tsx Alert.tsx ProgressBar.tsx Modal.tsx Toast.tsx Skeleton.tsx EmptyState.tsx
│     │  └─ layout/    AppShell.tsx Sidebar.tsx BottomNav.tsx Header.tsx ErrorBoundary.tsx
│     ├─ features/
│     │  ├─ auth/          SignInPage.tsx useAuth.tsx
│     │  ├─ dashboard/     DashboardPage.tsx BalanceCard.tsx ActivityDonut.tsx QuickMenu.tsx
│     │  ├─ transactions/  TransactionsPage.tsx FilterBar.tsx LedgerTable.tsx EntryForm.tsx
│     │  ├─ budgets/       BudgetsPage.tsx CategoryBudgetCard.tsx BudgetForm.tsx AlertsPanel.tsx
│     │  ├─ insights/      InsightsPage.tsx HeroSummary.tsx RecommendationCard.tsx
│     │  ├─ reports/       ReportsPage.tsx IncomeExpenseBars.tsx CategoryTotals.tsx
│     │  └─ notifications/ NotificationBell.tsx
│     └─ test/         setup.ts money.test.ts budgets.test.ts insights.test.ts filters.test.ts
└─ docs/
   ├─ stitch_design/   # Unpacked HTML screens & plumledger_design_system.md
   ├─ report.md
   ├─ test-plan.md
   ├─ traceability.md
   └─ screenshots/
```

## 6. Security & Privacy (Frontend Milestone)
- Passwords hashed with Web Crypto SHA-256 before storing user profiles in `localStorage` (never stored in plaintext).
- Every repository method requires `userId`; users cannot view or mutate another user's records.
- No `dangerouslySetInnerHTML`; all user strings rendered safely via JSX text nodes.
- Sign-up requires explicit consent checkbox (DPDP Act 2023); profile menu provides "Delete Account & Data" which wipes all records for that `userId`.

## 7. Future Backend Integration Contract
When adding the FastAPI backend later, implement `ApiRepository` conforming to `DataRepository` in `src/repositories/repository.ts` mapping 1:1 to `/api/v1/{auth,transactions,budgets,dashboard,reports,insights,notifications}`.