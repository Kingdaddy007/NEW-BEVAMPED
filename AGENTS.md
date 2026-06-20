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
