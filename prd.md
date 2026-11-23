# prd.md — Product Requirements Document

**Product:** PlumLedger — AI-Powered Smart Personal Finance & Expense Tracker
**Version:** 1.1 | **Date:** 23 Nov 2026 | **Owner:** Shrusti M Y (25ETCS002295)
**Course:** CSC203B Software Development Fundamentals, Ramaiah University of Applied Sciences

> **Implementation Scope Note:** Per assignment guidelines, this release implements the **complete frontend application** using a modular client-side data/service layer (`localStorage` + deterministic AI rule engine) so all features work interactively in the browser. The FastAPI backend is designed in `architecture.md` for future integration without changing UI contracts. All original FR/NFR IDs remain unchanged.

---

## 1. Problem
Students and early-career earners cannot say where their money goes. Notebooks and spreadsheets are tedious and get abandoned within weeks. Existing apps rely on manual entry, give little personalised guidance, or hide insights behind paywalls.

## 2. Vision
A calm, minimalist tracker that makes logging fast, shows the month at a glance, warns before overspending, and gives plain-language AI advice on how to save more.

## 3. Target users
| Persona | Description | Needs |
| --- | --- | --- |
| **Primary: Student** (18–24) | Monthly allowance, occasional stipend/freelance income, hostel/food/transport/education spend | Fast entry, simple categories, budget alerts, low-effort insights |
| **Secondary: Young professional** (22–30) | Salary, rent, subscriptions, shopping | Budget caps, trend reports, savings suggestions |
| **Evaluator / Admin** | Reviews CSC203B CO4 deliverables and system design | Clear architecture, test coverage, traceability, live working UI |

Market: India (₹ INR, `en-IN` formatting, DPDP Act 2023 awareness).

## 4. Goals and non-goals
**Goals:** accounts + login flow; income/expense CRUD; categories; budgets + alerts; dashboard + reports; search/filter; AI insights and recommendations; responsive, accessible UI; documented and tested.

**Non-goals (out of scope):** bank/UPI connections, real payments or transfers, multi-currency, receipts OCR, shared/family accounts, investment tracking, native mobile apps, social features.

## 5. Features and acceptance criteria
Priority: **P0** = must ship, **P1** = should ship, **P2** = nice to have.

| ID | Feature | Pri | Acceptance criteria |
| --- | --- | --- | --- |
| FR1 | Register, log in, log out | P0 | Email + password register (password ≥ 8 chars, consent checkbox); login creates user session; protected routes redirect to Sign In; logout clears session; wrong credentials show generic error; demo account quick-fill option available |
| FR2 | Expense CRUD | P0 | Add (title, amount > 0, category, date, optional note), edit, delete (with confirm), view list; changes reflect on dashboard immediately |
| FR3 | Income CRUD | P0 | Same as FR2 with an income source; income shown in green with `+` |
| FR4 | Categories | P0 | Default set: Food, Transportation, Education, Shopping, Entertainment, Bills (+ Income for income). Every expense has exactly one category |
| FR5 | Budgets | P0 | Overall monthly cap + per-category caps per month; progress bar, % used, remaining; states: On track (<80%), Near limit (80–99%), Exceeded (≥100%) |
| FR6 | Search and filter | P0 | Text search (title/category/amount); filter by category, date range (today, last 7 days, month, custom) and amount range; filters combine (AND); results update without full reload |
| FR7 | Dashboard | P0 | Shows balance, total income, total expenses, savings, remaining budget, recent transactions, activity donut, upcoming bill, budget alert, AI insight card |
| FR8 | Reports | P1 | Income vs expenses for the last 6 months; category totals; KPIs (average spend, top category, net savings rate) |
| FR9 | AI insights | P0 | For the selected month: savings potential (₹), financial health score (0–100) with delta vs previous month, ≥ 1 pattern insight with evidence (e.g. "Food delivery up 22% over 10 days") |
| FR10 | AI recommendations | P0 | 1–3 actionable cards each with category, estimated monthly saving (₹), explanation, and an action button (e.g. set weekly/monthly cap) that actually creates the cap/target |
| FR11 | Budget notifications | P0 | In-app alert when a category/overall crosses the user's threshold (80/90/100%); dismissible; bell shows unread count; alert generated at write time, not only at page load |
| FR12 | Update/remove records | P0 | Covered by FR2/FR3 edit and delete; deleting recalculates all aggregates |

