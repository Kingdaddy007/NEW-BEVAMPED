export interface ShowroomSpread {
  src: string;
  caption: string;
  label: string;
}

export interface ShowroomProject {
  id: string;
  index: string;
  name: string;
  discipline: string;
  market: string;
  year: string;
  timeline: string;
  thesis: string;
  summary: string;
  challengeTitle: string;
  challengeBody: string;
  solutionTitle: string;
  solutionBody: string;
  outcomePoints: Array<{ metric: string; label: string }>;
  poster: string;
  excerptVideo: string;
  fullDesktopVideo: string;
  fullMobileVideo: string;
  mountTint: string;
  spreads: ShowroomSpread[];
}

export const SHOWROOMS: ShowroomProject[] = [
  {
    id: 'studio-bespoke',
    index: '01',
    name: 'Studio Bespoke',
    discipline: 'Editorial Digital Showroom',
    market: 'Residential Interiors · International',
    year: '2026',
    timeline: '6 Weeks',
    thesis: 'A personal introduction yields to an exhibition-paced project index.',
    summary:
      'Designed to replace a static grid with an editorial dialogue where architectural photography and quiet typographic hierarchy hold equal weight.',
    challengeTitle: 'High-caliber rooms flattened by a standard portfolio grid.',
    challengeBody:
      'When six-figure residential commissions sit inside equal-sized thumbnails, discerning buyers cannot feel the joinery, light, or spatial sequence. Studio Bespoke needed an arrival that established authorship before showing a single room.',
    solutionTitle: 'Editorial stillness paired with deliberate typographic cadence.',
    solutionBody:
      'We opened directly over a sunlit interior with an unhurried editorial statement, anchored a persistent thesis sentence beside arriving project plates, and used arched framing geometry to carry the eye cleanly through each room.',
    outcomePoints: [
      { metric: '01', label: 'Unified Narrative Spine' },
      { metric: '100%', label: 'Custom-Engineered Motion' },
      { metric: '6 Wks', label: 'Perceive to Signal' },
    ],
    poster: '/flagship/media/studio-bespoke-0.webp',
    excerptVideo: '/flagship/media/studio-bespoke.mp4',
    fullDesktopVideo: '/more-than-a-gallery/projects/studio-bespoke-desktop.mp4',
    fullMobileVideo: '/more-than-a-gallery/projects/studio-bespoke-mobile.mp4',
    mountTint: '#1f1c19',
    spreads: [
      {
        src: '/flagship/media/studio-bespoke-0.webp',
        label: 'Spread 01 · Index Choreography',
        caption: 'In the project index, a single editorial sentence holds its place while two residential commissions arrive beside it.',
      },
      {
        src: '/flagship/media/studio-bespoke-1.webp',
        label: 'Spread 02 · Sunlit Opening',
        caption: 'The opening sets the studio voice directly across a sunlit architectural elevation with zero UI clutter.',
      },
      {
        src: '/flagship/media/studio-bespoke-2.webp',
        label: 'Spread 03 · Spatial Cadence',
        caption: 'A quiet sequence of arches carries the visitor through the photography at gallery reading speed.',
      },
    ],
  },
  {
    id: 'laterite',
    index: '02',
    name: 'Laterite',
    discipline: 'Spatial Narrative & Material Study',
    market: 'Luxury Architecture · Lagos & Dubai',
    year: '2026',
    timeline: '7 Weeks',
    thesis: 'A typographic veil lifts to let warm stone and timber architecture breathe.',
    summary:
      'Built around earth, shadow, and tonal transition—moving the visitor from bright limestone clarity into the warm amber dusk of private timber interiors.',
    challengeTitle: 'Communicating material tactility through a glass screen.',
    challengeBody:
      'Laterite’s physical work is defined by honed stone, dark timber, and calibrated shadow. Conventional agency animations felt synthetic and noisy against the studio’s grounded architectural sensibility.',
    solutionTitle: 'Weighted reveals and tonal chapter transitions.',
    solutionBody:
      'We engineered a typographic veil that lifts smoothly to share a single focal plane with the sunlit room, paced between images with quiet single-line pauses before shifting the entire atmosphere into The Reserve’s dark timber and amber light.',
    outcomePoints: [
      { metric: '2', label: 'Tonal Light Chapters' },
      { metric: '60fps', label: 'Calibrated Scroll Depth' },
      { metric: '7 Wks', label: 'Concept to Launch' },
    ],
    poster: '/flagship/media/laterite-0.webp',
    excerptVideo: '/flagship/media/laterite.mp4',
    fullDesktopVideo: '/more-than-a-gallery/projects/laterite-desktop.mp4',
    fullMobileVideo: '/more-than-a-gallery/projects/laterite-mobile.mp4',
    mountTint: '#241b16',
    spreads: [
      {
        src: '/flagship/media/laterite-0.webp',
        label: 'Spread 01 · Shared Focal Plane',
        caption: 'The title and sunlit interior share one calm architectural plane as the opening resolves.',
      },
      {
        src: '/flagship/media/laterite-1.webp',
        label: 'Spread 02 · Designed Silence',
        caption: 'A solitary line of typography gives the eye deliberate breathing room between high-contrast studies.',
      },
      {
        src: '/flagship/media/laterite-2.webp',
        label: 'Spread 03 · The Reserve Shift',
        caption: 'The palette transitions cleanly into dark timber and warm amber light without breaking typographic continuity.',
      },
    ],
  },
  {
    id: 'xbd-collective',
    index: '03',
    name: 'XBD Collective',
    discipline: 'Cinematic Flagship Concept',
    market: 'Bespoke Architecture & Interiors · Dubai',
    year: '2026',
    timeline: '8 Weeks',
    thesis: 'A dusk exterior becomes the monumental stage for architectural scale.',
    summary:
      'An atmospheric digital showroom engineered for high-net-worth residential commissions—where low horizons, dusk illumination, and monumental type signal immediate authority.',
    challengeTitle: 'Matching the presence of multi-million-dollar architectural commissions.',
    challengeBody:
      'At the top tier of Dubai and international residential design, prospects judge studio caliber within three seconds. The digital environment had to command the same stillness and architectural gravity as a dusk walkthrough.',
    solutionTitle: 'Monumental scale balanced by generous negative space.',
    solutionBody:
      'We staged the title across a dusk exterior horizon, gave category chapters expansive fields of quiet negative space, and used warm amber glow cues to draw visitors naturally from overview into commission detail.',
    outcomePoints: [
      { metric: '3s', label: 'Authority Recognition' },
      { metric: '70%', label: 'Calibrated Negative Space' },
      { metric: '8 Wks', label: 'Full Showroom System' },
    ],
    poster: '/flagship/media/xbd-collective-0.webp',
    excerptVideo: '/flagship/media/xbd-collective.mp4',
    fullDesktopVideo: '/more-than-a-gallery/projects/xbd-collective-desktop.mp4',
    fullMobileVideo: '/more-than-a-gallery/projects/xbd-collective-mobile.mp4',
    mountTint: '#161924',
    spreads: [
      {
        src: '/flagship/media/xbd-collective-0.webp',
        label: 'Spread 01 · Monumental Dusk Stage',
        caption: 'The studio title settles cleanly across the dusk architectural exterior without competing with the elevation.',
      },
      {
        src: '/flagship/media/xbd-collective-1.webp',
        label: 'Spread 02 · Architectural Space',
        caption: 'The discipline index gives typography a wide field of open space so each category reads with quiet authority.',
      },
      {
        src: '/flagship/media/xbd-collective-2.webp',
        label: 'Spread 03 · Horizon Continuity',
        caption: 'A low horizon and warm amber reflection establish the emotional temperature of the next residence.',
      },
    ],
  },
];

