# PlumLedger

PlumLedger is a personal finance tracker for students and early-career earners. Create an account or choose **Use Demo Account** to open the five-page navigation shell. Accounts and demo records persist in this browser. Account settings include logout and permanent deletion of the active account's records.

## Local development

Use Node.js 24 and npm. From the project root run

```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Google Fonts supplies Afacad Flux, Instrument Sans, Spline Sans Mono and Material Symbols Outlined. The app requires no credentials or environment variables.

## Verification

Run these commands inside `frontend/`.

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

Vitest runs utility tests in Node. Component tests named `*.test.tsx` use jsdom and React Testing Library with cleanup after each test.

## Project map

- `docs/stitch_design/` contains the six original desktop HTML screens and the design system. Their shared Tailwind theme is in `frontend/tailwind.config.ts`.
- `frontend/src/types/` defines domain records. `frontend/src/lib/` handles integer paise, Indian currency grouping and Kolkata calendar dates.
- `frontend/src/components/`, `features/`, `repositories/` and `services/` follow the boundaries in [architecture.md](architecture.md).
- [phases.md](phases.md) tracks the build checklist. [memory.md](memory.md) records the current checkpoint.
- Docker Compose reserves the deployment entry point. This milestone runs entirely in the browser.
