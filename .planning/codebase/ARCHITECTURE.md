# Architecture Overview

**Analysis Date:** 2026-11-06

## Architectural Pattern

- **Client-Side Single Page Application (SPA):** Built with React 19 and bundled via Vite.
- **Component-Driven Layout:** Modular component hierarchy separating media presentation from interactive state forms.

## High-Level Architecture

```
[ Browser / Client ]
         │
         ▼
    index.html
         │
         ▼
    src/main.jsx
         │
         ▼
    src/App.jsx (Split View)
     ├── Left: src/components/AsciiArt.jsx (Video Canvas Art)
     └── Right: src/components/LoginForm.jsx (Authentication Flow)
```

## Layers & Components

1. **Root & Configuration Layer:**
   - `index.html` - Loads web fonts (`Inter`), sets viewport and HTML template.
   - `src/main.jsx` - Mounts React root with StrictMode and imports global CSS.
   - `src/index.css` - Tailwind base directives and body styling.

2. **Page Orchestration Layer:**
   - `src/App.jsx` - Orchestrates the responsive split-screen viewport (video visualizer on left/top, form pane on right/bottom).

3. **Presentation & Feature Components:**
   - `src/components/AsciiArt.jsx` - Displays the looping "Vignette Bloom" ASCII video with focal centering (`objectPosition: "30% center"`).
   - `src/components/LoginForm.jsx` - Dual-mode authentication form (Sign In & Sign Up) with password reveal, remember me, and social provider links.

## Data Flow & State Management

- Local React state hooks (`useState`) manage UI states in `LoginForm.jsx` (mode toggle, password visibility, form field changes, simulated submission loading).
- No global state management library currently configured.

