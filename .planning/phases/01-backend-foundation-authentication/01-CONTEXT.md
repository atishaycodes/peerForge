# Phase 01: Backend Foundation & Authentication - Context

**Gathered:** 2026-11-06
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase establishes the foundational backend infrastructure and authenticates users end-to-end. It delivers a running Express.js server, MongoDB database connectivity with Mongoose, user schemas, secure JWT authentication endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`), and connects the live API to the existing React frontend `LoginForm.jsx`, backed by React Router and a minimalist protected Dashboard.

</domain>

<decisions>
## Implementation Decisions

### Server Structure & Dev Setup
- **D-01:** Dedicated `/server` directory for Express backend, models, routes, and middleware, managed via a single shared root `package.json` with `concurrently` (running `npm run dev` boots both client and server).
- **D-02:** Vite development proxy configured at `/api` -> `http://localhost:5000` to eliminate CORS issues and align with production routing.

### JWT & Session Storage Strategy
- **D-03:** Store JWT authentication tokens in an HTTP-only, `SameSite=Lax`, secure cookie (`auth_token`) for defense against XSS.
- **D-04:** Single 7-day JWT token strategy for simplicity, robustness, and fast delivery in MVP launch.

### User Model & Registration Fields
- **D-05:** Instant account activation upon registration — user is registered and authenticated immediately without third-party email service dependencies.
- **D-06:** Unified Mongoose `User` schema storing credentials (`name`, `email`, `passwordHash`) and an embedded `profile` subdocument pre-initialized with empty defaults for Phase 2 skills/preferences.

### Post-Auth Flow & Client Routing
- **D-07:** Introduce `react-router-dom` to the frontend with a `ProtectedRoute` wrapper component. Route `/login` renders the current split-screen auth page; `/dashboard` renders the authenticated interface.
- **D-08:** Minimalist authenticated Dashboard component displaying logged-in user details, avatar initials, phase readiness status, and a functioning Logout button that clears the session cookie and redirects to `/login`.

### the agent's Discretion
- Selection of specific bcrypt salt rounds (10-12 recommended).
- Detailed Express error handling middleware and validation library (e.g. Zod or Mongoose validators).
- React Auth Context / Provider implementation details for managing client-side user session state.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `.planning/PROJECT.md` — Core vision, architecture, and technology stack.
- `.planning/REQUIREMENTS.md` — Functional requirements AUTH-01 through AUTH-04.
- `.planning/ROADMAP.md` — Scope and milestone sequencing for Phase 1.

### Existing Codebase References
- `src/components/LoginForm.jsx` — Existing dual-mode (Sign In / Sign Up) form component to connect to backend endpoints.
- `vite.config.js` — Vite server configuration to receive the `/api` proxy definition.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/LoginForm.jsx`: Contains ready UI inputs for Name, Email, Password, Confirm Password, Remember Me, and form submission states.
- `src/components/AsciiArt.jsx`: Reusable animated visualizer video component for the left panel.

### Established Patterns
- Tailwind CSS utility classes with custom theme variables in `tailwind.config.js`.
- ES Modules (`"type": "module"` in `package.json`).

</code_context>

<specifics>
## Specific Ideas

- The backend should expose:
  - `POST /api/auth/register` (body: `{ name, email, password }`)
  - `POST /api/auth/login` (body: `{ email, password }`)
  - `POST /api/auth/logout` (clears cookie)
  - `GET /api/auth/me` (returns currently authenticated user)
- Ensure credentials: 'include' (or axios/fetch credentials support) is configured so cookies travel smoothly through the Vite dev proxy.

</specifics>

<deferred>
## Deferred Ideas

- Email verification and password reset workflows (SendGrid/Nodemailer) — deferred post-MVP.
- OAuth 2.0 Google / GitHub social login backend handshake — buttons remain UI visual placeholders in Phase 1.
- Detailed developer skills, interview preferences, and bio editing — scoped to Phase 2 (User Profiles & Developer Preferences).

</deferred>

