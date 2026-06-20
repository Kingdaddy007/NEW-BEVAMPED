## 2026-06-15T10:05:45Z

Objective:
Create the following files in the project workspace:
1. `src/AGENTS.md`
2. `src/utils/AGENTS.md`
3. `src/assets/AGENTS.md`

Instructions:
- Write each file using the DOX Template format (Purpose, Rules & Constraints, Exposed Interfaces, Internal Dependencies, Verification).
- Make sure to ONLY write these documentation files. DO NOT write, modify, or delete any source code files (TypeScript, JavaScript, CSS, HTML, config files, etc.).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\src\AGENTS.md:
---
# src Context & Contract

## 1. Purpose
This directory contains the core application logic, styling manifests, and view-specific scripts. It governs the rendering, animation setups, and scroll bindings of the showcase.

## 2. Rules & Constraints
- **Framework Constraint**: All scripts must be written in TypeScript.
- **Dependency Boundary**: Business logic and UI components must not directly call scratch scripts or contexts.
- **Style Isolation**: All global style configurations must belong to `style.css`. Component-specific style overrides should avoid polluting the global namespace.
- **No Shared State**: Main, vertical, and horizontal scripts should run independently and initialize their own timelines.

## 3. Exposed Interfaces
- `main.ts`: Main entry script controlling text splits, ScrollTrigger sequences, and parallax reveals.
- `vertical.ts`: Cylinder layout calculations and rotation scripting.
- `horizontal.ts`: Horizontal gallery timeline and transitions (skeleton).
- `preview.ts`: Typography animations testbed.
- `style.css`: Core CSS stylesheet importing luxury theme definitions and layout parameters.

## 4. Internal Dependencies
- `src/utils/`: Imports smooth scroll wrapper functions (Lenis integrations).
- `src/assets/`: Imports small logo or SVG assets (if any).

## 5. Verification
- Verify that `vite build` bundles `main.ts`, `vertical.ts`, and `horizontal.ts` without bundle output errors.
- Confirm styling classes match variables defined in `DESIGN.json`.
---

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\src\utils\AGENTS.md:
---
# src/utils Context & Contract

## 1. Purpose
This directory hosts global utility scripts, helpers, and wrappers shared across the application page flows.

## 2. Rules & Constraints
- **Purity Constraint**: Utilities must be general-purpose, reusable, and side-effect free outside their specific functions.
- **Strict Isolation**: Scroll helpers must not import view scripts (like `main.ts` or `vertical.ts`).

## 3. Exposed Interfaces
- `scroll.ts`: Exports `initSmoothScroll()`, initializing smooth scroll via `Lenis` and binding scroll events to GSAP `ScrollTrigger` updates.

## 4. Internal Dependencies
- None.

## 5. Verification
- Run TypeScript checks to verify type signatures for `initSmoothScroll` are valid and resolve correctly in sibling directories.
---

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\src\assets\AGENTS.md:
---
# src/assets Context & Contract

## 1. Purpose
This directory contains small project-specific static branding icons and symbols imported directly into stylesheet configurations or TS files.

## 2. Rules & Constraints
- **Resource Boundary**: Limit assets stored here to lightweight files (SVGs, small PNGs). Large luxury video clips or high-resolution images must be placed under `/public/`.

## 3. Exposed Interfaces
- `hero.png`: Backdrop visual for hero transitions.
- `typescript.svg`: Logo symbol.
- `vite.svg`: Bundler environment logo symbol.

## 4. Internal Dependencies
- None.

## 5. Verification
- Verify that the total directory size remains small (under 5MB).
---

Verify all file existences and compilation before finishing, then send a message back.
