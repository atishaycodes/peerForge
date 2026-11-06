# Requirements Specification — PeerForge MVP

## Functional Requirements

### 1. Authentication & User Profiles (AUTH)
- **AUTH-01:** Users can register with full name, email, and password.
- **AUTH-02:** Users can log in using email and password via JWT authentication.
- **AUTH-03:** Users have an editable developer profile with target roles, primary tech stack (languages/frameworks), and time zone.
- **AUTH-04:** Protect authenticated routes on frontend and endpoints on backend.

### 2. Matchmaking & Scheduling (MATCH)
- **MATCH-01:** Users can browse or request instant pairing for a practice session by category (e.g. DSA, Frontend, Backend).
- **MATCH-02:** Users can schedule upcoming interview slots and accept pairing invitations.
- **MATCH-03:** Real-time socket notification when a match is found and both users are ready.

### 3. Live Interview Room (ROOM)
- **ROOM-01:** Direct peer-to-peer WebRTC video and audio connection between two participants.
- **ROOM-02:** Real-time synchronized code editor with syntax highlighting and multi-language support.
- **ROOM-03:** Role switcher (Interviewer ↔ Candidate) and built-in session timer (e.g., 45-60 min split).
- **ROOM-04:** Interview question prompt selector for the active interviewer.

### 4. Feedback & Reviews (FEED)
- **FEED-01:** Post-session evaluation form with standardized rubric (Code correctness, Problem solving, Communication, System design).
- **FEED-02:** Both peers must submit feedback before ratings are unlocked.
- **FEED-03:** Private qualitative feedback notes visible only to the candidate.

### 5. Dashboard & Analytics (DASH)
- **DASH-01:** Overview of past interview sessions and attendance history.
- **DASH-02:** Aggregated skill ratings and feedback trend charts.
- **DASH-03:** Upcoming scheduled sessions list with one-click room launch.

## Non-Functional Requirements

- **PERF-01:** WebRTC connection establishment under 3 seconds in standard network conditions.
- **PERF-02:** Real-time code synchronization latency < 150ms over Socket.IO.
- **SEC-01:** Passwords hashed with bcrypt; JWT stored securely in HTTP-only cookies or secure headers.
- **SEC-02:** Room access restricted strictly to paired participants.
