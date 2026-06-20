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
