# PeerForge — Decentralized Peer-to-Peer Technical Mock Interview Platform

PeerForge is a high-performance, decentralized peer-to-peer technical mock interview platform designed for software engineers. It enables two developers to connect directly over WebRTC for live audio, video, and screen sharing, while collaborating in real-time inside a synchronized Monaco code editor with an in-browser test runner, automated 60-minute bilateral role rotations (30m Candidate / 30m Interviewer), and symmetric double-blind evaluations.

---

## 1. Project Information & Team Members

- **Project Name:** PeerForge
- **Target Pull Request:** `Yogeshrathia07/P2P_App` (Branch: `main`)
- **Submission Group:** `<group-name>`

### Team Members & Contributions

| Member Name | Role | Responsibilities & What Each Member Implemented |
| :--- | :--- | :--- |
| **Atishay** | **Lead System Architect & Full-Stack Developer** | • Designed and engineered the end-to-end **WebRTC P2P communication pipeline** (`RTCPeerConnection`), handling media tracks, transceivers, mute/unmute toggles, camera switches, screen sharing, and ICE gathering.<br>• Implemented **STUN/TURN network traversal** with OpenRelay fallback to ensure connectivity across strict campus and corporate symmetric NATs.<br>• Built the **authoritative Socket.IO signaling server** (`server/socket/roomSignaling.js`) managing room session snapshots, role complement arbitration, and the strict 2-peer capacity gate.<br>• Engineered the **Monaco collaborative code editor** with remote-change latch flags to prevent infinite echo loops, language switching, and the client-side JavaScript execution and test evaluation engine.<br>• Built the **60-minute interview state machine** orchestrating the 30-minute bilateral role swap (Phase 1 &rarr; Phase 2).<br>• Designed the **double-blind symmetric feedback engine** with MongoDB storage, preventing retaliation bias until both peers submit.<br>• Designed and developed the **minimalist monochrome UI design system** and SaaS landing page. |
| **Ujjwal** | **Frontend & Problem Bank Contributor** | • Curated, structured, and implemented the comprehensive **problem bank dataset** (`src/data/problems.js`) covering Data Structures & Algorithms (DSA), Frontend Web Architecture, and Backend System Design with structured test cases.<br>• Built the **Problem Specification Drawer** (`src/components/room/ProblemDrawer.jsx`), displaying problem descriptions, input/output examples, and edge-case constraints.<br>• Designed and styled difficulty badges, track filter pills, and responsive layout containers for mobile, tablet, and desktop viewports.<br>• Conducted cross-browser layout testing and UI refinement for candidate and interviewer view modes. |

---

## 2. What the App Does & How to Use It

### Core Capabilities
1. **Direct P2P Audio & Video:** Low-latency WebRTC media streaming between two candidate devices with independent mic, camera, and display screen capture controls.
2. **Synchronized Collaborative Monaco Editor:** Sub-150ms bidirectional code editing with syntax highlighting (JavaScript, TypeScript, Python, C++, Java) and cursor position indicators.
3. **In-Browser Code Execution & Test Evaluator:** Safely executes code against predefined assertion test suites in real-time, intercepting `console.log` stdout into a dedicated console drawer.
4. **Automated Bilateral Role Swap (60-Min Split):**
   - **Minute 00–30 (Phase 1):** Peer A is Candidate (active coder), Peer B is Interviewer (spec & solution guide).
   - **Minute 30–60 (Phase 2):** Roles rotate automatically. Peer B receives a fresh challenge as Candidate, Peer A becomes Interviewer.
5. **Symmetric Blind Evaluation:** After session completion, both engineers evaluate each other across 4 competency rubrics (Problem Solving, Code Quality, Communication, System Design). Neither can view the other's feedback until both have submitted.

### Live Deployment Link
- **Live Application:** `https://<username>.github.io/P2P_App/submissions/<group-name>/` *(or deployed production server)*
- **Demo Room Access:** Share any generated 6-character room code (e.g., `PF-7K2M9X`) or direct link.

### Step-by-Step Usage Guide
1. **Access / Onboarding:** Visit the landing page and click **"Start Practicing"** or sign in.
2. **Create or Join a Room:**
   - In the Dashboard or Lobby, select your interview track (DSA, Frontend, Backend) and target difficulty.
   - Click **"Generate Room Code & Link"** to create an instant room (e.g., `PF-4N7N75`).
   - Share the code or direct URL with your peer.
   - The second peer enters the 6-character code in the **"Join with Room Code"** box and clicks Join.
3. **Conduct Phase 1 Interview (30 Minutes):**
   - Candidate types code in the Monaco editor; Interviewer reviews problem spec, hints, and observes live typing.
   - Click **"Run (Ctrl+Enter)"** to run test cases and verify output.
4. **Role Rotation (Phase 2):**
   - At the 30-minute countdown trigger, the room swaps roles. A new problem is selected for the second round.
5. **Double-Blind Review:**
   - Both peers complete the 4-dimension rating rubric. Feedback unlocks simultaneously once both reviews are registered.

---

## 3. Libraries & Services Used