export interface InstrumentSpace {
  id: string;
  label: string;
  title: string;
  location: string;
  src: string;
  noteWide: string;
  noteDetail: string;
}

export const INSTRUMENT_SPACES: InstrumentSpace[] = [
  {
    id: 'restraint',
    label: '01 · Restraint',
    title: 'Villa Al-Noor Salon',
    location: 'Dubai · Limestone & Bronze',
    src: '/more-than-a-gallery/principles/restraint-1600.webp',
    noteWide: 'Wide architectural framing lets negative space establish room proportion before detail.',
    noteDetail: 'Tight focal cropping isolates joinery, shadow line, and material grain.',
  },
  {
    id: 'scale',
    label: '02 · Scale',
    title: 'Ikoyi Courtyard Residence',
    location: 'Lagos · Travertine & Warm Oak',
    src: '/more-than-a-gallery/principles/scale-1600.webp',
    noteWide: 'Full-frame elevation communicates architectural volume and daylight flow.',
    noteDetail: 'Material zoom shifts the buyer’s eye from room overview to bespoke craftsmanship.',
  },
  {
    id: 'sequence',
    label: '03 · Sequence',
    title: 'The Pavilion Gallery',
    location: 'London · Smoked Cedar & Plaster',
    src: '/more-than-a-gallery/principles/sequence-1600.webp',
    noteWide: 'Balanced horizon lines create the stillness of walking an actual private residence.',
    noteDetail: 'Close framing dramatizes tonal depth and grazing evening illumination.',
  },
];