### Supporting features
| Feature | Pri | Notes |
| --- | --- | --- |
| Upcoming bills (recurring flag on bills) | P1 | "Hostel & Wi-Fi due in 2 days" card on dashboard |
| Profile menu: view plan name, log out, delete account | P1 | "Student Plan" label; delete account clears user records (NFR9) |
| Export transactions to CSV | P2 | Per month |
| Dark theme | P2 | Tokens already exist; implement only after Phase 7 |

## 6. Non-functional requirements (with measurable targets)
| ID | Requirement | Target / how verified |
| --- | --- | --- |
| NFR1 Security | Secure authentication and data protection | Client-side SHA-256 credential hashing (no plaintext passwords stored), input validation via Zod, XSS-safe React rendering, zero hardcoded secrets |
| NFR2 Performance | Fast responses | UI filter/aggregate updates < 100 ms with 5,000 transactions; LCP < 2.5 s |
| NFR3 Usability | Simple and clear | A new user can add an expense in ≤ 3 interactions from the dashboard; labels in plain English |
| NFR4 Reliability | No data loss | Atomic `localStorage` persistence with schema versioning and reset/seed recovery; add/edit/delete covered by tests |
| NFR5 Scalability | Future growth | Clean `DataRepository` service interface decoupling UI from storage so FastAPI REST endpoints can replace `localStorage` seamlessly |
| NFR6 Maintainability | Modular | Feature-folder frontend architecture, strict TypeScript, ≥ 75% unit/component test coverage on services and calculations |
| NFR7 Availability | Accessible when needed | Offline-capable SPA, documented build and preview commands |
| NFR8 Accuracy | Correct calculations | Money stored as integer paise; aggregate unit tests for balance, savings, budget % |
| NFR9 Privacy | Only the owner sees data | All queries scoped by active `userId`; DPDP consent at sign-up; delete-account wipes all user data |
| NFR10 Compatibility | Common devices | Responsive 360 px → 1440 px; latest Chrome, Edge, Firefox, Safari |

## 7. Key user flows
1. **First run:** Register (or use Demo Login) → dashboard with prompt to add first entry or load sample data → set monthly budget.
2. **Daily use:** Dashboard → "Add Expense" → fill form → Save → totals and budget bars update → alert appears if a threshold was crossed.
3. **Review:** Reports → read trends → AI Insights → apply recommended cap → cap appears on Budgets.
4. **Search:** Transactions → type query / choose chips → table filters instantly.

## 8. AI feature definition (FR9, FR10)
- **Facts first:** a deterministic analyser (`FactsBuilder`) computes savings rate, category shares, week-over-week change, overlapping recurring charges, and budget burn rate. These facts are the only numbers the UI shows.
- **Rule-based recommendations (`RuleRecommender`):** generates concrete, plain-language titles, explanations, and estimated rupee savings directly from computed facts (ready to plug into a future backend LLM phrasing service).
- **Health score (0–100):** weighted: savings rate vs goal (40%), budgets adherence (30%), spending stability (15%), income-expense ratio trend (15%). Document the formula in code and tests.

## 9. Data (high level)
Entities: User, Category, Transaction (type income/expense), Budget (month, category or overall, limit, alert threshold), Notification, InsightSnapshot. Details in `architecture.md`.

## 10. Success metrics (for evaluation)
- All P0 and P1 requirements demonstrably working in a live frontend demo.
- Test report: unit + component + E2E tests green; requirements-to-test traceability table complete (`docs/traceability.md`).
- Lighthouse accessibility ≥ 90 on Dashboard and Transactions.

## 11. Assumptions and constraints
- Single currency ₹; month = calendar month; timezone Asia/Kolkata.
- Frontend-only deliverable for this assignment; backend contract preserved for future phase.
- Solo developer; buildable in phases (`phases.md`).

## 12. Open questions
Tracked in `memory.md` → "Open questions".