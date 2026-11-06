# Phase 03: Matchmaking Engine & Socket.IO Signaling - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-06
**Phase:** 03-matchmaking-engine-socket-signaling
**Areas discussed:** Queue Topics & Difficulty, Match Confirmation Handshake, Scheduling vs Instant, Lobby UI Placement

---

## Queue Topics & Difficulty Parameters

| Option | Description | Selected |
|--------|-------------|----------|
| 3 Core Tracks (DSA, Frontend, Backend) | Focused high-demand engineering tracks | ✓ |
| 4 Tracks (DSA, Frontend, Backend, Full Stack) | Full Stack separate track | |
| Granular tracks (React, Node, DB, Behavioral) | Too fragmented for early liquidity | |

**User's choice:** 3 Core Tracks (DSA, Frontend Web Architecture, Backend & System Design)
**Difficulty policy:** 3 Tiers (Junior, Mid-Level, Senior) matching Track + Difficulty first, with automatic relaxation to Track-only after 45s.

---

## Match Confirmation Handshake

| Option | Description | Selected |
|--------|-------------|----------|
| 15-second mutual accept modal | Both peers must click Accept Match within 15 seconds before room creation | ✓ |
| Instant room launch | Direct redirect immediately upon match | |
| 10-second accept with audio ping | Shorter window with sound | |

**User's choice:** 15-second mutual accept modal
**Timeout policy:** Re-queue accepted peer at top of priority queue; mark declined peer as away/cancelled.

---

## Scheduled Booking vs Instant Pairing

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid (Instant Queue + Direct Link Generator) | Primary real-time queue + shareable room invite links | ✓ |
| Scheduled slot board | Public calendar availability board | |
| Instant queue only | Pure matchmaking without direct friend invites | |

**User's choice:** Hybrid (Instant Queue + Direct Session Invite Links)
**Session length:** Standard 60 minutes (30 min Interviewer ↔ Candidate split with role swap).

---

## Lobby UI Placement & Real-Time Presence

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated `/lobby` page | Raycast/Linear-style focused lobby with queue timer and direct link generator | ✓ |
| Dashboard-embedded widget | Inline widget directly on /dashboard overview | |
| Modal overlay | Persistent modal overlay across pages | |

**User's choice:** Dedicated `/lobby` page
**Queue feedback:** Live elapsed search timer (00:00) with honest status text and instant Cancel button (no fake queue stats).

---

## the agent's Discretion
- In-memory matchmaking queue service implementation and socket event names.
- Socket authentication middleware verifying HTTP-only cookie JWT during handshake.

## Deferred Ideas
- WebRTC video streaming and synchronized code editor (scoped to Phase 4).
- Google Calendar sync and email reminders.