### Frontend Client
- **React 18 & Vite:** Ultra-fast reactive component architecture and production bundling.
- **Tailwind CSS & Lucide React:** Utility-first styling with modern typography, dark mode workspace, and UI iconography.
- **@monaco-editor/react:** Industry-standard VS Code editor engine powering collaborative typing and syntax highlighting.
- **Socket.IO Client (`socket.io-client`):** High-speed WebSocket transport for room signaling, code sync, and timer updates.
- **WebRTC API (`RTCPeerConnection`):** Native browser P2P video, audio, and screen stream communication.

### Backend & Cloud Services
- **Node.js & Express.js:** RESTful API server and static asset delivery.
- **Socket.IO Server:** P2P room discovery, WebRTC SDP offer/answer signaling, and ICE candidate exchange.
- **MongoDB Atlas & Mongoose:** Real-time cloud database persisting user profiles, completed sessions, and blind reviews across devices.
- **JWT & bcryptjs:** Cryptographic authentication, password hashing, and secure HTTP cookies.
- **Google STUN & OpenRelay TURN:** Public STUN servers (`stun:stun.l.google.com:19302`) and TURN relays (`turn:standard.relay.metered.ca`) for NAT/firewall traversal across campus Wi-Fi networks.

---

## 4. Section 3 Decentralized Problems Solved & How

PeerForge addresses 5 core challenges of decentralized and peer-to-peer architectures:

### 1. Problem #1: Late Joiners See No History
- **Why it happens:** In decentralized P2P networks, media and data events are broadcast only to peers currently connected at that exact moment. A peer joining 5 minutes late would receive an empty code editor and missed timer state.
- **How PeerForge solves it:** The signaling coordination layer maintains an authoritative memory state snapshot of the active session (`room.code`, `room.activeProblemId`, `room.language`, `room.timer`, `room.participants`). When a late joiner connects via `room:join`, the system immediately dispatches a `room:state` catch-up packet containing the full document buffer and timer offset before peer negotiation starts.

### 2. Problem #2: Data Lost on Refresh
- **Why it happens:** Browser memory clears upon page reload, destroying local component state, WebRTC peer connections, and in-flight code.
- **How PeerForge solves it:** 
  1. The client maintains authenticated JWT tokens in persistent storage.
  2. Upon page refresh, the user's re-connection handshake reconciles their authenticated `userId` against existing room participant records, cleanly re-attaching their new socket without terminating the session or resetting the code buffer.
  3. Historical session metrics and evaluations are permanently committed to MongoDB Atlas.

### 3. Problem #5: Peers Cannot Connect (Campus / Office Wi-Fi NAT)
- **Why it happens:** Academic campus networks and corporate firewalls enforce **Symmetric NATs** and block inbound UDP hole punching, causing direct peer-to-peer WebRTC connections to fail during candidate gathering.
- **How PeerForge solves it:** `useWebRTC.js` configures dual Google STUN servers with an **OpenRelay TURN fallback** (`turns:standard.relay.metered.ca`). When direct P2P UDP traversal is blocked by symmetric firewalls, WebRTC automatically switches to an encrypted TURN relay over TCP port 443. An internal `iceCandidatesQueueRef` buffers candidates arriving before the SDP remote description completes, preventing handshake drops.

### 4. Problem #7: Too Many People in One Room (Mesh Explosion)
- **Why it happens:** Pure decentralized mesh networks scale as $\mathcal{O}(N^2)$ connections ($\frac{N(N-1)}{2}$). If participants grow beyond 2–3 peers, CPU encoding and network bandwidth saturate and crash the browser tab.
- **How PeerForge solves it:** PeerForge enforces a strict **bilateral architectural invariant**. Rooms are hard-capped at exactly 2 peers (`room.participants.size >= 2`). Any 3rd peer attempting to enter receives an explicit `room:full` rejection, strictly guaranteeing a constant $N=2$ topology (1 connection per device) with deterministic resource usage.

### 5. Problem #11: Strangers in Your Room (Address Guessing)
- **Why it happens:** If room identifiers are sequential or short (e.g., `room1`, `room2`), attackers or strangers can enumerate or guess room URLs and interrupt live sessions.
- **How PeerForge solves it:** Room codes are generated using high-entropy random identifiers (`generateRandomRoomCode`) in the format `PF-XXXXXX` from a base-32 alphanumeric character space ($32^6 \approx 1.07 \times 10^9$ possibilities). Furthermore, once both candidate and interviewer are in the room, entry is instantly locked to outsiders.

---

## 5. Five Technical Challenges Faced While Building & How We Solved Them

