# Phase 03: Matchmaking Engine & Socket.IO Signaling - Context

**Gathered:** 2026-11-06
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers real-time matchmaking, Socket.IO server infrastructure, pairing state management, and the Matchmaking Lobby UI. It enables authenticated developers to queue for live mock interviews by track and difficulty, confirms pairing via a mutual 15-second acceptance handshake, supports direct shareable session invite links, and provisions unique room identifiers (`/room/:roomId`) ready for WebRTC signaling in Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Matchmaking Tracks & Difficulty Parameters
- **D-01:** 3 Core Tracks:
  - `Data Structures & Algorithms (DSA)`
  - `Frontend Web Architecture`
  - `Backend & System Design`
- **D-02:** 3 Difficulty Tiers: `Junior / Entry`, `Mid-Level`, `Senior / Staff`. Matchmaker pairs on Track + Difficulty first, with automatic fallback relaxation to Track-only after 45 seconds in queue to minimize wait times.

### Match Confirmation Handshake & Queue Safety
- **D-03:** 15-Second Mutual Accept Handshake:
  - When two peers are paired, Socket.IO emits `match:found` opening a 15-second countdown accept modal for both users.
  - Both developers must click "Accept Match" within 15 seconds.
  - When both accept (`match:confirmed`), a unique interview session room ID is assigned and both users navigate to `/room/:roomId`.
- **D-04:** Queue Safety & Timeout:
  - If a peer declines or times out, the other peer is immediately placed back at the top/front of the priority queue.
  - On socket disconnect (tab closed or network loss), the user is instantly removed from all active queues to prevent phantom pairing.

### Direct Invites & Session Structure
- **D-05:** Direct Session Link Generator:
  - Alongside instant queueing, developers can generate a direct interview invite link (`/join/:inviteCode` or direct room) with their chosen track and difficulty to practice with a friend or colleague.
- **D-06:** Standard 60-Minute Session Template:
  - Pre-configures a standard 60-minute interview split: 30 minutes Interviewer ↔ Candidate with role swap, ready for the Phase 4 timer.

### Lobby UI & Experience
- **D-07:** Dedicated `/lobby` page adhering to `MY_DEFAULT_GUIDELINES.md` and `unslop`:
  - Quiet graphite chrome (`bg-neutral-950`, `border-neutral-800`), 4px grid rhythm.
  - Track & difficulty selector with clear active badges.
  - Live elapsed search timer (`00:00`) with honest status text ("Searching for peer in DSA [Mid-Level]...") and an instant "Cancel Search" button.
  - Zero fabricated stats or fake queue numbers.
  - Direct invite link generator panel.

### Socket.IO Server Architecture
- **D-08:** Express HTTP server in `server/server.js` upgraded with `http.createServer(app)` and `new Server(httpServer, { cors: ... })`.
- **D-09:** Socket authentication middleware verifying JWT from the HTTP-only cookie during handshake. Unauthenticated sockets are rejected.

### the agent's Discretion
- Memory-efficient queue data structures on backend (`server/services/matchmakingService.js`).
- Socket event naming conventions (`match:queue`, `match:found`, `match:accepted`, `match:ready`).
- Micro-interaction animations for queue pulse and countdown rings.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications & Guidelines
- `MY_DEFAULT_GUIDELINES.md` — Universal Product Design Guidelines (clean SaaS UI, honest empty states, no fake data, real functionality).
- `.agents/skills/unslop/skills/unslop/SKILL.md` — 9-pass design discipline (4px grid, single neutral ramp, tabular figures, quiet chrome).
- `.planning/REQUIREMENTS.md` — MATCH-01 (Instant pairing by category), MATCH-02 (Upcoming slots & pairing invitations), MATCH-03 (Real-time socket notification).
- `.planning/ROADMAP.md` — Phase 3 deliverables and milestones.

### Existing Codebase References
- `server/server.js` — Core Express server to be attached to HTTP server and Socket.IO instance.
- `server/middleware/auth.js` — JWT verification logic to adapt for Socket.IO handshake auth.
- `src/context/AuthContext.jsx` — Authenticated user session state.
- `src/pages/Dashboard.jsx` — Dashboard with links to `/lobby`.
- `src/App.jsx` — Application router to receive `/lobby` and `/room/:roomId` routes.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `server/models/User.js`: User model with target roles, skills, and availability status.
- `src/components/ProtectedRoute.jsx`: Guarantees `/lobby` is strictly accessible to logged-in users.
- Lucide React icons: Standardized 16-18px monochrome icons (`Users`, `Play`, `CheckCircle2`, `Clock`, `X`, `Link2`, `Copy`).

### Established Patterns
- Client-server proxy via Vite (`/api` and Socket.IO `/socket.io`).
- Cookie-based session credentials (`credentials: 'include'`).

</code_context>

<specifics>
## Specific Ideas

- Install `socket.io` on server and `socket.io-client` on client.
- Create `src/context/SocketContext.jsx` managing connection lifecycle and matchmaking event listeners.
- Accept modal with a visual 15-second radial progress ring or countdown bar and explicit "Accept Interview" / "Decline" buttons.

</specifics>

<deferred>
## Deferred Ideas

- Full WebRTC video connection & synchronized code editor — scoped to Phase 4 (Live Interview Room).
- Google Calendar sync / ICS file export — deferred post-MVP.

</deferred>

