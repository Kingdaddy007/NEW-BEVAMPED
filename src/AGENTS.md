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
