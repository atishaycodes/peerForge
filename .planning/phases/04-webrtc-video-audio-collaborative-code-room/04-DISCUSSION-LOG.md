# Phase 4: WebRTC Video/Audio & Collaborative Code Room - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-06
**Phase:** 04-webrtc-video-audio-collaborative-code-room
**Areas discussed:** Workspace Layout & Video Tiles, Collaborative Code Editor, Session Timer & Role Switcher, Code Execution & Output Console, WebRTC Permissions, Problem Bank

---

## Workspace Layout & Video Tiles

| Option | Description | Selected |
|--------|-------------|----------|
| 3-column quiet IDE | Collapsible Problem tab (left 25%), Monaco Editor + Output Console (center 55%), Video Tiles & Audio/Video device controls (right 20%) | ✓ |
| 2-column split | Editor + Output (left 65%), Problem + Video tiles stacked (right 35%) | |
| Floating Video Picture-in-Picture | Fullscreen Monaco editor with draggable/dockable video tile overlay | |

**User's choice:** 3-column quiet IDE (collapsible left pane, center code editor & console, right video stream & controls)
**Notes:** Provides optimal ergonomics for live technical mock interviews without blocking code view.

---

## Collaborative Code Editor

| Option | Description | Selected |
|--------|-------------|----------|
| Monaco Editor (@monaco-editor/react) | Full VS Code engine with real-time text sync, cursor broadcast, and JavaScript, TypeScript, Python, C++, Java support | ✓ |
| CodeMirror 6 (@codemirror) | Lightweight editor with syntax highlighting and multi-language support | |

**User's choice:** Monaco Editor (@monaco-editor/react)
**Notes:** Industry standard, highly familiar for software engineers doing mock interviews.

---

## Interview Timer & Role Switcher

| Option | Description | Selected |
|--------|-------------|----------|
| 60-min global timer with dual 30m phases | Shows active role ('Interviewer' vs 'Candidate'), with subtle halfway role-swap reminder and manual override button | ✓ |
| Single continuous stopwatch/timer | No automated role switching prompts (manual role selection only) | |
| No timer | Just an elapsed counter and leave room button | |

**User's choice:** 60-min global timer with dual 30m phases and halfway swap reminder
**Notes:** Establishes structured, fair peer-to-peer interview etiquette.

---

## Code Execution & Output Console

| Option | Description | Selected |
|--------|-------------|----------|
| In-browser client-side execution + Test assertions | Safe Web Worker / sandboxed execution with test case assertion tab + raw console output tab | ✓ |
| Simulated mock runner | Shows custom input/output and pass/fail assertion badges without running raw arbitrary code | |

**User's choice:** In-browser client-side execution with test assertions drawer
**Notes:** Fast, responsive, zero-latency feedback without complex remote sandbox infrastructure.

---

## WebRTC Media & Permission Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Standard Google STUN servers with graceful fallback | stun.l.google.com:19302, falls back to avatar monogram & mute badge if camera/mic is denied or unavailable | ✓ |
| Enforce permissions modal | Blocking modal requiring camera/mic access before entering room | |

**User's choice:** Google STUN with graceful fallback
**Notes:** Ensures users on restricted browsers or missing webcams can still participate.

---

## Problem Prompt Loading

| Option | Description | Selected |
|--------|-------------|----------|
| Curated question bank by track | Auto-loaded upon entry based on lobby track, with question switcher for interviewer | ✓ |
| Blank workspace | User types or pastes custom prompt manually | |

**User's choice:** Curated question bank by track
**Notes:** Removes friction and awkward silence at the start of interviews.

---

## Deferred Ideas
- Persistent Yjs CRDT server for multi-party editing (2-peer direct Socket.IO synchronization is sufficient for 1-on-1 MVP).
- Full remote Docker sandbox for compiled languages (client-side JS/TS engine is sufficient for MVP).
