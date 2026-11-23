---
name: "PlumLedger"
description: "A warm, calm, pill-layered personal finance design system pairing deep plum authority with soft peach-cream clarity."
---

# PlumLedger Design System

## Overview

PlumLedger is designed for students and early-career earners managing daily income, expenses, budgets, and AI-powered financial insights. The interface balances **modern minimalism** with **warm tonal layering** inspired by stacked pill cards: deep plum surfaces anchor high-priority balance and AI insight cards, while soft blush and peach-cream surfaces keep daily transaction lists, category breakdowns, and controls effortless to scan.

- **Audience:** Students and young professionals tracking daily spending without spreadsheet fatigue.
- **Personality:** Calm, trustworthy, encouraging, and uncluttered—never intimidating or clinical.
- **Visual Style:** Clean tonal layering with generous whitespace, pill-shaped action controls, and large rounded-corner cards (`24px`–`32px`).

## Colors

The palette preserves the six signature PlumLedger tones—from deep `#190019` midnight plum to `#FBE4D8` peach cream—alongside WCAG AA contrast-verified semantic roles for light and dark surfaces.

- **Brand & Palette Tokens:** `midnight-plum` (`#190019`), `royal-plum` (`#2B124C`), `velvet-plum` (`#522B5B`), `dusty-mauve` (`#854F6C`), `warm-blush` (`#DFB6B2`), and `peach-cream` (`#FBE4D8`) are used for stacked hero cards, category pills, and chart series.
- **Semantic Status:** `success` (income & savings goals), `warning` (approaching budget threshold), and `error` (exceeded budget or destructive actions) are reserved strictly for financial state signals, never decorative fills.

```yaml
colors:
  midnight-plum: "#190019"
  royal-plum: "#2B124C"
  velvet-plum: "#522B5B"
  dusty-mauve: "#854F6C"
  warm-blush: "#DFB6B2"
  peach-cream: "#FBE4D8"
  success: "#1B6B45"
  on-success: "#FFFFFF"
  success-container: "#D3F3E0"
  on-success-container: "#0B3B24"
  warning: "#9A4D00"
  on-warning: "#FFFFFF"
  warning-container: "#FFE6CC"
  on-warning-container: "#5C2D00"
  light:
    primary: "#3A1444"
    on-primary: "#FFFFFF"
    primary-container: "#522B5B"
    on-primary-container: "#FBE4D8"
    secondary: "#834D6A"
    on-secondary: "#FFFFFF"
    secondary-container: "#FFBBDD"
    on-secondary-container: "#4E203B"
    tertiary: "#5D3F3D"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#DFB6B2"
    on-tertiary-container: "#190019"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#93000A"
    background: "#FDF7F4"
    on-background: "#190019"
    surface: "#FDF7F4"
    surface-dim: "#F2E4DE"
    surface-bright: "#FFFFFF"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#FAF0EC"
    surface-container: "#F5E7E1"
    surface-container-high: "#EFE0DA"
    surface-container-highest: "#E8D5CE"
    on-surface: "#190019"
    surface-variant: "#ECDFE9"
    on-surface-variant: "#4D444D"
    outline: "#7E747D"
    outline-variant: "#D0C3CD"
    inverse-surface: "#2B124C"
    inverse-on-surface: "#FBE4D8"
    inverse-primary: "#E8B5EF"
    shadow: "#190019"
    scrim: "#190019"
  dark:
    primary: "#E8B5EF"
    on-primary: "#472150"
    primary-container: "#522B5B"
    on-primary-container: "#FBE4D8"
    secondary: "#F6B3D4"
    on-secondary: "#4E203B"
    secondary-container: "#683652"
    on-secondary-container: "#FBE4D8"
    tertiary: "#E6BDB9"
    on-tertiary: "#442927"
    tertiary-container: "#4F3331"
    on-tertiary-container: "#FBE4D8"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#190019"
    on-background: "#FBE4D8"
    surface: "#190019"
    surface-dim: "#190019"
    surface-bright: "#452D67"
    surface-container-lowest: "#140014"
    surface-container-low: "#2B124C"
    surface-container: "#351A54"
    surface-container-high: "#43245E"
    surface-container-highest: "#522B5B"
    on-surface: "#FBE4D8"
    surface-variant: "#4D444D"
    on-surface-variant: "#DFB6B2"
    outline: "#998D97"
    outline-variant: "#522B5B"
    inverse-surface: "#FBE4D8"
    inverse-on-surface: "#190019"
    inverse-primary: "#522B5B"
    shadow: "#000000"
    scrim: "#000000"
```

