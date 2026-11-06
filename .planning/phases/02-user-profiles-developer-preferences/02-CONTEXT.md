# Phase 02: User Profiles & Developer Preferences - Context

**Gathered:** 2026-11-06
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers end-to-end user profile management and interview preferences. It establishes the profile API endpoints (`GET /api/profile`, `PUT /api/profile`), extends the embedded profile subdocument with availability preferences and avatar URL, and delivers a clean, responsive `/profile` page along with a non-blocking profile completion flow on the Dashboard.

</domain>

<decisions>
## Implementation Decisions

### Profile Onboarding & Dashboard Integration
- **D-01:** Non-blocking onboarding experience. Users land on the Dashboard immediately upon registration/login. A clean, prominent "Complete Your Profile" progress card and banner invites them to finish setup to become match-ready.
- **D-02:** Profile completion requirements: Target Roles, Primary Tech Stack (Skills), and Time Zone are the core essentials for match-readiness. Bio, external avatar URL, and specific time preference windows are optional.

### Availability & Scheduling Structure
- **D-03:** Dual availability model:
  - Global status toggle: "Actively seeking practice" (Active / Away).
  - General preference windows: Multi-select pills (`Weekday Evenings`, `Weekday Mornings`, `Weekends`, `Flexible`).
  - Stored inside user profile schema: `availability: { isSearching: Boolean, preferredWindows: [String] }`.
- **D-04:** Time Zone: Client auto-detects browser IANA time zone (via `Intl.DateTimeFormat().resolvedOptions().timeZone`) on first load, with a searchable dropdown allowing the developer to change and persist it.

### Profile View & Edit Experience
- **D-05:** Dedicated `/profile` route built with a modern, Linear/Raycast-grade SaaS interface:
  - Read/Overview view showing developer tags, target roles, bio, availability status, and account metadata.
  - Smooth inline or tabbed editing section to update bio, roles, skills, and availability with immediate optimistic updates and real API persistence.
  - Navigation links seamlessly between Dashboard and Profile.
- **D-06:** Avatar display: Refined initials badge as the default with an optional field to provide an external avatar image URL (GitHub / Gravatar profile image URL), with automatic fallback to initials if the URL fails to load.

### Skills & Target Roles Input Paradigm
- **D-07:** Skills input: Curated popular developer tech stack chips (React, Node.js, Python, TypeScript, Go, Java, Docker, AWS, DSA, System Design) with instant click-to-toggle + a custom input field allowing developers to type any custom skill and press Enter or comma to add (with 'x' to dismiss).
- **D-08:** Target Roles input: Multi-select predefined role pills (`Frontend`, `Backend`, `Full Stack`, `Mobile`, `DevOps / Cloud`, `Systems`, `AI / ML`).

### the agent's Discretion
- Validation rules for profile bio length (recommended: 0 - 300 characters).
- UI animation timings and micro-interactions (following `unslop` and `ui-ux-pro-max` guidelines: 150ms transitions, 4px grid rhythm, quiet graphite chrome).
- Exact list of initial curated skill chips.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications & Guidelines
- `MY_DEFAULT_GUIDELINES.md` — Universal Product Design & Development Guidelines (SaaS standards, zero AI slop, no fake data, real functionality).
- `.agents/skills/unslop/skills/unslop/SKILL.md` — 9-pass design discipline (4px grid, graphite ramp, quiet chrome, tabular figures, nested radius).
- `.agents/skills/ui-ux-pro-max/SKILL.md` — Developer platform design system, Dark Mode (OLED/Slate), WCAG contrast.
- `.planning/REQUIREMENTS.md` — AUTH-03 (Users have an editable developer profile).
- `.planning/ROADMAP.md` — Phase 2 deliverables and milestones.

### Existing Codebase References
- `server/models/User.js` — Mongoose User model with embedded `profile` subdocument.
- `server/middleware/auth.js` — JWT authentication middleware to protect profile routes.
- `src/context/AuthContext.jsx` — Global authentication context managing user session.
- `src/pages/Dashboard.jsx` — Main dashboard displaying profile summary and completion prompts.
- `src/App.jsx` — Application routing to receive `/profile`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/context/AuthContext.jsx`: Provides `user`, `loading`, and session synchronization; can expose `updateProfile` or trigger session refresh.
- `src/components/ProtectedRoute.jsx`: Guards `/profile` against unauthenticated access.
- Lucide React: Standardized monochrome 16-18px icons (`User`, `Code2`, `CheckCircle2`, `Clock`, `Sparkles`, `Globe`, `Calendar`).

### Established Patterns
- Express backend mounted under `/api` and forwarded via Vite proxy (`http://localhost:5000`).
- HTTP-only cookie authentication with `credentials: 'include'`.
- Tailwind CSS dark theme with neutral graphite ramp (`bg-neutral-950`, `border-neutral-800`).

</code_context>

<specifics>
## Specific Ideas

- The backend should expose:
  - `GET /api/profile` (returns current user profile and credentials)
  - `PUT /api/profile` (accepts `{ bio, targetRoles, skills, timeZone, avatarUrl, availability }`, updates user document, returns updated user)
- Dashboard should display a profile completion indicator (e.g. `2/3 essentials completed`) and one-click navigation to `/profile`.

</specifics>

<deferred>
## Deferred Ideas

- Social profile links (LinkedIn, GitHub OAuth sync, personal portfolio scraper) — deferred to future profile enhancements.
- Public developer profile preview link (`/u/:username`) — scoped to post-MVP social sharing.
- Resume upload & PDF parsing — out of scope for Phase 2.

</deferred>

