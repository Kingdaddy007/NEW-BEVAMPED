BEVAMPED Premium Visual Style Guide

The Complete Visual Identity System — Manropeior Decorator Niche

This document is the single source of truth for every visual decision BEVAMPED makes. If it's not here, it doesn't exist yet.


--------------------------------------------------------------------------------


1. BRAND ESSENCE — What the Visuals Must Feel Like

Every visual we produce must communicate one thing before words are read:

"This is a studio that understands taste at the highest level."

Not luxury-by-loudness. Not gold-everything. Not dark-and-moody for the sake of drama.

Quiet authority.

 Like walking into a space that has been considered down to the millimetre.

The Three Visual Laws

Restraint is the signal.

 Every element that is absent is a design decision.

Gold is sacred.

 It appears at the moment of transformation — not as decoration.

Space breathes.

 70% of every layout is negative space doing active work.


--------------------------------------------------------------------------------


2. COLOR SYSTEM

Primary Palette — The Brand Anchors

Name

Role

Hex

When to Use

Gallery Obsidian

Primary background (dark mode)

#0A0A0B

70% of dark layouts — the gravity center

Cool Light Grey

Primary background (light mode)

#F5F6F8

70% of light layouts — gallery canvas feel

Charcoal

Secondary structure

#2E2E2E

20% — borders, dividers, "before" states

Gold

Sacred accent

#D4AF37

10% MAX — transformation moments only

Extended Palette — Digital Use Only

Name

Hex

When

Electric Teal

#00B3A4

Hover states, button focus rings, digital-only accents

Forest

#1C3B2F

Rare — theme layouts representing growth, legacy

Deep Gallery Obsidian

#111526

Alternate section backgrounds for depth variation

The 70/20/10 Rule — Non-Negotiable

[████████████████████████████ 70% Gallery Obsidian or Light Grey ]
[████████ 20% Charcoal ]
[███ 10% Gold ]


Gold is never used as a full background.

 The ONLY exception: the definitive closing statement slide/section (e.g., the word "UNDENIABLE" on a gold field). Even then, it is one moment, not a pattern.

Background Gradients

Dark-to-Light transition (use between sections):

background: linear-gradient(135deg, #0A0A0B 0%, #222947 35%, #596180 70%, #F5F6F8 100%);


css

Spotlight atmospheric glow (hero sections):

background: radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.12) 0%, rgba(26, 31, 54, 0) 65%), #0A0A0B;


css


--------------------------------------------------------------------------------


3. TYPOGRAPHY SYSTEM

The Font Stack

DISPLAY (Editioral / Heritage)  →  Cormorant Garamond
DISPLAY (Modern / Structural)   →  Jost
BODY / UI / META                →  Manrope


Import (Google Fonts):

https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;600;800;900&family=Manrope:wght@300;400;600;700&display=swap


Typographic Scale

Layer

Font

Weight

Size (Web)

Size (Social 1080px)

Line Height

Letter Spacing

Primary Display — Serif

Cormorant Garamond

600–700

clamp(3rem, 7vw, 5rem)

68–74px

1.1 (110%)

-0.015em

Primary Display — Sans

Jost

800–900

clamp(2.5rem, 5vw, 3.75rem)

56–62px

1.05 (105%)

-0.025em

Headline / Sub-hook

Jost or Manrope

600

clamp(1.5rem, 3vw, 2rem)

28–32px

1.25 (125%)

-0.01em

Body Copy

Manrope

400

1–1.125rem

18–20px

1.7 (170%)

+0.01em

Labels / Step Markers

Manrope

600

0.8125rem

13–14px

1.2 (120%)

+0.18em — ALL CAPS

CTA

Manrope

700

0.875–1rem

16–18px

1.3 (130%)

+0.05em

Pairing Rationale

Cormorant Garamond + Manrope

 = The "Classic & Lithic" pair — used for editorial, high-touch moments, project headlines, manifesto copy. References luxury publishing. Commands authority.

