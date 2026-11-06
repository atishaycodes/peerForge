# Technology Stack

**Analysis Date:** 2026-11-06

## Languages

**Primary:**
- JavaScript (ES Modules, JSX) - Frontend application code in `src/`

**Secondary:**
- HTML5, CSS3 (PostCSS, Tailwind CSS) - Markup and styling

## Runtime

**Environment:**
- Node.js (>=18.x recommended, active v24.x)

**Package Manager:**
- npm (lockfile `package-lock.json` present)

## Frameworks

**Core:**
- React 19 (`react` ^19.3.1, `react-dom` ^19.3.1) - UI library

**Build/Dev:**
- Vite 8 (`vite` ^8.3.5, `@vitejs/plugin-react`) - Development server and bundler
- Tailwind CSS 3 (`tailwindcss` ^3.4.19, `postcss`, `autoprefixer`) - Utility-first styling

## Key Dependencies

**Production:**
- `react` / `react-dom` (^19.3.1) - Component hierarchy and DOM rendering
- `lucide-react` (^1.68.0) - Modern icon set for interface controls

**Development:**
- `vite` - Lightning-fast HMR and ESM build pipeline
- `@vitejs/plugin-react` - React Fast Refresh support in Vite
- `tailwindcss` / `postcss` / `autoprefixer` - CSS compilation pipeline

## Configuration

- `vite.config.js` - Configures React plugin and dev server on port 3000
- `tailwind.config.js` - Custom fonts (`Inter`), brand color extensions
- `postcss.config.js` - Tailwind and Autoprefixer hooks
- `package.json` - `"type": "module"`, scripts: `dev`, `build`, `preview`

