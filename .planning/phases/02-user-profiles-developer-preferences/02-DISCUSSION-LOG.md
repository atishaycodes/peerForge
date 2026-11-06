# Phase 02: User Profiles & Developer Preferences - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-06
**Phase:** 02-user-profiles-developer-preferences
**Areas discussed:** Onboarding Flow, Availability & Scheduling, Profile Screen Layout, Skills & Target Roles Selection

---

## Profile Onboarding Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Non-blocking onboarding | Land on Dashboard with a prominent "Complete Profile" setup card and banner, letting users explore first | ✓ |
| Guided wizard redirect | First-time login automatically redirects to /onboarding to fill essentials before entering Dashboard | |
| Modal prompt | Show an interactive setup modal on first dashboard visit that can be dismissed or completed immediately | |

**User's choice:** Non-blocking onboarding
**Notes:** Minimum essential fields required for match-readiness: Target Roles, Primary Tech Stack (Skills), and Time Zone. Bio and preferred windows remain optional.

---

## Availability & Scheduling Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Status toggle + general windows | Availability status toggle (Active / Away) + General preference windows (Weekday Evenings, Weekday Mornings, Weekends) + Timezone | ✓ |
| Day-by-day availability slots | Select specific days of the week and start/end time ranges | |
| Simple status toggle only | "Looking for practice" on/off only | |

**User's choice:** Status toggle + general windows
**Notes:** Timezone auto-detects browser IANA time zone on first load with searchable dropdown override.

---

## Profile Screen Layout & Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated `/profile` page | Dedicated page with a clean Linear-style layout (read overview + smooth inline/modal edit section) | ✓ |
| Slide-over Sheet / Drawer | Drawer that slides in from the right when clicking the user profile on Dashboard or Navbar | |
| Tabbed Settings page | Settings page at `/settings` with Profile, Preferences, and Account tabs | |

**User's choice:** Dedicated `/profile` page
**Notes:** Avatar defaults to refined initials badge with an optional field to provide an external avatar image URL (GitHub / Gravatar).

---

## Skills & Target Roles Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Curated stack chips + custom input | Curated popular stack chips (React, Node, Python, Go, System Design, DSA, etc.) with click-to-toggle + custom tag input (press Enter to add) | ✓ |
| Pure searchable dropdown | Searchable dropdown with multi-select tag badges | |
| Freeform tag input only | Comma-separated tag input | |

**User's choice:** Curated popular stack chips + custom input (Enter to add)
**Notes:** Target Roles selected via multi-select predefined role pills (Frontend, Backend, Full Stack, Mobile, DevOps, Systems, AI/ML).

---

## Deferred Ideas
- Social profile links (LinkedIn, GitHub OAuth sync)
- Public developer profile preview link (`/u/:username`)
- Resume PDF upload & parsing

