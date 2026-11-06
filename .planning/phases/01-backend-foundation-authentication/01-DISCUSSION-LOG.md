# Phase 01: Backend Foundation & Authentication - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-06
**Phase:** 01-backend-foundation-authentication
**Areas discussed:** Server Structure & Dev Setup, JWT & Session Storage Strategy, User Model & Registration Fields, Post-Auth User Flow

---

## Server Structure & Dev Setup

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated /server directory with shared root package.json & concurrently | Single root dependencies, run "npm run dev" to boot both client and server | ✓ |
| Separate /server package.json | Distinct dependencies for backend in /server/package.json | |

| Option | Description | Selected |
|--------|-------------|----------|
| Vite Dev Proxy (/api -> http://localhost:5000) | Eliminates CORS issues in local development and mimics production routing | ✓ |
| Explicit CORS middleware | Frontend calls http://localhost:5000 directly with credentials | |

**User's choice:** Dedicated `/server` directory with shared root package.json, `concurrently`, and Vite `/api` proxy.

---

## JWT & Session Storage Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| HTTP-only Cookie | Stores JWT securely in an HTTP-only, SameSite cookie (best security against XSS) | ✓ |
| localStorage with Authorization Header | Client stores token in localStorage and attaches "Bearer <token>" header | |

| Option | Description | Selected |
|--------|-------------|----------|
| Single Long-Lived JWT (e.g. 7 days) | Clean, robust, and minimal complexity for MVP launch | ✓ |
| Dual Token (Access Token 15m + Refresh Token 7d) | Higher security with token rotation | |

**User's choice:** HTTP-only Cookie with single 7-day JWT token strategy.

---

## User Model & Registration Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Instant Account Activation | User is registered and logged in immediately without email confirmation | ✓ |
| Email Verification Required | User receives a verification link/code before their account is activated | |

| Option | Description | Selected |
|--------|-------------|----------|
| Unified User Schema with Profile Subdocument | Stores name, email, password, and embedded profile (ready for Phase 2 skills) | ✓ |
| Separate User & Profile Collections | User handles credentials/auth, Profile handles developer bio and skills | |

**User's choice:** Instant account activation and unified User schema with embedded Profile subdocument in MongoDB.

---

## Post-Auth User Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Introduce React Router (react-router-dom) with Protected Routes | /login renders split screen, /dashboard renders authenticated app | ✓ |
| State-driven View Switch | Single-page view toggle between Auth view and Dashboard based on auth context | |

| Option | Description | Selected |
|--------|-------------|----------|
| Minimalist Authenticated Dashboard | Displays user info, avatar/initials, phase status, and a functioning Logout button | ✓ |
| Direct Onboarding / Profile Setup Placeholder | Prompts user to fill in their initial profile details immediately | |

**User's choice:** React Router with Protected Routes and a minimalist authenticated Dashboard.

---

## the agent's Discretion

- Choice of bcrypt salt rounds (10).
- Detailed validation rules and error responses.
- React Auth Context implementation specifics.

## Deferred Ideas

- Email verification and password recovery flows.
- OAuth 2.0 social login backend handshake.
- Extended developer profile customization and skill badges (scoped to Phase 2).
