# Codebase Structure Handoff Report

This report provides a read-only architectural analysis of the directory structure, file contents, module relationships, imports/exports, and internal/external dependencies across the entire codebase.

---

## 1. Observation

Direct observations from examining the codebase files, configs, and directory listings:

### A. Root Directory (`/`)
- **File Paths and Entry Points**:
  - `index.html` (Line 297): `<script type="module" src="/src/main.ts"></script>`
  - `vertical.html` (Line 182): `<script type="module" src="/src/vertical.ts"></script>`
  - `horizontal.html` (Line 89): `<script type="module" src="/src/horizontal.ts"></script>`
  - `preview.html` (Line 149): `<script type="module" src="/src/preview.ts"></script>`
- **Build Configurations**:
  - `vite.config.ts` (Lines 5-13):
    ```typescript
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          horizontal: resolve(__dirname, 'horizontal.html'),
          vertical: resolve(__dirname, 'vertical.html'),
        },
      },
    }
    ```
  - `package.json` dependencies (Lines 16-20):
    ```json
    "dependencies": {
      "gsap": "^3.15.0",
      "lenis": "^1.3.23",
      "split-type": "^0.3.4"
    }
    ```
  - `tsconfig.json` (Line 22): `"include": ["src"]`
  - `DESIGN.json`: Defines custom CSS/design variables for colors, typography, layout grid, breakpoints, and motion defaults.

### B. Core Source Files (`/src/`)
- **`src/utils/scroll.ts`**:
  - Exports `initSmoothScroll()` (Lines 5-21) returning a `Lenis` instance, syncing Lenis scroll events to GSAP `ScrollTrigger` updates:
    ```typescript
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    ```
- **`src/main.ts`**:
  - Imports: `style.css` (Line 1), `gsap` (Line 3), `ScrollTrigger` (Line 4), `SplitType` (Line 5), and `initSmoothScroll` (Line 18).
  - Implements: Text splitting span wrappers, ScrollTrigger animations, staircase typography reveals, clip-path element squeezes, blinds mask curtain reveals, vertical snap boundaries, parallax calculations, and client testimonial carousel fades.
- **`src/vertical.ts`**:
  - Imports: `style.css` (Line 1), `gsap` (Line 3), `ScrollTrigger` (Line 4), and `initSmoothScroll` (Line 8).
  - Implements: Math-driven 3D cylinder layout configurations and wrapper rotation animations based on scroll progress.
- **`src/horizontal.ts`**:
  - Code: Contains only a single `console.log("Horizontal scroll script loaded");` placeholder.
- **`src/preview.ts`**:
  - Imports: `gsap` (Line 1), `SplitType` (Line 2).
  - Implements: Stagger, Split-Flap, and 3D Cylinder typography animations for the playground (`preview.html`).
- **`src/style.css`**:
  - Declares all root CSS variables (colors, typography, spacing), smooth scroll layout configurations, and responsive rules.

### C. Assets and Other Folders
- **`/public/`**: Stores static media directly referenced in CSS/HTML via relative paths (e.g. `/videos/...`, `/images/...`).
- **`/contexts/`**: Contains `audit-issues.md` and `critique-issues.md` (which document existing visual, accessibility, and functional bugs). Note that files like `contexts/story.md` referenced in `README.md` are absent.
- **`/scratch/`**: Holds isolated text dumps (`cleaned_haven.txt`), Python scripts (`parse_haven.py`), and test pages (`sandbox.html`).
- **`/research results/`**: Stores a markdown research library focusing on GSAP/motion design.

---

## 2. Logic Chain

Based on the observations:
1. **Entry Point Separation**: The project is structured as a multi-page app with distinct routes (main, horizontal, vertical). This is validated by `vite.config.ts` registering three inputs (`index.html`, `horizontal.html`, `vertical.html`).
2. **Missing Build Target**: `preview.html` is not defined in `vite.config.ts`'s rollup input. Therefore, it is intended only as a local development/playground file and is not output during a production build.
3. **Incomplete Horizontal Flow**: `src/horizontal.ts` is purely a placeholder with no functional timeline. The issue description in `contexts/critique-issues.md` ("[P0] Issue: Broken horizontal scroll path Page") is confirmed by this code gap.
4. **Tight Module Coupling**: Both `src/main.ts` and `src/vertical.ts` import `initSmoothScroll` from `src/utils/scroll.ts`. They do not share state but share the initialization utility. Both entry points register `style.css` as their style manifest.
5. **Asset Serving**: The `/public/` directory contains folders `videos/` and `images/` which are served as static paths at `/videos/...` and `/images/...` by Vite's asset compiler.

