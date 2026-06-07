# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio for Iván Campillo (icampillo.com). Currently being rebuilt from scratch — the old Astro version lives in `old_astro_version/` (archived, not active). The new design is defined in `design_handoff_portfolio/README.md` with high-fidelity React prototypes in `design_handoff_portfolio/reference/w9/`.

The target stack is **Astro + TypeScript** (with React islands for interactive components like the IDE). The design handoff is the source of truth for the UI.

## Architecture (New Design)

Single-page portfolio with a dark "terminal/hacker" aesthetic. The centerpiece is an **interactive IDE component** (VS Code-inspired) with working terminal, file explorer, tabs, and Cmd+P quick-open.

**Section order:** BootLoader (page loader) → Nav → Hero → IDE (overlaps hero) → Services → MetricsStrip → Projects (horizontal scroll) → Stack (sticky sidebar) → Experience (timeline) → OSS → Contact → Footer

**Key design decisions:**
- All content is centralized in a single data file (`src/data/index.ts`) — see `reference/w9/data.jsx` for current content
- CSS custom properties for theming (`--bg`, `--accent`, `--mono`, etc.) — full token set in the handoff README
- Scroll animations via IntersectionObserver (`Reveal`, `Stagger`, `AnimatedCounter`) — not a library
- Three Google Fonts: Figtree (body), Space Grotesk (display headings), JetBrains Mono (code/terminal)
- Body has scanline + grain overlay effects via pseudo-elements
- The IDE component sits between hero and services with `margin-top: -280px`
- BootLoader (`src/components/BootLoader.astro`): macOS-style terminal window centered on screen with Linux boot sequence. Shows on every page load (~2s). Logo (ic badge + icampillo .com) sits above the window. Background uses `--bg-soft` with accent radial gradient.

**Reference prototypes** (`design_handoff_portfolio/reference/w9/`): These are React + Babel-inline HTML files for browser iteration — not production code. Port the logic but use proper imports, TypeScript, and Astro conventions.

## Current Status

All sections are built and functional. Remaining work:
- **Content review**: verify all metrics, descriptions, and data in `src/data/index.ts` are accurate and up to date
- **Logos/icons**: add real technology logos and company logos where needed (Stack section, Experience, Projects, etc.)
- **Text polish**: review all Spanish/English copy across sections for consistency and accuracy
- **i18n**: bilingual support is wired via `html[lang]` CSS toggles and `data-lang` attributes — verify all sections have both `es`/`en` variants

## Commands

- `npm run dev` — dev server at localhost:4321
- `npm run build` — static build to `dist/`
- `npm run preview` — preview production build

## Deployment

Hosted on **Vercel**. Build command: `npm run build`, output: `dist/`.

## Language

Portfolio content (UI copy, descriptions, service cards) is in **Spanish**. Code, comments, and variable names are in English.
