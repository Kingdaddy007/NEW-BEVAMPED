## 2026-06-15T10:04:48Z

You are teamwork_preview_worker. Your working directory is C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\.agents\teamwork_preview_worker_milestone1.

Objective:
Create two files at the project root:
1. `PROJECT.md` at the project root.
2. `AGENTS.md` at the project root.

Instructions:
- Write `PROJECT.md` containing the global architecture outline and milestones.
- Write the master `AGENTS.md` at the root using the DOX Template formatting (Purpose, Rules & Constraints, Exposed Interfaces, Internal Dependencies, Verification).
- Make sure to ONLY write these documentation files. DO NOT write, modify, or delete any source code files (TypeScript, JavaScript, CSS, HTML, config files, etc.).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\PROJECT.md:
---
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
| 1 | Global Plan & Root Contract | Create PROJECT.md and root AGENTS.md | none | DONE |
| 2 | Src Directory Contracts | Create AGENTS.md files in /src/, /src/utils/, and /src/assets/ | M1 | PLANNED |
| 3 | Supporting Directory Contracts | Create AGENTS.md files in /public/, /contexts/, /scratch/, and /research results/ | M1 | PLANNED |
| 4 | Verification Review | Audit all AGENTS.md files for DOX compliance and ensure no implementation code changes | M2, M3 | PLANNED |

## Interface Contracts
### Main Script (src/main.ts) ↔ Smooth Scroll Utility (src/utils/scroll.ts)
- `initSmoothScroll()`: Returns a `Lenis` instance and sets up tickers for syncing GSAP and Lenis.
### Vertical Script (src/vertical.ts) ↔ Smooth Scroll Utility (src/utils/scroll.ts)
- `initSmoothScroll()`: Same utility imported to initialize smooth scroll for the cylinder viewport.
---

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\AGENTS.md (Root):
---
# map-dox-framework-contracts Context & Contract

## 1. Purpose
This is the root directory of a Vite-powered Multi-Page Application (MPA) implementing a luxury interior design marketing showcase. It coordinates the overall project configuration, design tokens, styling assets, and routing entry points.

## 2. Rules & Constraints
- **Integrity Rule**: No implementation or source code changes (JS, TS, CSS, HTML, etc.) are allowed during directory mapping workflows. Only `AGENTS.md` and project/agent metadata files may be modified or created.
- **Dependency Rule**: Sub-directories must maintain clear boundaries. All shared utilities must reside in `src/utils/`.
- **Naming Rule**: Sub-directories must follow lowercase snake-case or hyphenated naming conventions.

## 3. Exposed Interfaces
- `/index.html`: Entry point for the main storytelling experience.
- `/vertical.html`: Entry point for the 3D cylinder carousel.
- `/horizontal.html`: Entry point for the horizontal scrolling gallery (currently skeleton).
- `/preview.html`: Entry point for the animation playground.
- `/vite.config.ts`: Configuration file defining build targets and Rollup bundle options.
- `/DESIGN.json`: Defines custom CSS/design variables for colors, typography, layout grid, breakpoints, and motion defaults.

## 4. Internal Dependencies
- `/src/`: Contains core source code modules, entry logic scripts, and style sheets.
- `/public/`: Hosts static media assets (videos, images) loaded by HTML/CSS elements.
- `/contexts/`: Contains markdown issue audits for layout and accessibility bugs.
- `/scratch/`: Holds isolated python utilities and sandboxed HTML testing files.
- `/research results/`: Motion design reference documentation.

## 5. Verification
- Run `npm run build` to verify that all HTML entry points compile successfully.
- Verify that `dist/` is successfully created with index, vertical, and horizontal bundles.
---

Once the files are created, run a git status or build command (e.g. `npm run build` if dependencies exist) or verify that files exist using file checking, then send a message back.
