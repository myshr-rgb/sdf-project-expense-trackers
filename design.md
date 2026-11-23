# design.md — Design System and UI Specification

**Principles:** minimalist, understandable, efficient, accessible to anyone.
1. **One idea per card.** Each card answers one question (How much is left? What should I do?).
2. **Plain language.** "Food budget at 84%", not "Category utilisation threshold reached".
3. **Numbers first.** Large figures, small labels, tabular digits.
4. **Few colours, strong hierarchy.** Plum for structure, peach for emphasis, green/amber/red only for status.
5. **Three taps to log an expense** from anywhere.
6. **Never colour alone.** Status always has text or an icon.
7. **Calm motion.** Short fades only; respect `prefers-reduced-motion`.

Source: the unpacked HTML designs in `docs/stitch_design/` (`sign_in_register_desktop`, `finance_dashboard_desktop`, `transactions_desktop`, `budgets_desktop`, `ai_insights_desktop`, `reports_desktop`, and `plumledger_design_system.md`). Mobile layouts and empty/loading/error states are derived from these exact tokens.

---

## 1. Tokens (Tailwind CSS v3 — copy into `frontend/tailwind.config.ts`)
### Brand palette
| Token | Hex | Use |
| --- | --- | --- |
| `midnight-plum` | `#190019` | Primary text, text on peach |
| `royal-plum` | `#2B124C` | Primary surfaces, buttons, active nav |
| `velvet-plum` | `#522B5B` | Secondary surface on plum, hover |
| `dusty-mauve` | `#854F6C` | Tags on plum surfaces, chart accent |
| `warm-blush` | `#DFB6B2` | Secondary text on plum, chart accent |
| `peach-cream` | `#FBE4D8` | Text on plum, chips, soft highlights |

### Status
| Token | Hex | Container | On-container |
| --- | --- | --- | --- |
| `success` | `#1B6B45` | `#D3F3E0` | `#0B3B24` |
| `warning` | `#9A4D00` | `#FFE6CC` | `#5C2D00` |
| `error` (`light-error`) | `#BA1A1A` | `#FFDAD6` | `#93000A` |

### Light theme surfaces (default)
| Token | Hex |
| --- | --- |
| `light-surface` (page bg) | `#FDF7F4` |
| `light-surface-container-lowest` (cards) | `#FFFFFF` |
| `light-surface-container-low` (inputs, track) | `#FAF0EC` |
| `light-surface-container-high` (progress track) | `#EFE0DA` |
| `light-on-surface` (text) | `#190019` |
| `light-on-surface-variant` (secondary text) | `#4D444D` |
| `light-outline` | `#7E747D` |
| `light-outline-variant` (borders) | `#D0C3CD` |

Dark theme tokens (`dark-*`) are defined in `docs/stitch_design/plumledger_design_system.md`; implement only in P2.

Copy the full token list from `docs/stitch_design/plumledger_design_system.md` / supplied HTML `<script id="tailwind-config">` into `frontend/tailwind.config.ts` verbatim (colors, borderRadius, spacing, fontFamily, fontSize, transition tokens). Do not add new colours.

### Typography
| Role | Font | Notes |
| --- | --- | --- |
| display / headline | `Afacad Flux` 500–700 | Big numbers and page titles |
| title / body / label | `Instrument Sans` 400–700 | UI text |
| mono | `Spline Sans Mono` 500 | Amounts in lists and badges |

| Token | Size / line | Weight |
| --- | --- | --- |
| `display-lg` | 40/44 (mobile 32/36) | 700 |
| `headline-lg` | 28/34 | 600 |
| `headline-md` | 22/28 | 600 |
| `title-lg` | 18/24 | 600 |
| `title-md` | 16/22 | 600 |
| `body-lg` | 15/22 | 400 |
| `body-md` | 14/20 | 400 |
| `label-lg` | 14/20 | 600 |
| `label-md` | 12/16 | 500 |
| `label-sm` | 11/14 | 500 |
| `mono-sm` | 12/16 | 500 |

All amounts use `tabular-nums`.

