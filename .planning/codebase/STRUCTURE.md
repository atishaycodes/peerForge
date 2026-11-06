# Directory & File Structure

**Analysis Date:** 2026-11-06

## Directory Layout

```
peerForge/
├── .agent/              # GSD skills and workflow runtime files
├── .planning/           # GSD planning artifacts and codebase maps
│   └── codebase/        # Mapped codebase reference documents
├── public/              # Static media assets served by Vite
│   ├── ref-008.webp
│   ├── statue.png
│   ├── vignette-bloom.mp4
│   └── vignette-bloom.webp
├── src/
│   ├── components/      # Reusable UI & media components
│   │   ├── AsciiArt.jsx
│   │   └── LoginForm.jsx
│   ├── App.jsx          # Root application layout
│   ├── index.css        # Global CSS with Tailwind directives
│   └── main.jsx         # React application entry point
├── .gitignore           # Git ignore configurations
├── index.html           # HTML template
├── package.json         # Project manifests and scripts
├── postcss.config.js    # PostCSS pipeline configuration
├── README.md            # Project description and roadmap
├── tailwind.config.js   # Tailwind theme customizations
└── vite.config.js       # Vite build configuration
```

## Key Files & Entry Points

- **App Entry:** `src/main.jsx`
- **Root Layout:** `src/App.jsx`
- **Main Components:**
  - `src/components/LoginForm.jsx`
  - `src/components/AsciiArt.jsx`
- **Configuration:** `vite.config.js`, `tailwind.config.js`, `package.json`

