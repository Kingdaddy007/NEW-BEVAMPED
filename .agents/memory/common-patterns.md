# Common Patterns & Reusable Code

- **GSAP ScrollTrigger Pinned Sections:** We rely heavily on pinning sections and scrubbing animations (like scaling up videos or revealing text) linked to the scroll position.
- **Gallery Caption Lockup:** 
  ```html
  <div class="room-caption">
    <h2 class="room-caption-title">ROOM NAME</h2>
    <p class="room-caption-desc">Uppercase tracked description.</p>
  </div>
  ```
- **Video Background Layers:** Using `video { object-fit: cover; width: 100vw; height: 100vh }` combined with `z-index` layering to place typography smoothly over cinematic motion.
- **Clipping Stacking Context Hack:** To achieve rounded top corners on a wrapper without using overflow: hidden (which creates a strict stacking context that blocks position: fixed background elements), use clip-path: inset(0 0 0 0 round 40px 40px 0 0);.
- **Dynamic Color Inversion (GSAP):** For fixed headers/footers navigating over changing background colors (e.g. going from raw video to a solid Ivory block), use GSAP to tween `color`, `textShadow`, `backgroundColor`, and `borderColor` dynamically. This ensures UI legibility without relying on generic glassmorphism blurs.

- **Grid-Based Smooth Accordion:** 
  `css
  .accordion-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s ease; }
  .is-open .accordion-wrapper { grid-template-rows: 1fr; }
  .accordion-inner { overflow: hidden; }
  ``n- **Cipher Scramble on Click:** Using setInterval on click to map text string characters to random symbols, injecting a specific inline color via innerHTML before resolving back to the original string after x iterations.

- **Standardized Kinetic Text Reveal**: Split-reveal scroll animations (using classes like \.split-reveal-hero\, \.split-reveal-timeline\, \.split-reveal-process\, and \.split-reveal-foundation\) are standardized across sections. They are driven by GSAP ScrollTrigger to fire consistently when the element hits \	op 85%\ of the viewport, ensuring an identical, buttery-smooth kinetic velocity as the user descends the page.