### Shape, spacing, motion
- Radius: `sm` 8, `DEFAULT` 12, `md` 16, `lg` 20, `xl` 24, `2xl` 32, `full` (pills/buttons/chips). Cards = `2xl`; small tiles/inputs = `xl`.
- Spacing tokens: `gutter-xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24, `section` 32, `page-margin` 20.
- Motion: state-change 120 ms ease-out; surface-enter 240 ms; surface-exit 160 ms. No bouncing or parallax.

---

## 2. Layout
### Desktop (≥ 1024 px)
- Fixed sidebar `w-64` (white, right border) + main area (`max-w-7xl`, 24 px padding).
- Sticky header: small context label, `headline-lg` title, right side: search (where relevant), month pill, notification icon button.
- Content grid: 12 columns, 24 px gap. Typical split 8 + 4.

### Mobile (< 1024 px)
- Sidebar hidden; **bottom navigation** with 5 items (Dashboard, Transactions, Budgets, Insights, Reports), active item filled plum pill.
- Header compacts: title + bell. Page margin 20 px; cards stack to one column; 3-column grids become 1 column (or 2 for quick menu).
- Tables become list rows (title + category/date on the left, amount right). Entry form opens as a full-height bottom sheet; floating "+" button for Add Entry.
- Minimum tap target 44 × 44 px.

### Navigation
Dashboard · Transactions · Budgets · AI Insights · Reports. Active item: `bg-royal-plum text-peach-cream`, filled icon. Inactive: `text-light-on-surface-variant`, hover `bg-peach-cream`.

---

## 3. Components
| Component | Spec |
| --- | --- |
| **Button – primary** | `bg-royal-plum text-peach-cream`, pill, `label-lg`, py 12; hover `velvet-plum` |
| **Button – on-dark / secondary** | `bg-peach-cream text-midnight-plum`; hover `warm-blush` |
| **Button – icon** | 40 px circle, white, border `outline-variant`; hover peach |
| **Button – destructive (icon)** | text `light-error`; hover bg `light-error-container` |
| **Card – filled** | `bg-royal-plum text-peach-cream rounded-2xl p-6`; inner tiles `bg-velvet-plum rounded-xl` |
| **Card – outlined** | white, 1 px `outline-variant`, `rounded-2xl p-6` |
| **Card – action** | `bg-velvet-plum` with one CTA button (AI card) |
| **Chip – filter** | pill; selected `royal-plum/peach-cream`; unselected `surface-container-low`; always `aria-pressed` |
| **Badge/Tag** | pill, `label-sm`; neutral peach, success/warning/error containers for status |
| **Input / Select** | `rounded-xl`, bg `surface-container-low`, 1 px border; focus ring 2 px `royal-plum`; label above in `label-md` |
| **Search** | pill input with leading search icon |
| **Progress bar** | track `surface-container-high`, h-2 (h-3 on hero), fill by status: royal/velvet/mauve neutral, `warning` ≥ 80%, `error` ≥ 100% |
| **Alert** | `role="alert"`, container colour by status, icon + title + one line + dismiss |
| **Table row** | `py-3`, divider `outline-variant`, hover `surface-container-low`, amount right-aligned mono |
| **Donut** | SVG r=46, stroke 14, segments from token colours (royal, velvet, mauve, blush) on peach track; centre shows amount + label |
| **Bar chart** | paired bars per month: income `royal-plum`, expenses `warm-blush`, heights computed from data; legend top-right; current month label emphasised |
| **Toast** | bottom-centre (mobile) / bottom-right (desktop), 4 s, dismissible |
| **Modal / Bottom sheet** | scrim `light-scrim` 40%, radius `2xl`, focus trapped, Esc closes |
| **Skeleton** | `surface-container-high` blocks, subtle pulse (off when reduced-motion) |

### Money display
- Expense `-₹180` in `on-surface`; income `+₹8,000` in `success`. Format with `en-IN` grouping (`₹1,25,000`).
- Status wording: **On track** (<80%), **Near limit** (80–99%), **Exceeded** (≥100%).

### Category icons (Material Symbols Outlined)
Food `restaurant` · Transportation `directions_bus` · Education `school` · Shopping `shopping_bag` · Entertainment `movie` · Bills `receipt_long` · Income `payments`. Icon tile: 36–40 px rounded-xl, peach bg (status colour when in warning/error).

---

## 4. Screens
| Screen | Reference File (`docs/stitch_design/...`) | FR |
| --- | --- | --- |
| **Sign In / Create Account** | `sign_in_register_desktop/code.html` | FR1 |
| **Dashboard** | `finance_dashboard_desktop/code.html` | FR2 FR4 FR6 FR7 FR9 FR11 |
| **Transactions** | `transactions_desktop/code.html` | FR2 FR3 FR4 FR6 FR12 |
| **Budgets** | `budgets_desktop/code.html` | FR5 FR11 |
| **AI Insights** | `ai_insights_desktop/code.html` | FR9 FR10 |
| **Reports** | `reports_desktop/code.html` | FR8 |

### Required states (build from tokens)
- **Empty:** icon in peach tile, one sentence, one primary button ("Add your first expense").
- **Loading:** skeletons matching the card shapes.
- **Error:** inline card with warning container, message, "Try again".
- **Form validation:** error text under field in `light-error`, field border `light-error`.

---

## 5. Content and tone
- Short, kind, specific. Prefer verbs: "Cap weekday food delivery".
- Avoid jargon, guilt and fear. Alerts state facts and the next step: "Food budget at 84% — ₹800 left for 7 days."
- Brand copy: tagline "Know where every rupee goes, without spreadsheets." Replace "Local-First" with "Private & Secure Tracking".
- Date format `23 Nov 2026`; month pill `Nov 2026`.

## 6. Accessibility checklist
- Contrast AA: `peach-cream` on `royal-plum` and `midnight-plum` on `peach-cream` pass; verify `warm-blush` text on `royal-plum` for body text ≥ 14 px and `dusty-mauve` tags with `peach-cream` text.
- All inputs labelled; icons decorative `aria-hidden`; icon-only buttons have `aria-label`.
- Visible focus ring everywhere; logical tab order; modals trap focus.
- Do not rely on colour; status text always present.
- Support 200% zoom without horizontal scroll; support `prefers-reduced-motion`.

## 7. Do / Don't
**Do:** reuse components, keep one primary button per view, keep whitespace, show the next action on every alert.
**Don't:** add gradients, shadows, extra colours, emojis, decorative illustrations, auto-playing animation, or more than 4 items in a quick-action row.