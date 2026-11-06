# Phase 4: WebRTC Video/Audio & Collaborative Code Room - Context

**Gathered:** 2026-11-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 delivers the complete live peer mock interview room experience:
- Peer-to-peer WebRTC audio/video streaming with signaling over existing Socket.IO connection.
- 3-column quiet IDE workspace: Collapsible Problem tab (left 25%), Monaco Editor with code execution & output console (center 55%), and Video Tiles + Media controls (right 20%).
- Real-time synchronized Monaco code editor with live syntax highlighting for JavaScript, TypeScript, Python, C++, and Java, plus remote cursor/selection broadcasting.
- 60-minute interview session timer with 30m / 30m dual phases, indicating active Interviewer and Candidate roles with gentle halfway swap reminder and manual swap toggle.
- Interactive in-browser JavaScript / Python execution drawer with console output and test case evaluation.
- Curated question bank categorized by track (DSA, Frontend Web Architecture, Backend & System Design) auto-loaded upon room entry.
- Graceful media fallback (avatar/monogram + mute badges) if camera/mic permissions are denied or devices are missing.

</domain>

<decisions>
## Implementation Decisions

### 1. Workspace Layout & Video Tiles
- **D-01 (Layout):** 3-column quiet graphite IDE adhering to `MY_DEFAULT_GUIDELINES.md` and `unslop`:
  - **Left pane (25%):** Collapsible Problem specification drawer (Title, difficulty tag, track tag, markdown description, examples, constraints, starter code button).
  - **Center pane (55%):** Header with language picker (JS, TS, Python, C++, Java), Reset code, Run Code button; Monaco Editor in dark graphite theme; bottom collapsable Test Output / Console drawer.
  - **Right pane (20%):** Local and remote video tiles with audio wave/mute indicators, AV device controls (Mute mic, Disable cam, Screen share placeholder, Leave session).
- **D-02 (WebRTC STUN & Fallback):** Use Google's public STUN servers (`stun:stun.l.google.com:19302`, `stun:stun1.l.google.com:19302`). If camera/mic is blocked or absent, gracefully fallback to user avatar monogram with "Mic Off" badge without blocking entry into the room.

### 2. Collaborative Code Editor Experience
- **D-03 (Editor Engine):** `@monaco-editor/react` configured with VS Dark (`vs-dark`) theme customized with quiet graphite borders matching the peerForge aesthetic (`border-neutral-800`, `bg-neutral-950`).
- **D-04 (Real-time Code Sync):** Socket.IO room events (`room:code-change`, `room:cursor-change`, `room:language-change`).
  - Debounced code broadcast to prevent message thrashing.
  - Remote cursor position highlight showing peer's name and position.
- **D-05 (Multi-language Support):** Support JavaScript, TypeScript, Python, C++, and Java with default starter templates for each problem.

### 3. Interview Timer & Role Switcher
- **D-06 (60-minute Global Timer):** Synchronized session timer countdown starting at 60:00:
  - 60:00 to 30:00: Phase 1 (Peer A as Candidate, Peer B as Interviewer).
  - At 30:00: Non-intrusive toast & banner prompting role switch ("Halfway checkpoint: Switch roles now").
  - 30:00 to 00:00: Phase 2 (Peer B as Candidate, Peer A as Interviewer).
  - Manual "Swap Roles" button anytime for peer flexibility.

### 4. Code Execution & Testing Console
- **D-07 (Execution Engine):** In-browser safe execution:
  - Client-side Web Worker / sandboxed execution for JavaScript/TypeScript capturing `console.log` and returning test assertion results.
  - Standard test case assertions drawer (Input, Expected Output, Actual Output, Pass/Fail status).
  - Output terminal drawer with tab switching between "Test Cases" and "Raw Console Output".

### 5. Curated Question Bank
- **D-08 (Track-aligned Problem Bank):** Pre-loaded problem dataset stored in frontend client / shared constants:
  - DSA: Two Sum, Valid Parentheses, Reverse Linked List, Merge Intervals, Lowest Common Ancestor.
  - Frontend: Debounce Implementation, Nested Comment Component, Virtualized List, Event Emitter.
  - Backend & System Design: Rate Limiter, LRU Cache, URL Shortener Design, Pub/Sub Broker.
  - Interviewer has a "Change Problem" dropdown to switch questions anytime.

### Antigravity's Discretion
- Exact WebRTC signaling payloads (`peer:offer`, `peer:answer`, `peer:ice-candidate`) over existing Socket.IO gateway.
- Visual styling tokens adhering to peerForge graphite color ramp (`neutral-950`, `neutral-900`, `neutral-800`, `neutral-400`, `neutral-100`).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**
- `MY_DEFAULT_GUIDELINES.md` — UI styling, graphite palette, 4px grid rhythm, zero AI slop, no fake counters.
- `.agents/skills/unslop/skills/unslop/SKILL.md` — Unslopping rules for clean developer tool interfaces.
- `server/socket/index.js` — Socket.IO authentication and connection handler.
- `server/services/matchmakingService.js` — Room generation and active matches.
- `src/context/SocketContext.jsx` — Client socket management.
- `src/pages/InterviewRoom.jsx` — Current placeholder route at `/room/:roomId`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `SocketContext.jsx`: Provides authenticated `socket` instance, `user`, and connection state.
- `AuthContext.jsx`: Provides logged-in user profile, avatar, username.
- `lucide-react`: Mic, MicOff, Video, VideoOff, Play, Terminal, Clock, RefreshCw, ChevronLeft, ChevronRight icons.

### Established Patterns
- Linear / Raycast quiet graphite design: `bg-neutral-950`, `border-neutral-800`, `text-neutral-100`, `text-neutral-400`.
- Socket event listeners with cleanup in `useEffect`.
- Protected routes using `<ProtectedRoute>`.

</code_context>