### Problem 1: Remote Video & Audio Stream Not Rendering on the Peer's Tile
- **Why it happened:** In WebRTC, the `ontrack` event fires asynchronously once SDP negotiation completes. In React, the `<video>` component mounted before the remote media stream was populated in state. Because HTML5 video elements do not reliably auto-play dynamic React stream bindings without user interaction, remote video tiles remained black and silent.
- **What we tried:** Directly setting `videoElement.src = remoteStream` inside the JSX render loop and polling the stream status with `setInterval`. This caused continuous re-render cycles and audio distortion.
- **Final solution:** Implemented an explicit `useEffect` ref attachment in [`VideoTiles.jsx`](file:///c:/Users/Atishay/Downloads/peerForge/src/components/room/VideoTiles.jsx). When `remoteStream` becomes available, it attaches directly to `videoRef.current.srcObject = remoteStream`, attaches an `onloadedmetadata` event listener, and invokes `.play().catch(...)` to bypass autoplay policy rejections safely.

---

### Problem 2: Device Hardware Race Conditions & Screen Share Replacement
- **Why it happened:** When switching between webcam video and screen sharing (`getDisplayMedia`), calling `getUserMedia` again to revert back caused browser hardware access locks on Windows and macOS. Furthermore, stopping a video track when muting caused the remote peer's connection to enter a permanently terminated state.
- **What we tried:** Renegotiating a full SDP Offer/Answer cycle every time camera or screen share was toggled. This caused a 2–3 second screen freeze and dropped audio packets on every toggle.
- **Final solution:** Separated stream track acquisition from peer negotiation. Local mute/camera toggles simply switch `track.enabled = false/true` on the existing hardware track without dropping the stream. For screen sharing, we used the WebRTC `RTCRtpSender.replaceTrack(newTrack)` API, which swaps the outgoing video feed instantly with 0ms renegotiation overhead.

---

### Problem 3: Monaco Collaborative Editor Desynchronization & Infinite Echo Loops
- **Why it happened:** When Peer A entered a keystroke, Monaco dispatched a `room:code-change` event via Socket.IO. When Peer B received the event and called `editor.setValue(newCode)`, Monaco fired Peer B's `onDidChangeContent` listener, immediately broadcasting the same code back to Peer A. This created an infinite ping-pong echo loop that locked up the browser tab and reset the user's cursor to line 1 column 1 on every keystroke.
- **What we tried:** Added a 500ms debounce timer on outgoing socket emissions. While this slowed down the loop, it caused severe text desynchronization and erased characters when both developers typed concurrently.
- **Final solution:** Implemented an `isRemoteChangeRef` latch flag in [`CodeEditor.jsx`](file:///c:/Users/Atishay/Downloads/peerForge/src/components/room/CodeEditor.jsx). Before programmatic updates from a remote peer are applied via `setValue()`, `isRemoteChangeRef.current` is set to `true`. The editor change listener checks this flag: if `true`, it ignores the event and resets the flag without broadcasting, completely breaking the echo loop while preserving cursor positions.

---

### Problem 4: Role Inversion & Asymmetric Role Assignment on Page Refresh
- **Why it happened:** In a bilateral mock interview, one user must be the `candidate` and the other must be the `interviewer`. When two peers joined a room at the exact same millisecond or refreshed their browser, both devices defaulted to the `candidate` role, leaving the room with two coders and no interviewer question spec.
- **What we tried:** Allowing users to manually select their role using radio buttons before joining. This resulted in frequent conflicts where both users picked `candidate`.
- **Final solution:** Centralized role complement arbitration on the server in [`roomSignaling.js`](file:///c:/Users/Atishay/Downloads/peerForge/server/socket/roomSignaling.js). When a user joins:
  - If `room.participants.size === 0`, they are assigned `candidate`.
  - If `room.participants.size === 1`, the server inspects the first peer's role and automatically assigns the strictly complementary role (`interviewer`).
  - On page reload, the server matches the user by their persistent `userId` and restores their previously assigned role without re-randomizing.

---

### Problem 5: Symmetric Blind Feedback Premature Reveal & Retaliation Bias
- **Why it happened:** In technical interviews, if Developer A gives Developer B a critical review and Developer B can view it immediately, Developer B is incentivized to retaliate with a negative score. Storing feedback on the client allowed tech-savvy users to inspect network traffic and read the evaluation before submitting their own.
- **What we tried:** Hiding the feedback UI with client-side CSS and storing submitted scores in `localStorage`. This was easily bypassed via browser developer tools.
- **Final solution:** Implemented a secure double-blind submission controller in [`server/controllers/feedbackController.js`](file:///c:/Users/Atishay/Downloads/peerForge/server/controllers/feedbackController.js). Submitted evaluations are stored server-side with `status: "waiting_partner"`. When queried, the API explicitly strips and censors rating values until both developers have submitted. Once both reviews exist for the session, the server unlocks the full report and emits a real-time `feedback:unlocked` event to both clients.

---

## 6. How to Run & Verify Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- MongoDB Atlas cluster URI (or local MongoDB)

### Installation & Launch
```bash
# 1. Clone the repository
git clone https://github.com/atishaycodes/peerForge.git
cd peerForge

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env and optionally add your MongoDB Atlas URI:
cp .env.example .env

# 4. Start the backend signaling and API server
npm run server

# 5. In a second terminal, start the frontend client
npm run dev
```

Visit `http://localhost:5173` in two different browser windows (or across two devices on the same network) to conduct an end-to-end mock interview.

---

## 7. License

Open source and released under the [MIT License](LICENSE).