## Typography

PlumLedger pairs **Afacad Flux** (geometric sans) for expressive, clean headlines and balance figures with **Instrument Sans** (neo-grotesque sans) for crisp, legible UI copy and **Spline Sans Mono** for tabular transaction IDs and budget ratios. All currency and numeric metrics use `tabular-nums` so columns align vertically.

```yaml
typography:
  display-lg:
    fontFamily: "Afacad Flux"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 44px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Afacad Flux"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Afacad Flux"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 34px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: "Afacad Flux"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0px
  title-lg:
    fontFamily: "Instrument Sans"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  title-md:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Instrument Sans"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0px
  body-md:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "Instrument Sans"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Instrument Sans"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0.3px
  mono-sm:
    fontFamily: "Spline Sans Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
```

## Layout & Spacing

Mobile-first (`390px` viewport) with a single-column vertical flow and `20px` horizontal page padding. Desktop (`1280px+`) expands into a centered `1200px` max-width 12-column grid with a persistent left navigation rail. A strict `4px` / `8px` spacing scale keeps cards, pill rows, and metrics aligned.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 12px
  gutter-lg: 16px
  gutter-xl: 24px
  section: 32px
  page-margin: 20px
```

## Elevation & Depth

PlumLedger uses **tonal surface layering** rather than heavy drop shadows. Hierarchy is established by stepping between `surface-container-lowest` (`#FFFFFF`), `surface-container-low` (`#FAF0EC`), `peach-cream` (`#FBE4D8`), `warm-blush` (`#DFB6B2`), and deep `royal-plum` (`#2B124C`) / `velvet-plum` (`#522B5B`) hero cards. Subtle `1px` ghost borders (`outline-variant`) separate adjacent light cards without visual clutter.

## Shapes

Inspired by the stacked capsule palette, PlumLedger favors **generous pill and rounded-rectangle geometry**: primary buttons, filter chips, and status badges use full pill radii (`9999px`), while major summary cards and stacked insight panels use `24px` (`xl`) to `32px` (`2xl`) corners.

```yaml
rounded:
  sm: 8px
  DEFAULT: 12px
  md: 16px
  lg: 20px
  xl: 24px
  2xl: 32px
  full: 9999px
```

## Motion & Micro-interaction

Interactions feel calm and responsive. Button presses and chip selections settle in `120ms`, while cards and modal sheets enter with a smooth deceleration curve over `240ms`. Only `transform`, `opacity`, and `color` animate; `prefers-reduced-motion` is respected.

```yaml
motion:
  state-change:
    duration: 120ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 240ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 160ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone:** Supportive, clear, and practical—like a smart friend who makes budgeting feel doable. Avoid financial jargon or scolding.
- **Capitalisation:** Sentence case for headings, buttons, and navigation labels.
- **Action Labels:** Verb-first and specific (`Add Expense`, `Set Monthly Budget`, `View All Insights`), never `Submit` or `OK`.
- **Numbers & Currency:** Format currency consistently with `₹` (Indian Rupee, matching the project's academic context) or clean tabular numerals (`₹14,250`, `68% used`). Dates use concise `23 Nov` format.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Alert** → `@components/alert.html`: `alert-info`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Chip** → `@components/chip.html`: `chip-action`, `chip-input`, `chip-with-icon`
- **Typography** → `@components/typography.html`: `typography-display`, `typography-body`, `typography-label`
