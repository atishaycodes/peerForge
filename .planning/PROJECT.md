# PeerForge

## What It Is

PeerForge is a peer-to-peer mock interview platform where developers practice interviews with each other, exchange roles (interviewer ↔ candidate), and improve technical interview skills through structured feedback and progress tracking.

## Core Value Proposition

- Free, collaborative, reciprocal interview practice without paying expensive coaching platforms.
- Realistic live coding and behavioral mock interviews with peer feedback rubrics.
- End-to-end skill progression tracking and interview history.

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Lucide React, Vite
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens) with secure cookie / bearer auth
- **Real-Time & Communications:** Socket.IO for signaling and live sync, WebRTC for P2P audio/video streaming

## Target Audience

- Software engineering job seekers, students, and professionals preparing for technical interviews.

## Core Capabilities (Milestone 1 - MVP)

1. **User Authentication & Profile:** Secure registration, login (connecting with the existing UI in `src/components/LoginForm.jsx`), skill tags, preferred roles, and bio.
2. **Matchmaking & Pairing:** Find and connect with interview partners based on topics (frontend, backend, fullstack, DSA, system design) and availability.
3. **Live Mock Interview Room:**
   - Real-time WebRTC audio/video call.
   - Synchronized collaborative code editor or scratchpad.
   - Timer, interview questions bank, and role toggle (Interviewer/Candidate).
4. **Structured Feedback System:** Post-interview rubrics (problem-solving, communication, code quality) exchanged symmetrically.
5. **Dashboard & History:** Personal dashboard displaying completed sessions, received feedback, and progress stats.

## Non-Goals for MVP

- Paid coaching transactions or monetized tutor matching.
- AI automated avatar interviewers (focus is on genuine peer-to-peer collaboration).
- Heavy enterprise team management or recruiter hiring pipelines.