export const VAMPED_PHASES = [
  {
    num: '01',
    name: 'PERCEIVE',
    summary: 'Deep discovery: spatial audit, design philosophy extraction, and discerning-client profiling.',
    detail: 'Before a wireframe exists, we isolate the exact distance between the caliber of your physical interiors and how your studio currently signals online.',
    image: '/more-than-a-gallery/prologue-background.webp',
    caption: 'Phase 01 · Spatial Audit & Perception Mapping',
  },
  {
    num: '02',
    name: 'ARCHITECT',
    summary: 'Structure the digital journey: narrative arc, editorial case-study flow, and inquiry gate logic.',
    detail: 'Every page chapter is sequenced like a physical showroom walkthrough—building conviction while filtering out misaligned inquiries before they reach your inbox.',
    image: '/more-than-a-gallery/principles/sequence-1600.webp',
    caption: 'Phase 02 · Narrative Architecture & Qualification Gate',
  },
  {
    num: '03',
    name: 'ACTIVATE',
    summary: 'Custom engineering: weighted scroll choreography, typographic calibration, and tactile interaction.',
    detail: 'Hand-coded from a blank canvas with GSAP, Lenis, and bespoke light shaders—tuned for 60fps desktop presence and effortless mobile touch.',
    image: '/flagship/media/laterite-0.webp',
    caption: 'Phase 03 · Bespoke Motion & Front-End Craft',
  },
  {
    num: '04',
    name: 'SIGNAL',
    summary: 'Launch calibration: editorial reveal assets, technical SEO, and referral-ready positioning.',
    detail: 'Your showroom enters the market as a category-of-one asset that elevates press, Instagram case-study reveals, and high-trust client introductions.',
    image: '/flagship/media/xbd-collective-0.webp',
    caption: 'Phase 04 · Market Debut & Authority Positioning',
  },
];

export const STANDARDS = [
  {
    num: '01',
    title: 'ORIGINAL ARCHITECTURE',
    body: 'Every showroom is engineered from a blank canvas. Never a Squarespace, Webflow, or recycled theme.',
  },
  {
    num: '02',
    title: 'MOTION AS SPATIAL PACING',
    body: 'Weighted scroll and designed silence choreographed to mirror the feeling of walking a finished room.',
  },
  {
    num: '03',
    title: 'BUILT TO PRE-QUALIFY',
    body: 'An integrated scoping threshold that aligns project investment and ambition before your first call.',
  },
  {
    num: '04',
    title: 'DIRECT STUDIO AUTHORSHIP',
    body: 'You collaborate directly with the creative director and engineer building the work—zero handoff dilution.',
  },
  {
    num: '05',
    title: 'CALIBRATED PERFORMANCE',
    body: 'Cinema-grade imagery and motion engineered for rapid first paint, mobile poise, and reduced-motion clarity.',
  },
  {
    num: '06',
    title: 'PAID DIAGNOSTIC FIRST',
    body: 'Every commission starts with a Digital Showroom Audit so the perception gap is proven before we build.',
  },
];

export const FAQS = [
  {
    q: 'How is a Cinematic Digital Showroom different from a portfolio website?',
    a: 'A portfolio website is a passive filing cabinet of completion photos. A Cinematic Digital Showroom sequences your brief, constraints, material choices, and spatial atmosphere into a guided environment that pre-qualifies discerning clients before they ever write to you.',
  },
  {
    q: 'What do we need ready before commissioning a build?',
    a: 'Strong architectural photography of at least two to three representative projects and a willingness to articulate how your studio thinks. During the Perceive phase, we extract the narrative, structure the copy, and direct every visual crop.',
  },
  {
    q: 'Why do engagements begin with a Digital Showroom Audit?',
    a: 'Because prescribing architecture before diagnosing the perception gap wastes your time. The paid Digital Showroom Audit maps exactly where your current presence leaks authority and outlines a clear blueprint before you commit to a full build.',
  },
  {
    q: 'How long does a full showroom commission take?',
    a: 'Most flagship commissions move from Perceive to Signal in six to ten weeks, depending on the number of featured residences and bespoke interactive studies.',
  },
  {
    q: 'Will the showroom feel equally commanding on mobile?',
    a: 'Yes. High-net-worth clients frequently arrive via Instagram or private WhatsApp introductions on their phones. Mobile is architected with its own vertical rhythm, tactile previews, and crisp typography—never a shrunk desktop screen.',
  },
  {
    q: 'Can we publish new completed residences after launch?',
    a: 'Every showroom ships with a structured project architecture so new residences slot seamlessly into your typographic system, framing ratios, and case-study narrative without compromising visual standards.',
  },
];
