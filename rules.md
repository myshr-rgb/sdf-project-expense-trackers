# rules.md — Rules, Boundaries and Conventions

Keywords: **MUST**, **MUST NOT**, **SHOULD**. Violating a MUST is a bug.

## 1. Scope boundaries
- MUST NOT connect to bank accounts, UPI, cards or any payment API. MUST NOT move real money.
- MUST NOT scaffold a Python/FastAPI backend in this assignment milestone (frontend-only per assignment scope; keep `DataRepository` clean for future backend integration).
- MUST NOT add features outside `prd.md`. Propose them in `memory.md` → Open questions.
- MUST NOT change requirement IDs (FR1–FR12, NFR1–NFR10).
- MUST keep the product single-currency (₹) and single-user-per-account.

## 2. Workflow rules
1. Work one phase at a time; finish its exit checklist before the next.
2. Small tasks, run lint + type-check + tests after each. Never leave the build red at a checkpoint.
3. Update `memory.md` at every checkpoint (end of task group/phase, any decision, any blocker).
4. Prefer the simplest solution that meets the requirement. No speculative abstractions.
5. Commit messages: `type(scope): summary [FRx/NFRy]` (types: feat, fix, test, docs, refactor, chore).
6. Do not rewrite or delete working code unrelated to the current task.
7. If blocked by missing info, pick the simplest compliant default, log it in `memory.md`, and continue.

## 3. Libraries
### Allowed (frontend)
`react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, `tailwindcss` (v3), `postcss`, `autoprefixer`, `clsx`, `date-fns`, test libs (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@playwright/test`), ESLint/Prettier.
### Not allowed without a recorded decision in memory.md
Chart libraries, UI kits (MUI, Chakra, Bootstrap), CSS-in-JS, Redux, moment.js, lodash (use native/`date-fns`), any package requiring a paid licence.
### Fonts/icons
Afacad Flux, Instrument Sans, Spline Sans Mono, Material Symbols Outlined (loaded via Google Fonts in `index.html` / `index.css`). No other icon sets.

## 4. Coding standards
- TypeScript `strict: true`; no `any` (use `unknown` + narrowing).
- Functions short and single-purpose; files ≤ ~300 lines; one component per file.
- Names: React components `PascalCase`, hooks `useX`, services/utils `camelCase`.
- No dead code, no commented-out code, no `console.log` left behind.
- Constants and magic numbers (thresholds 80/90/100, score weights) live in one config module.
- Dates: store as ISO `YYYY-MM-DD`; display with `en-IN` locale; timezone `Asia/Kolkata` for "today" and month boundaries.

## 5. Money and calculation rules (NFR8)
- MUST store and compute money as **integer paise**. MUST NOT use floating point for money.
- Convert to rupees only at the display edge (`formatINR`).
- Percentages rounded half-up to whole numbers for display; compute from raw integers.
- Every aggregate (balance, savings, budget %, health score) MUST have a unit test with at least one edge case (zero income, zero budget, exceeded budget).
- Savings = total income − total expenses (month). Remaining budget = overall cap − total expenses. Guard division by zero.

## 6. Security and privacy rules (NFR1, NFR9)
- MUST hash passwords via Web Crypto SHA-256 before saving user objects; MUST NOT store plaintext passwords.
- MUST filter every repository query by `userId`; accessing another user's record throws `NotFoundError`.
- MUST validate all inputs via Zod schemas before persisting.
- MUST NOT put secrets in code or git history.
- MUST avoid `dangerouslySetInnerHTML`; render user text as JSX text nodes only (the prototype HTML used `innerHTML` for new rows — do not copy that).
- Sign-up MUST show a consent checkbox/line for storing financial data (DPDP Act 2023); account deletion MUST be possible and wipe all records for that user.

## 7. AI boundaries
- All numbers shown in an insight MUST come from deterministic computed facts (`FactsBuilder`). Never fabricate numbers.
- Tone: short, kind, concrete, ≤ 2 sentences per recommendation.
- Always label AI content with the sparkle icon + "AI" wording, and show that figures are estimates.
- Keep a short disclaimer on the Insights page: "Suggestions are estimates based on your own entries, not financial advice."

## 8. Error handling
- Every data-fetching view MUST implement: **loading** (skeleton), **empty** (friendly message + action), **error** (message + retry), **success**.
- Form errors appear under the field, in plain language; submit button disabled while pending.
- Destructive actions need confirmation and offer a toast confirmation.
- Global `ErrorBoundary` with a calm fallback screen.

## 9. UI rules (details in design.md and docs/stitch_design/)
- Use design tokens only; MUST NOT hard-code hex values in components (use Tailwind classes from `tailwind.config.ts` or CSS variables).
- Minimalist: one primary action per view, generous spacing, no decorative clutter.
- Accessibility: WCAG AA contrast, visible focus ring, labels on every input, `aria-pressed` on toggle chips, `role="alert"` for budget alerts, keyboard operable, respect `prefers-reduced-motion`.
- Do not convey status by colour alone: pair with text/icon ("Exceeded", "Near limit", "On track").
- Match the HTML designs in `docs/stitch_design/`; build responsive mobile, empty, loading, and error states using the same tokens.

## 10. Testing rules
- New logic ships with tests. Bug fix ships with a regression test.
- Reset `localStorage` cleanly between test cases.
- Do not lower coverage thresholds to pass.

## 11. Git and files
- Branch per phase: `phase-N-short-name` (if using git).
- MUST NOT commit `node_modules`, `.env`, build output (`dist/`).
- Do not rename/move the seven root `.md` files.

## 12. Known inconsistencies in the supplied designs (handle as follows)
| Issue | Rule |
| --- | --- |
| Auth screen says "Private & Local-First Tracking" | Change copy to "Private & Secure Tracking" for consistency with PRD/design.md |
| Demo numbers don't reconcile (category spend sums to ₹14,350 on Budgets vs ₹13,750 total expenses; Reports "Shopping & Other ₹2,400") | Real data is computed dynamically from transactions, never hard-coded. For the demo seed data, ensure all numbers reconcile accurately |
| Overall cap ₹20,000 vs sum of category caps ₹19,500 | Allowed (overall cap is independent), show helper text if category caps exceed overall cap |
| Prototype header "Hello, Shrusti!" and sidebar name are hard-coded | Read dynamically from the logged-in user profile |
| Design has no empty/loading/error/mobile states | Build them from tokens per §8 and `design.md` |