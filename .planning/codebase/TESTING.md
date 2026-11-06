# Testing Strategy & State

**Analysis Date:** 2026-11-06

## Current Testing Setup

- **Test Runner:** None currently configured in `package.json` (`"test": "echo \"Error: no test specified\" && exit 1"`).
- **Unit / Component Tests:** Not yet installed. Recommended: Vitest + React Testing Library.
- **E2E Tests:** None currently configured. Recommended: Playwright or Cypress for interview video/signaling tests.

## Verification Workflow

- Build verification via `npm run build` (`vite build`).
- Manual verification via local Vite dev server (`npm run dev` at `http://localhost:3000`).

