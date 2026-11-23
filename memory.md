# memory.md — Project Memory and Checkpoint Log

> Living document. **Update at every checkpoint** (end of each task group/phase, any decision, blocker or change of plan). Keep entries short. Newest checkpoint on top in the log. Never delete history; correct it with a new entry.

## 0. Status snapshot (overwrite each checkpoint)
| Field | Value |
| --- | --- |
| Project | PlumLedger — AI-Powered Smart Personal Finance & Expense Tracker |
| Last updated | 24 Nov 2026 |
| Current phase | Phase 1 complete |
| Phase progress | 2 / 10 phases signed off |
| Build status | Lint, typecheck, Prettier and production build pass |
| Tests | 31 passing across four files, including the jsdom entry-point smoke test |
| Blockers | None |
| Next action | Phase 2 transaction CRUD, starting with user-scoped writes and integer-paise validation |

## 1. What has happened (history)
| Date | Checkpoint | Summary |
| --- | --- | --- |
| 24 Nov 2026 | CP-04 Phase 1 | Versioned per-account storage, seven default categories, reconciled demo seed, auth, deletion and five protected shell routes. All 31 tests pass. Edge verified desktop and mobile navigation, deep links, session persistence and logout. |
| 24 Nov 2026 | CP-03 Phase 0 | Installed dependencies and lockfile verified. RTL/jsdom render, 19 utility tests, lint and typecheck passed. Phase 0 signed off. |
| 24 Nov 2026 | CP-02 Phase 0 | Scaffolded React 18, Vite, strict TypeScript and Tailwind v3. Verified every theme section against all six HTML exports. Added core types, integer-paise and Kolkata date utilities, project stubs and CI. All four Phase 0 exit commands succeed on the installed toolchain. Component test dependencies still require an online install. |
| 23 Nov 2026 | CP-01 Scope Alignment | Reviewed all 7 spec files and the Stitch UI zip (`stitch_custom_ui_design_implementation.zip`). Standardized root filenames, aligned implementation scope to **frontend-first** (`LocalStorageRepository` + deterministic rule-based insights) per assignment guidelines while preserving `DataRepository` for future FastAPI backend integration, and aligned Tailwind v3 config references. |
| 23 Nov 2026 | CP-00 Planning | Initial specs created from the CSC203B requirements report and six desktop HTML designs. No code written yet. |

## 2. What is happening now
- Phase 1 is signed off. The five routes provide the responsive shell for subsequent feature work.

## 3. What is next
1. Implement Phase 2 transaction CRUD through the repository and service layer.

## 4. Decisions log
| ID | Date | Decision | Reason |
| --- | --- | --- | --- |
| D-01 | 23 Nov 2026 | Build **frontend-first** (`LocalStorageRepository` + deterministic AI engine) for this assignment, keeping `DataRepository` interface ready for future FastAPI backend | Assignment requires only the frontend for now, with backend planned for a future phase |
| D-02 | 23 Nov 2026 | Frontend stack: React 18 + Vite + TypeScript + Tailwind CSS v3 | Matches supplied Tailwind HTML designs 1:1 |
| D-03 | 23 Nov 2026 | Unpack Stitch UI zip into `docs/stitch_design/` | Gives coding agent direct access to exact HTML markup and `plumledger_design_system.md` tokens |
| D-04 | 23 Nov 2026 | Money stored and computed as integer paise | NFR8 calculation accuracy |
| D-05 | 23 Nov 2026 | AI = deterministic `FactsBuilder` + `RuleRecommender` + weighted `HealthScore` | Works offline without API keys and prevents hallucinated figures |
| D-06 | 23 Nov 2026 | No chart library; hand-built SVG/CSS charts | Matches designs 1:1 with zero extra bundle bloat |
| D-07 | 23 Nov 2026 | Hash user passwords with Web Crypto SHA-256 in client storage; include one-click Demo Login | Satisfies NFR1/NFR9 while making evaluator testing effortless |
| D-08 | 23 Nov 2026 | Replace "Local-First" copy with "Private & Secure Tracking" | Aligns UI copy with PRD and design guidelines |
| D-09 | 24 Nov 2026 | Preserve the supplied seven `*_md.md` originals and use canonical filenames for ongoing work. | Maintains the supplied files and resolves the paths used throughout the specs. |

