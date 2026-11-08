# Phase 6: Dashboard, History & Verification — Context

**Gathered:** 2026-11-08
**Status:** Locked

## <domain>
Phase 6 delivers the final developer workspace experience and end-to-end milestone readiness for PeerForge:
- Developer dashboard showcasing past interview session history and attendance records (DASH-01).
- Aggregated competency ratings and performance metrics (DASH-02).
- Upcoming scheduled slots list with 1-click room launch (DASH-03).
- End-to-end verification of the full user lifecycle (Registration → Profile → Match/Lobby → Live Room → Feedback → Dashboard).

## <canonical_refs>
- `REQUIREMENTS.md` (Sections: DASH-01, DASH-02, DASH-03, PERF-01, PERF-02, SEC-01, SEC-02)
- `MY_DEFAULT_GUIDELINES.md` (Design principles: quiet graphite chrome, zero AI slop, no fake stats/counters, honest empty states)
- `server/models/Session.js` (Session schema with roomId, track, difficulty, participants, status, timestamps)
- `server/models/Feedback.js` (Feedback schema with 4-dimension scores, qualitative strengths/improvements, privateNotes, isRevealed)

## <codebase_context>
- `src/pages/Dashboard.jsx` — Existing developer dashboard page displaying user identity, profile essentials completion banner, tech stack badges, and lobby entry card.
- `server/routes/feedbackRoutes.js` & `server/controllers/feedbackController.js` — Feedback query and symmetric reveal logic.
- `src/components/feedback/UnlockedScorecard.jsx` — Existing scorecard UI featuring 4 competency meters, strengths, improvements, and private notes. Can be reused inside the session detail drawer.

## <decisions>

### 1. Session History Presentation
- **Format:** Tabular list displaying track, peer monogram/name, date & time, status, and composite rating badge.
- **Detail View:** Right-side Slide-over Sheet / Drawer that opens on session row click.
- **Drawer Contents:** Full scorecard breakdown (Code Correctness, Problem Solving, Communication, Architecture scores), Key Strengths, Actionable Improvements, and Private Candidate Notes.
- **Empty State:** Honest, quiet empty state ("No interview sessions completed yet. Practice in the lobby to generate performance feedback.") with CTA to Lobby.

### 2. Performance & Rating Visualization
- **Style:** Compact 4-Competency Rating Summary Card with zero external charting library dependencies.
- **Components:** Overall average rating badge (e.g., "4.2 / 5.0"), completed sessions count, and 4 horizontal progress meters with neutral-to-emerald status fills and exact score indicators.
- **Aesthetic:** Quiet graphite chrome matching Linear/Raycast design language; strictly no fake statistics or decorative blur gradients.

### 3. Dashboard Layout Architecture
- **Layout:** Single unified Split Workspace layout.
  - **Top Row:** Identity & Profile Card + Matchmaking Quick Action Card + Performance Rating Summary Card.
  - **Middle Section:** Upcoming Scheduled Slots (with 1-click launch or schedule CTA).
  - **Bottom Section:** Past Interview Sessions Table with search/filter by track, accompanied by the slide-over detail drawer.

### 4. Backend Endpoints
- `GET /api/sessions/history` — Returns authenticated user's past sessions with associated feedback (if revealed) and peer profile details.
- `GET /api/sessions/upcoming` — Returns scheduled upcoming interview slots for the authenticated user.
- `GET /api/sessions/analytics` — Aggregates user's average scores across the 4 competencies and total sessions count.

### 5. End-to-End Milestone Verification
- Verify entire flow: Register new candidate -> Setup developer profile -> Join Matchmaking Lobby -> Accept pairing -> Code Room WebRTC & Monaco -> Leave & Submit Rubric -> Blind reveal unlocked -> View scorecard & analytics on Dashboard.

## <deferred>
- Complex radar charts and D3 analytics (deferred to Milestone 2; pure CSS/SVG meters fulfill DASH-02 cleanly).
- Calendar sync (Google Calendar / iCal integration) for scheduled slots (deferred to Milestone 2).