Jost + Manrope

 = The "Modern & Architectural" pair — used for UI labels, process steps, stats, technical breakdowns. Signals clarity and precision.

Hard Anti-Patterns

❌ Never Do

Why

Italicise Cormorant Garamond display titles

Italics break the "monolith" firmness

More than 3 type sizes on one slide/section

Creates visual noise, not hierarchy

Text shadows, glows, or outlines

High contrast does the work — never decorate

All-caps on Cormorant display

Sentence case only for serif displays


--------------------------------------------------------------------------------


4. GRID & SPACING

The Core Rule: Designed Silence

"What you leave empty is a design decision. Treat negative space as a structural wall."

Outer boundary margin:

 10% padding on all sides (108px on a 1080×1080 social slide; equivalent 

padding: 0 clamp(1.5rem, 5vw, 6rem)

 on web).

Density cap:

 Maximum 30% of any layout contains visual data. 70% is empty.

Body copy max-width:

 540px (50% of 1080px) — enforces 45–60 character line length.

Grid Structures

Grid

Use Case

Gutter

2×2

Comparisons, dual-pillar frameworks

40px

3×3

Technical breakdowns, material swatches, process stages

32px

Full-bleed

Hero, cinematic reveals, manifesto slides

No gutter — image or text fills entirely

Architectural Dividers

/* On dark layouts */
border: 1px solid rgba(245, 246, 248, 0.08);

/* On light layouts */
border: 1px solid rgba(46, 46, 46, 0.06);


css

Divider lines must terminate 20px before the outer margin boundary — they float, never touch the edge.

Watermark Rule

The BEVAMPED wordmark watermark appears bottom-right on every branded asset:

Size:

 24px width (web) / small stamp on social

Opacity:

 25%

Color:

 Light Grey (

#F5F6F8

) on dark layouts, Navy (

#0A0A0B

) on light layouts

Position:

 Always fixed bottom-right — never shifts


--------------------------------------------------------------------------------


5. MOTION SYSTEM

Motion is not decoration. It is narrative.

The guiding metaphor:

 Every animation should feel like 

light rising

 or 

ink setting into paper.

 Deliberate. Weighted. Refined.

Motion Laws

Fast deceleration:

 80% of animation completes in the first 400ms. The remaining duration is micro-settling. Fast but refined.

No bouncing. No shaking.

 Only three acceptable vectors: vertical reveals, horizontal translations, radial fades.

Restraint:

 If removing an animation improves the experience, remove it.

Performance first:

 If frames drop below 50fps on 4G mobile, disable staggered reveals and fall back to opacity fade.

Official Easing Curves

quietAuthority → power3.out → cubic-bezier(0.215, 0.610, 0.355, 1.000)
entrance        → power4.out → cubic-bezier(0.23,  1,     0.32,  1)


Motion Stack

Tool

Role

GSAP

All animation logic

Lenis

Smooth scroll (duration: 1.5s, exponential easing)

ScrollTrigger

Scroll-bound reveals

Clip-path + Draggable

Before/after reveal sliders

Standard Reveal (Scroll-triggered)

gsap.from(".element", {
  y: 60,
  opacity: 0,
  duration: 1.1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".element",
    start: "top 85%",
    toggleActions: "play none none none"
  }
});


javascript

Text Character Reveal (Headlines)

gsap.from(".headline .char", {
  y: "120%",
  opacity: 0,
  duration: 1.3,
  ease: "power4.out",
  stagger: 0.02,
  force3D: true,
  scrollTrigger: { trigger: ".headline-wrapper", start: "top 85%" }
});


javascript

Gold Ribbon — Signature Motion

gsap.fromTo(".signature-ribbon",
  { xPercent: -105, skewX: -15 },
  {
    xPercent: 105, skewX: -15,
    ease: "power2.inOut", duration: 1.8,
    scrollTrigger: { trigger: ".swipe-section", scrub: true }
  }
);


javascript


--------------------------------------------------------------------------------


