# Codebase Concerns & Technical Debt

**Analysis Date:** 2026-11-06

## Technical Debt & Gaps

1. **Backend & Persistence Missing:**
   - The repository currently only has frontend UI assets. The Express.js backend, MongoDB connection, Socket.IO server, and WebRTC signaling specified in `README.md` are not yet created.

2. **Authentication Flow is Simulated:**
   - `LoginForm.jsx` simulates authentication using `setTimeout`. It needs real backend endpoints, JWT token handling, and secure storage (cookies / local auth state).

3. **Routing Setup:**
   - The application does not currently have `react-router-dom` installed. `App.jsx` renders the login form directly without routing for dashboards, matching rooms, or interview sessions.

4. **Testing Infrastructure:**
   - No automated unit or integration tests are present.

5. **Static Media Footprint in Repository:**
   - Multiple temporary or prototype images exist in `public/` (`ref-008.webp`, `statue.png`, `ref-source-uploaded.jpg`). Only `vignette-bloom.mp4` and `vignette-bloom.webp` are currently active.
