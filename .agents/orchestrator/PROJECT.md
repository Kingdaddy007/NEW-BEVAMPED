# Project: map-dox-framework-contracts

## Architecture
The application runs as a Vite-powered Multi-Page Application (MPA).
- Root (/): App configurations (Vite, TypeScript, package, design tokens) and HTML entry points.
- /src/: Core TS/CSS styles and scripts (main experience, vertical 3D cylinder, horizontal placeholder, preview sandbox).
- /src/utils/: Shared helper utilities (e.g., smooth scroll initialization bridging Lenis and GSAP).
- /src/assets/: Small static assets like icons/logos.
- /public/: Static video clips and brand assets.
- /contexts/: Diagnostic visual and accessibility issue trackers.
- /scratch/: Isolated playground scripts (Python, sandboxed HTML) and text dumps.
- /research results/: Motion design reference documentation.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Global Plan & Root Contract | Create PROJECT.md and root AGENTS.md | none | PLANNED |
| 2 | Src Directory Contracts | Create AGENTS.md files in /src/, /src/utils/, and /src/assets/ | M1 | PLANNED |
| 3 | Supporting Directory Contracts | Create AGENTS.md files in /public/, /contexts/, /scratch/, and /research results/ | M1 | PLANNED |
| 4 | Verification Review | Audit all AGENTS.md files for DOX compliance and ensure no implementation code changes | M2, M3 | PLANNED |

## Interface Contracts
### Main Script (src/main.ts) ↔ Smooth Scroll Utility (src/utils/scroll.ts)
- `initSmoothScroll()`: Returns a `Lenis` instance and sets up tickers for syncing GSAP and Lenis.
### Vertical Script (src/vertical.ts) ↔ Smooth Scroll Utility (src/utils/scroll.ts)
- `initSmoothScroll()`: Same utility imported to initialize smooth scroll for the cylinder viewport.
