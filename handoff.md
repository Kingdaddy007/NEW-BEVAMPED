# BEVAMPED: Loader Motion Concepts Handoff

This document details the GSAP logic and CSS structure required to implement the three bespoke loader concepts for BEVAMPED. 

## Concept 1: The Blueprint to Reality (The Architect)
**Vibe:** Turning a structural framework into a finished spatial reality.

### Mechanics
1. **CSS Structure:** The loader screen has a dark background (`var(--vamped-bg)`) and an overlaid `div` with a CSS-generated grid pattern (faint gold lines).
2. **GSAP Logic:**
   - **Phase 1:** The logo fades in, holds, and fades out.
   - **Phase 2:** The grid overlay smoothly blurs and fades to `opacity: 0`.
   - **Phase 3:** The main loader background fades to `opacity: 0`, revealing the page.
   - **Phase 4:** Simultaneously, the Hero text executes the Spatial Light Reveal (SplitText stagger sliding up from a masked baseline).

---

## Concept 2: The Spotlight (The Gallery)
**Vibe:** Stepping into a curated, perfectly lit gallery space.

### Mechanics
1. **CSS Structure:** The loader uses a CSS `radial-gradient` that acts as a spotlight. Initially, the spotlight is small (e.g., `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,1) 15%)`).
2. **GSAP Logic:**
   - We animate CSS variables (e.g., `--spotlight-size`) using GSAP.
   - **Phase 1:** Spotlight softly pulses on the logo.
   - **Phase 2:** The `--spotlight-size` variable animates from `15%` to `150%`, effectively washing the screen in light and "melting" the darkness away.
   - **Phase 3:** Loader wrapper `display: none`.

---

## Concept 3: The Slow Burn (Quiet Luxury)
**Vibe:** Complete, unbothered confidence. Flawless timing over flashy shapes.

### Mechanics
1. **CSS Structure:** A pure, flat obsidian block covering the viewport. No grids, no shapes.
2. **GSAP Logic:**
   - **Phase 1:** Logo fades out extremely slowly (`duration: 1.5`, `ease: "power2.inOut"`).
   - **Phase 2:** The main black background fades to `opacity: 0` over a long duration (`duration: 2.5`, `ease: "power1.inOut"`).
   - **Phase 3:** *Critically*, the Hero typography begins its Spatial Light Reveal at exactly the halfway point of the loader fade (using the `"-=1.25"` timeline offset). This creates a seamless, ghost-like transition where the text is already moving as the lights come on.