## 5. Open questions (answer when possible; do not block on them)
| ID | Question | Default if unanswered |
| --- | --- | --- |
| Q-01 | Is dark theme required for submission? | No (P2 — implement only after Phase 7 if time permits) |
| Q-02 | Is CSV export required for submission? | No (P2 — implement only after Phase 7 if time permits) |
| Q-03 | Final submission format expected by the course leader (Ms. Vaishnavi Tevare) for CO4? | Markdown report in `docs/report.md` + `docs/traceability.md` + live frontend demo |

## 6. Known issues and risks
| ID | Item | Mitigation |
| --- | --- | --- |
| R-01 | Supplied HTML demo numbers do not reconcile (category spend on Budgets sums to ₹14,350 vs ₹13,750 total expenses; Reports "Shopping & Other ₹2,400") | Compute all totals dynamically from transactions; ensure `src/lib/seed.ts` demo data reconciles |
| R-02 | Overall cap ₹20,000 vs category caps total ₹19,500 | Allowed; show helper text if sum of category caps exceeds overall cap |
| R-03 | Prototype Transactions HTML builds rows with `innerHTML` (XSS risk) | Render strictly with JSX text nodes (rules §6) |
| R-04 | Supplied HTML designs cover desktop only and omit empty/loading/error states | Build responsive mobile (`< 1024px`) and empty/loading/error states using exact design tokens |

## 7. Environment and commands (update if they change)
- Frontend dev: `cd frontend && npm run dev` (http://localhost:5173)
- Frontend checks: `cd frontend && npm run lint && npm run typecheck && npm run test`

## 8. Phase tracker
| Phase | Name | Status | Checkpoint |
| --- | --- | --- | --- |
| 0 | Project setup | Complete | CP-03 |
| 1 | Storage repository, auth, app shell | Complete | CP-04 |
| 2 | Transactions CRUD | Not started | — |
| 3 | Search and filters | Not started | — |
| 4 | Budgets and notifications | Not started | — |
| 5 | Dashboard | Not started | — |
| 6 | Reports | Not started | — |
| 7 | AI insights | Not started | — |
| 8 | Responsive, accessibility, polish | Not started | — |
| 9 | Testing, docs, delivery | Not started | — |

## 9. Requirement coverage tracker
| Req | Status | Evidence (test/file) |
| --- | --- | --- |
| FR1 | Verified | src/test/auth.test.tsx covers registration, login, demo, protected routes and logout |
| FR2 | Not started | |
| FR3 | Not started | |
| FR4 | Started | Seven per-account default categories verified in auth.test.tsx |
| FR5 | Not started | |
| FR6 | Not started | |
| FR7 | Not started | |
| FR8 | Not started | |
| FR9 | Not started | |
| FR10 | Not started | |
| FR11 | Not started | |
| FR12 | Not started | |
| NFR6 | Started | Strict typecheck, lint and modular folders |
| NFR8 | Started | Money and date unit tests |
| NFR1, NFR9 | Phase 1 verified | Validation, hashed credentials, consent, account scoping and deletion tests |
| NFR4, NFR5, NFR10 | Started | Versioned repository contract, session restoration and responsive shell |
| NFR2, NFR3, NFR7 | Not started | |

---

## 10. Checkpoint template (copy to section 1 and update sections 0, 8, 9 at each checkpoint)
```
### CP-XX — <short title> — <date>
- Phase/tasks completed:
- Files added/changed (key ones):
- Decisions made (add to §4):
- Tests: <passed/failed counts, coverage>
- Issues found / fixed:
- Open questions added:
- Next action:
```

## 11. Agent reminders
- Read `Agent.md` → `memory.md` → `phases.md` → `rules.md` at the start of each session.
- Do not start a new phase until the exit checklist is complete.
- Update this file before ending the session, even if the work is partial.