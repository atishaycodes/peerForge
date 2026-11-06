# Coding Conventions & Standards

**Analysis Date:** 2026-11-06

## Naming Conventions

- **Components:** PascalCase (`AsciiArt.jsx`, `LoginForm.jsx`)
- **Files & Directories:** CamelCase or PascalCase for components, kebab-case for config files
- **Functions & Hooks:** camelCase (`handleChange`, `handleSubmit`, `handleBack`)
- **State Variables:** camelCase with boolean flags (`isSignUp`, `showPassword`, `isLoading`)

## Code Style & Patterns

- **Functional Components:** Standard React functional components with explicit export defaults or named exports.
- **Styling:** Tailwind CSS utility classes with responsive variants (`sm:`, `lg:`).
- **JSX Attributes:** Standard React prop passing with inline event handlers for quick interactions.
- **Icons:** SVG icons sourced from `lucide-react` or clean inline SVG paths.

## Error & State Handling

- Client-side form validation using HTML5 attributes (`required`, `type="email"`).
- State-driven conditional rendering for interactive messages (`successMessage`, `isLoading`).