---

## 3. Caveats

- **No Unused Code Analysis**: The actual unused exports inside CSS classes were not comprehensively mapped, though all TypeScript files were read in full.
- **Outdated Documentation**: The `README.md` references files that do not exist in the current worktree (e.g., `contexts/story.md`, `.ai-skills/*`). It appears the codebase was refactored or cleaned up, but the README was not updated to reflect this.

---

## 4. Conclusion & Directory Details

The codebase is organized into several distinct folders:

### Directory Details Table

| Directory Path | Purpose | Key Files | Imports | Exports | Internal Dependencies |
|---|---|---|---|---|---|
| `/` (Root) | App configuration, entry points, design tokens, and build pipelines. | `index.html`, `vertical.html`, `horizontal.html`, `preview.html`, `vite.config.ts`, `package.json`, `tsconfig.json`, `DESIGN.json`, `README.md` | CSS/TS entries loaded via standard script/link tags. | None. | Relies on `/src/` for logic/styles and `/public/` for static assets. |
| `/src/` | Holds all core TypeScript modules and stylesheets. | `main.ts`, `vertical.ts`, `horizontal.ts`, `preview.ts`, `style.css` | `gsap`, `lenis`, `split-type`, local CSS/TS files. | JavaScript bundles compiled at build time. | Relies on `src/utils/scroll.ts` and `src/style.css` for common setup. |
| `/src/utils/` | Shared utilities. | `scroll.ts` | `lenis`, `gsap`, `gsap/ScrollTrigger` | `initSmoothScroll()` | None. |
| `/src/assets/` | Small static logo or typescript icons. | `hero.png`, `typescript.svg`, `vite.svg` | None. | Asset files. | None. |
| `/public/` | Host folder for luxury video loops, images, and brand imagery. | Video files, image folders, `icons.svg`, `favicon.svg` | None. | Static assets at `/videos/*` and `/images/*`. | None. |
| `/contexts/` | Local document audits outlining current bug reports. | `audit-issues.md`, `critique-issues.md` | None. | None. | References selectors and scripts in `src/` and `index.html`. |
| `/scratch/` | Offline text sorting and parsing sandbox. | `cleaned_haven.txt`, `parse_haven.py`, `sandbox.html` | None. | None. | None. |
| `/research results/` | Motion design reference guides. | `gemini 3.1 pro Elite Motion Design Research Library.md` | None. | None. | None. |

### Summary of Global Architecture
The application runs as a **Vite-powered Multi-Page Application (MPA)**. 
- **Style Foundation**: Custom css design tokens defined in `src/style.css` dictate layout sizes, luxury theme variables, and grid densities.
- **Scroll & Motion Foundation**: Built on top of **Lenis (smooth scroll)** and **GSAP (ScrollTrigger & Timeline)**. The custom `scroll.ts` utility bridges the smooth scroll animation loop to the browser requestAnimationFrame cycles.
- **Page Flows**:
  - **LATERITE Sanctuary Main Experience (`index.html` + `src/main.ts`)**: Sequential scroll timeline moving from Act I (opening the threshold, brand reveal, squeezed container and Atelier text reveals), through Act II (vertical rooms snapping and parallax), Act III (pinned editorial text stagger & image carousel), and Act IV (outro brand fade).
  - **3D Cylinder Carousel (`vertical.html` + `src/vertical.ts`)**: Re-arranges DOM elements into a 3D cylindrical formation via CSS transform-style rules, rotating the cylinder as scroll progress changes.
  - **Horizontal Gallery (`horizontal.html` + `src/horizontal.ts`)**: Currently a non-functional skeleton due to an empty logic file.
  - **Playground (`preview.html` + `src/preview.ts`)**: Direct testbed for typography effects (Stagger, Split-Flap, Cylinder) without scroll dependencies.

---

## 5. Verification Method

To verify the codebase setup and compile-time status:
1. Run `npm install` and `npm run build` in an environment where external network registry access is permitted. (Local installation is skipped in this environment due to `CODE_ONLY` network restriction rules, and `node_modules` is not pre-installed).
2. Verify that:
   - TypeScript compilation succeeds without check errors (`tsc` passes).
   - Vite builds the three configured entry targets (`index.html`, `horizontal.html`, `vertical.html`).
   - The compiled outputs are structured under the `dist/` build output folder with static assets correctly resolved.

