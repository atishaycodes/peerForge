# Project Roadmap — PeerForge MVP

## Overview

A 6-phase incremental delivery plan taking PeerForge from the current UI prototype to a complete, production-ready peer mock interview platform.

---

### Phase 1: Backend Foundation & Authentication
- Initialize Express.js backend server, MongoDB Mongoose schema models (`User`, `Profile`).
- Implement JWT authentication endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- Connect existing React `LoginForm.jsx` to live API endpoints with state management and protected routing.
- Deliverables: Functional authentication flow end-to-end.

### Phase 2: User Profiles & Developer Preferences
- Create profile API endpoints (`GET/PUT /api/profile`) supporting skill tags, bio, interview interests, and availability.
- Build Profile setup and edit screens in React with responsive design.
- Deliverables: User profile management and onboarding.

### Phase 3: Matchmaking Engine & Socket.IO Signaling
- Configure Socket.IO server for real-time signaling, room matching, and presence.
- Implement matchmaking queue (instant match by topic/difficulty) and scheduled interview booking.
- Build matchmaking lobby UI with real-time pairing notifications.
- Deliverables: Users can queue up, find a partner, and get assigned an interview room.

### Phase 4: WebRTC Video/Audio & Collaborative Code Room
- Implement WebRTC peer connection handling with STUN/TURN configuration.
- Integrate synchronized collaborative code editor (Monaco or CodeMirror) over WebSockets.
- Build Interview Room UI: video tiles, editor, terminal output, role switcher, and interview timer.
- Deliverables: Fully functioning live mock interview room with live video and synchronized code.

### Phase 5: Structured Feedback & Evaluation Engine
- Build post-interview feedback rubric API and MongoDB schema (`Feedback`, `Session`).
- Create interactive feedback modal/form submitted immediately after interview completion.
- Implement symmetric reveal logic (feedback revealed once both peers submit).
- Deliverables: Complete post-session peer review cycle.

### Phase 6: Dashboard, History & Verification
- Create developer dashboard displaying past sessions, feedback scores, and performance history.
- End-to-end verification of full user journey (Registration → Matchmaking → Live Interview → Feedback → History).
- Final optimizations and deployment readiness.
- Deliverables: Complete Milestone 1 MVP ready for user testing.