6. SOCIAL MEDIA VISUAL STANDARDS

Canvas Specifications

Format

Dimensions

Safe Zone

Background

Instagram Carousel Slide

1080×1080px

108px all sides

Gallery Obsidian or Cool Light Grey

Instagram Single Post

1080×1350px

108px all sides

Gallery Obsidian or Cool Light Grey

Instagram Stories

1080×1920px

108px top/bottom, 60px sides

Gallery Obsidian with spotlight gradient

LinkedIn Banner

1584×396px

80px all sides

Gallery Obsidian

Carousel Slide Architecture

Every carousel follows this structural discipline:

┌─────────────────────────────────────────────────────┐
│  108px outer boundary — nothing exists here          │
│  ┌─────────────────────────────────────────────┐    │
│  │  [01 / LABEL]   ← ALL CAPS, Manrope, Gold     │    │
│  │                                             │    │
│  │  Display headline                           │    │
│  │  (max 540px wide, Cormorant or Jost)  │    │
│  │                                             │    │
│  │  Body copy — max 3 lines (Manrope 400)        │    │
│  │                                             │    │
│  │                    [BEVAMPED watermark 25%] │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘


Slide Transitions (The 2-Background System)

Slide Type

Background

Text Color

Use Case

Anchor

Navy 

#0A0A0B

Light Grey

Main statements, authority moments

Contrast

Charcoal 

#2E2E2E

Muted italic grey

"Before" states, myths, problems

Resolution

Gold 

#D4AF37

Gallery Obsidian

Final transformation moment ONLY

Light

Cool Grey 

#F5F6F8

Charcoal

Process steps, educational slides


--------------------------------------------------------------------------------


7. IMAGERY STANDARDS

What We Show

Curated rooms

 with controlled light — no harsh flash photography

Material detail shots

 — texture of marble, grain of timber, weave of linen

Spatial transitions

 — threshold moments (doorways, entries, the turn of a corridor)

Before/after

 presented as case evidence, not shock contrast

Studio process

 — hand-drawn plans, material swatches, elevation sketches

What We Never Show

Generic stock photography (people laughing in offices, stock smiling clients)

Overcrowded or cluttered rooms

Bright primary colors that conflict with the brand palette

Rooms that look identical to a Pinterest template

Image Cropping Rules

Always crop to the 

best light and spatial depth

 in the image, not the widest view

On mobile, crops must preserve 

the room's primary design element and light source

Hero images: position subject at 

object-position: center 40%

 (slightly above center, weight toward material)


--------------------------------------------------------------------------------


8. VOICE AS VISUAL — Copy Rules That Apply to Design

Design and copy are one system. The visual rules must match the verbal rules.

Design Element

Visual Rule

Copy Equivalent

Negative space

70% empty

Short paragraphs, white space between ideas

Gold accent

10% max, transformation only

One key word highlighted per caption, not five

No decorative text effects

Typography earns contrast through weight/size alone

No exclamation marks, no emoji clusters

Watermark at 25% opacity

Brand present but not shouting

Sign off quietly — "BEVAMPED Studio." not "BEVAMPED!!!"

Charcoal for "before" states

Visual language for problems

Muted, italic, restrained — the myth wears quiet clothes


--------------------------------------------------------------------------------


VERIFICATION CHECKLIST

Before publishing any asset (social, web, document):

[ ] Does this follow 70/20/10? Can I see the Gold being used sparingly?

[ ] Is negative space working, not just existing?

[ ] Are there more than 3 type sizes? If yes — cut one.

[ ] Is Cormorant Garamond used for editorial moments? Is it upright (not italic)?

[ ] Is the BEVAMPED watermark in place at 25% opacity?

[ ] Does the motion (if any) feel like rising light or settling ink?

[ ] Would someone who has never heard of BEVAMPED look at this and think "premium studio"?


--------------------------------------------------------------------------------


Version 1.0 — Living Document

 

Last Updated: June 2026