# Pattern: Cinematic Multi-Block Curtain Reveal

## Description
A sophisticated entrance animation where multiple solid-color blocks sweep across a text container horizontally, acting like layered curtains to reveal typography underneath.

## The Mechanic (Good Fella Signature Move)
1. The text is initially wrapped in a container with `overflow: hidden`.
2. Two `div` elements (blocks) are positioned absolutely over the text, both starting with `transform: translateX(-100%)` (hidden to the left).
3. Block A (Top Layer, e.g., Black) sweeps to `translateX: 0%`.
4. Block B (Middle Layer, e.g., Orange/Gold) follows slightly delayed, also sweeping to `translateX: 0%`.
5. The text opacity is instantly set to 1 while completely covered by the blocks.
6. Block A sweeps out to the right (`translateX: 100%`), revealing Block B behind it.
7. Block B sweeps out to the right (`translateX: 100%`), finally revealing the text behind it.

## Key CSS Setup
```css
.heading-reveal-wrapper {
  position: relative;
  display: inline-block;
  overflow: hidden; 
}
.hero-headline { opacity: 0; }
.reveal-block {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  transform: translateX(-101%);
}
.block-gold { z-index: 2; }
.block-dark { z-index: 3; }
```

## Key GSAP Implementation
```typescript
const tl = gsap.timeline();
// Dark block covers area
tl.to('.block-dark', { xPercent: 100, duration: 0.8, ease: 'power3.inOut' });
// Gold block follows
tl.to('.block-gold', { xPercent: 100, duration: 0.8, ease: 'power3.inOut' }, "-=0.5");
// Text becomes visible while covered
tl.set('.hero-headline', { opacity: 1 });
// Dark block exits right
tl.to('.block-dark', { xPercent: 200, duration: 0.9, ease: 'power3.inOut' }, "+=0.2");
// Gold block exits right
tl.to('.block-gold', { xPercent: 200, duration: 0.9, ease: 'power3.inOut' }, "-=0.6");
```
