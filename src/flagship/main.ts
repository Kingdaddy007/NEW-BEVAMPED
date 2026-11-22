import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import {
  FAQS,
  INSTRUMENT_SPACES,
  SHOWROOMS,
  STANDARDS,
  VAMPED_PHASES,
  type ShowroomProject,
} from './data';
import { mountHeroShader } from './shader';

gsap.registerPlugin(ScrollTrigger, Flip);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;

function initSmoothScroll() {
  if (reducedMotion) return;
  lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.2,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector<HTMLElement>(targetId);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target, { offset: -68 });
    });
  });
}

function initCurtainNavigation() {
  const curtain = document.querySelector<HTMLElement>('.route-curtain');
  const seam = curtain?.querySelector<HTMLElement>('.route-curtain__seam');
  const mark = curtain?.querySelector<HTMLElement>('.route-curtain__mark');
  if (!curtain || !seam || !mark) return;

  if (sessionStorage.getItem('bevamped_curtain') === '1') {
    sessionStorage.removeItem('bevamped_curtain');
    if (!reducedMotion) {
      gsap.set(curtain, { scaleY: 1, transformOrigin: 'top center' });
      gsap.set(seam, { scaleX: 1, opacity: 0.9 });
      gsap
        .timeline()
        .to(seam, { scaleX: 0, opacity: 0, duration: 0.35, ease: 'power3.in' })
        .to(curtain, { scaleY: 0, duration: 0.65, ease: 'expo.inOut' }, '-=0.15');
    }
  }

  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[data-route]');
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = link.getAttribute('href');
    if (!href) return;
    e.preventDefault();

    if (reducedMotion) {
      window.location.href = href;
      return;
    }

    sessionStorage.setItem('bevamped_curtain', '1');
    const label = link.getAttribute('data-route-label') || 'BEVAMPED';
    mark.textContent = label;
    gsap.set(curtain, { scaleY: 0, transformOrigin: 'bottom center', pointerEvents: 'all' });
    gsap.set(seam, { scaleX: 0, opacity: 0 });
    gsap.set(mark, { opacity: 0, y: 14 });

    gsap
      .timeline({
        onComplete: () => {
          window.location.href = href;
        },
      })
      .to(curtain, { scaleY: 1, duration: 0.52, ease: 'expo.inOut' })
      .to(seam, { scaleX: 1, opacity: 1, duration: 0.38, ease: 'power3.out' }, '-=0.2')
      .to(mark, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, '-=0.25');
  });
}

function initHeaderTheme() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  const lightBands = document.querySelectorAll<HTMLElement>('.band-light');
  lightBands.forEach((band) => {
    ScrollTrigger.create({
      trigger: band,
      start: 'top 64px',
      end: 'bottom 64px',
      onEnter: () => header.classList.add('is-light'),
      onLeave: () => header.classList.remove('is-light'),
      onEnterBack: () => header.classList.add('is-light'),
      onLeaveBack: () => header.classList.remove('is-light'),
    });
  });
}

function initHero() {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  const canvas = hero.querySelector<HTMLCanvasElement>('.hero__canvas');
  if (canvas) {
    mountHeroShader(canvas, reducedMotion);
  }

  const stage = hero.querySelector<HTMLElement>('.hero__stage');
  const be = hero.querySelector<HTMLElement>('.threshold-word--be');
  const vamped = hero.querySelector<HTMLElement>('.threshold-word--vamped');
  const lines = hero.querySelectorAll<HTMLElement>('.hero__title .reveal-line');
  const lead = hero.querySelector<HTMLElement>('.hero__lead');
  const actions = hero.querySelector<HTMLElement>('.hero__actions');
  const kicker = hero.querySelector<HTMLElement>('.hero__kicker');
  const foot = hero.querySelector<HTMLElement>('.hero__foot');

  let tl: gsap.core.Timeline | null = null;

  const playThreshold = () => {
    if (!stage || !be || !vamped) return;
    tl?.kill();
    gsap.set([be, vamped], { clearProps: 'transform' });

    if (reducedMotion) return;

    const stageRect = stage.getBoundingClientRect();
    const beRect = be.getBoundingClientRect();
    const vampedRect = vamped.getBoundingClientRect();
    const gap = Math.max(8, stageRect.width * 0.012);
    const totalW = beRect.width + vampedRect.width + gap;
    const scale = Math.min(0.88, (stageRect.width * 0.88) / Math.max(totalW, 1));
    const startX = stageRect.left + (stageRect.width - totalW * scale) / 2;
    const centerY = stageRect.top + (stageRect.height - beRect.height * scale) / 2;
    const vCenterY = stageRect.top + (stageRect.height - vampedRect.height * scale) / 2;

    const beDx = startX - beRect.left;
    const beDy = centerY - beRect.top;
    const vDx = startX + (beRect.width + gap) * scale - vampedRect.left;
    const vDy = vCenterY - vampedRect.top;

    gsap.set(be, { transformOrigin: 'left top', x: beDx, y: beDy, scale });
    gsap.set(vamped, { transformOrigin: 'left top', x: vDx, y: vDy, scale });
    gsap.set(lines, { yPercent: 115 });
    gsap.set([kicker, lead, actions, foot], { opacity: 0, y: 18 });

    tl = gsap
      .timeline({ defaults: { ease: 'expo.inOut' } })
      .to([be, vamped], { x: 0, y: 0, scale: 1, duration: 1.48, delay: 0.32 })
      .to(
        kicker,
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
        '-=0.82'
      )
      .to(
        lines,
        { yPercent: 0, duration: 0.95, stagger: 0.09, ease: 'power4.out' },
        '-=0.72'
      )
      .to(
        [lead, actions],
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' },
        '-=0.58'
      )
      .to(foot, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');
  };

  // Wait for fonts so bounding boxes for BE / VAMPED are pixel-accurate
  document.fonts.ready.then(() => {
    playThreshold();
  });

  hero.querySelector('#replay-opening')?.addEventListener('click', () => {
    playThreshold();
  });

  // Subtle depth parallax on hero scroll exit
  if (!reducedMotion && stage) {
    gsap.to(stage, {
      scale: 0.96,
      yPercent: -6,
      opacity: 0.55,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Featured hero hover video
  const featured = hero.querySelector<HTMLAnchorElement>('.hero-featured');
  const fVideo = featured?.querySelector<HTMLVideoElement>('video');
  if (featured && fVideo && !reducedMotion) {
    featured.addEventListener('pointerenter', () => {
      fVideo.play().catch(() => {});
    });
    featured.addEventListener('pointerleave', () => {
      fVideo.pause();
    });
  }
}

function initPerceptionGap() {
  const section = document.querySelector<HTMLElement>('#perception-gap');
  const aperture = section?.querySelector<HTMLElement>('.aperture');
  const range = section?.querySelector<HTMLInputElement>('.aperture__scrub-input');
  const pctEl = section?.querySelector<HTMLElement>('.gap-readout__pct');
  const states = section?.querySelectorAll<HTMLElement>('.gap-state');
  if (!section || !aperture) return;

  let manualOverride = false;

  const setProgress = (val: number) => {
    const p = Math.min(0.98, Math.max(0.02, val));
    aperture.style.setProperty('--p', p.toFixed(4));
    if (range) range.value = String(Math.round(p * 100));
    if (pctEl) pctEl.textContent = `${String(Math.round(p * 100)).padStart(2, '0')}%`;
    if (states && states.length >= 2) {
      states[0].classList.toggle('is-active', p < 0.48);
      states[1].classList.toggle('is-active', p >= 0.48);
    }
  };

  setProgress(0.16);

  range?.addEventListener('input', () => {
    manualOverride = true;
    setProgress(Number(range.value) / 100);
  });

  if (!reducedMotion) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 981px)', () => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=105%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          if (manualOverride && self.progress > 0.04 && self.progress < 0.96) {
            // Re-engage smooth scroll scrub once user scrolls again
            manualOverride = false;
          }
          setProgress(0.12 + self.progress * 0.82);
        },
      });
      return () => st.kill();
    });
  } else {
    setProgress(0.76);
  }
}

function initShowrooms() {
  const railEl = document.querySelector<HTMLElement>('#showrooms-index');
  const platesEl = document.querySelector<HTMLElement>('#showrooms-plates');
  if (!railEl || !platesEl) return;

  railEl.innerHTML = SHOWROOMS.map(
    (s, i) => `
    <button type="button" class="rail-item ${i === 0 ? 'is-active' : ''}" data-target="plate-${s.id}">
      <img class="rail-item__thumb" src="${s.poster}" alt="${s.name} preview" loading="lazy" />
      <span>
        <span class="rail-item__num">${s.index}</span>
        <span class="rail-item__name">${s.name}</span>
      </span>
    </button>
  `
  ).join('');

  platesEl.innerHTML = SHOWROOMS.map(
    (s) => `
    <article class="plate-card" id="plate-${s.id}" data-showroom="${s.id}" style="--plate-tint: ${s.mountTint}">
      <a class="plate-frame" href="/flagship/work.html?work=${s.id}" data-route data-route-label="${s.name.toUpperCase()}" aria-label="Enter ${s.name} showroom">
        <div class="plate-viewport">
          <img class="plate-media plate-media--poster" src="${s.poster}" alt="${s.name} digital showroom interface" loading="lazy" />
          <video class="plate-media plate-media--video" muted playsinline loop preload="none" data-src="${s.excerptVideo}" aria-hidden="true"></video>
        </div>
      </a>
      <div class="plate-meta">
        <h3 class="plate-meta__title">
          <a href="/flagship/work.html?work=${s.id}" data-route data-route-label="${s.name.toUpperCase()}">${s.name}</a>
        </h3>
        <span class="plate-meta__tags">${s.discipline} · ${s.timeline}</span>
      </div>
      <div class="plate-foot">
        <p>${s.thesis}</p>
        <div class="plate-actions">
          <button type="button" class="plate-preview-btn" data-preview-toggle>Preview Motion</button>
          <a class="plate-enter-link" href="/flagship/work.html?work=${s.id}" data-route data-route-label="${s.name.toUpperCase()}">Enter Showroom ↗</a>
        </div>
      </div>
    </article>
  `
  ).join('');

  const railButtons = Array.from(railEl.querySelectorAll<HTMLButtonElement>('.rail-item'));
  const cards = Array.from(platesEl.querySelectorAll<HTMLElement>('.plate-card'));

  const setActiveRail = (idx: number) => {
    railButtons.forEach((b, i) => b.classList.toggle('is-active', i === idx));
  };

  railButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target || '');
      if (!target) return;
      setActiveRail(idx);
      if (lenis) {
        lenis.scrollTo(target, { offset: -96 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Cursor-following reticle (desktop mouse)
  const reticle = document.querySelector<HTMLElement>('.cursor-reticle');
  const setX = reticle ? gsap.quickTo(reticle, 'x', { duration: 0.24, ease: 'power3.out' }) : null;
  const setY = reticle ? gsap.quickTo(reticle, 'y', { duration: 0.24, ease: 'power3.out' }) : null;

  if (reticle && setX && setY && !reducedMotion) {
    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        setX(e.clientX);
        setY(e.clientY);
      },
      { passive: true }
    );
  }

  cards.forEach((card, idx) => {
    const frame = card.querySelector<HTMLAnchorElement>('.plate-frame');
    const poster = card.querySelector<HTMLImageElement>('.plate-media--poster');
    const video = card.querySelector<HTMLVideoElement>('.plate-media--video');
    const toggleBtn = card.querySelector<HTMLButtonElement>('[data-preview-toggle]');

    const playVideo = () => {
      if (!video) return;
      if (!video.getAttribute('src') && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          card.classList.add('is-playing');
          if (toggleBtn) toggleBtn.textContent = 'Show Still';
        })
        .catch(() => {});
    };

    const stopVideo = () => {
      if (!video) return;
      video.pause();
      card.classList.remove('is-playing');
      if (toggleBtn) toggleBtn.textContent = 'Preview Motion';
    };

    frame?.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') {
        reticle?.classList.add('is-visible');
        if (!reducedMotion) playVideo();
      }
    });

    frame?.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') {
        reticle?.classList.remove('is-visible');
        stopVideo();
      }
    });

    toggleBtn?.addEventListener('click', () => {
      if (card.classList.contains('is-playing')) {
        stopVideo();
      } else {
        playVideo();
      }
    });

    // ScrollTrigger active rail sync + subtle inner lens parallax
    ScrollTrigger.create({
      trigger: card,
      start: 'top 52%',
      end: 'bottom 48%',
      onEnter: () => setActiveRail(idx),
      onEnterBack: () => setActiveRail(idx),
    });

    if (!reducedMotion && poster) {
      gsap.fromTo(
        poster,
        { scale: 1.08, yPercent: -3 },
        {
          scale: 1,
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }
  });
}

function initInstrument() {
  const shell = document.querySelector<HTMLElement>('#craft-instrument');
  if (!shell) return;

  const img = shell.querySelector<HTMLImageElement>('#inst-img');
  const loc = shell.querySelector<HTMLElement>('#inst-loc');
  const title = shell.querySelector<HTMLElement>('#inst-title');
  const note = shell.querySelector<HTMLElement>('#inst-note');
  const editorial = shell.querySelector<HTMLElement>('.instrument-editorial');
  const media = shell.querySelector<HTMLElement>('.instrument-media');

  let spaceIdx = 0;

  const updateCopy = () => {
    const sp = INSTRUMENT_SPACES[spaceIdx];
    const isDetail = shell.dataset.crop === 'detail';
    if (img && img.getAttribute('src') !== sp.src) {
      img.src = sp.src;
      img.alt = `${sp.title} interior elevation`;
    }
    if (loc) loc.textContent = sp.location;
    if (title) title.textContent = sp.title;
    if (note) note.textContent = isDetail ? sp.noteDetail : sp.noteWide;
  };

  const wireGroup = (
    attr: string,
    onChange: (val: string) => void
  ) => {
    const buttons = shell.querySelectorAll<HTMLButtonElement>(`[data-ctrl="${attr}"]`);
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val || '';
        buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
        onChange(val);
      });
    });
  };

  wireGroup('crop', (val) => {
    shell.dataset.crop = val;
    updateCopy();
  });

  wireGroup('layout', (val) => {
    if (shell.dataset.layout === val) return;
    if (!reducedMotion && editorial && media) {
      const state = Flip.getState([media, editorial]);
      shell.dataset.layout = val;
      Flip.from(state, {
        duration: 0.72,
        ease: 'power3.inOut',
        absolute: false,
      });
    } else {
      shell.dataset.layout = val;
    }
  });

  wireGroup('light', (val) => {
    shell.dataset.light = val;
  });

  wireGroup('space', (val) => {
    spaceIdx = Math.max(0, INSTRUMENT_SPACES.findIndex((s) => s.id === val));
    updateCopy();
  });

  updateCopy();
}

function initMethod() {
  const stepsContainer = document.querySelector<HTMLElement>('#method-steps');
  const visualFrame = document.querySelector<HTMLElement>('#method-visual-frame');
  const visualCap = document.querySelector<HTMLElement>('#method-visual-cap');
  const fill = document.querySelector<HTMLElement>('.method-track__fill');
  if (!stepsContainer || !visualFrame) return;

  stepsContainer.insertAdjacentHTML(
    'beforeend',
    VAMPED_PHASES.map(
      (p, i) => `
      <article class="method-step ${i === 0 ? 'is-active' : ''}" data-phase="${i}" tabindex="0">
        <div class="method-step__head">
          <span class="method-step__num">${p.num}</span>
          <h3 class="method-step__title">${p.name}</h3>
        </div>
        <p class="method-step__summary">${p.summary}</p>
        <p class="method-step__detail">${p.detail}</p>
      </article>
    `
    ).join('')
  );

  visualFrame.innerHTML = VAMPED_PHASES.map(
    (p, i) => `
    <img class="method-visual__img ${i === 0 ? 'is-active' : ''}" src="${p.image}" alt="${p.caption}" loading="lazy" />
  `
  ).join('');

  const steps = Array.from(stepsContainer.querySelectorAll<HTMLElement>('.method-step'));
  const imgs = Array.from(visualFrame.querySelectorAll<HTMLImageElement>('.method-visual__img'));

  const activate = (idx: number) => {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    imgs.forEach((im, i) => im.classList.toggle('is-active', i === idx));
    if (visualCap) visualCap.textContent = VAMPED_PHASES[idx].caption;
  };

  steps.forEach((step, idx) => {
    step.addEventListener('click', () => activate(idx));
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(idx);
      }
    });

    ScrollTrigger.create({
      trigger: step,
      start: 'top 56%',
      end: 'bottom 44%',
      onEnter: () => activate(idx),
      onEnterBack: () => activate(idx),
    });
  });

  if (fill && !reducedMotion) {
    gsap.fromTo(
      fill,
      { scaleY: 0.12 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stepsContainer,
          start: 'top 62%',
          end: 'bottom 58%',
          scrub: true,
        },
      }
    );
  }
}

function initStandardsAndFaq() {
  const stdGrid = document.querySelector<HTMLElement>('#standard-grid');
  if (stdGrid) {
    stdGrid.innerHTML = STANDARDS.map(
      (s) => `
      <article class="standard-cell">
        <span class="standard-cell__rule" aria-hidden="true"></span>
        <span class="standard-cell__num">${s.num}</span>
        <h3 class="standard-cell__title">${s.title}</h3>
        <p>${s.body}</p>
      </article>
    `
    ).join('');

    if (!reducedMotion) {
      gsap.from(stdGrid.querySelectorAll('.standard-cell__rule'), {
        scaleX: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stdGrid,
          start: 'top 78%',
          once: true,
        },
      });
    }
  }

  const faqList = document.querySelector<HTMLElement>('#faq-list');
  if (faqList) {
    faqList.innerHTML = FAQS.map(
      (f, i) => `
      <div class="faq-item">
        <button type="button" class="faq-trigger" aria-expanded="false" aria-controls="faq-panel-${i}">
          <span>${f.q}</span>
          <span class="faq-plus" aria-hidden="true"></span>
        </button>
        <div class="faq-panel" id="faq-panel-${i}">
          <p>${f.a}</p>
        </div>
      </div>
    `
    ).join('');

    const items = Array.from(faqList.querySelectorAll<HTMLElement>('.faq-item'));
    items.forEach((item) => {
      const btn = item.querySelector<HTMLButtonElement>('.faq-trigger');
      const panel = item.querySelector<HTMLElement>('.faq-panel');
      if (!btn || !panel) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // Close sibling open items for quiet discipline
        items.forEach((other) => {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
            const op = other.querySelector<HTMLElement>('.faq-panel');
            if (op) gsap.to(op, { height: 0, duration: 0.38, ease: 'power3.out' });
          }
        });

        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));

        if (!isOpen) {
          gsap.to(panel, {
            height: panel.scrollHeight,
            duration: reducedMotion ? 0 : 0.45,
            ease: 'power3.out',
            onComplete: () => {
              panel.style.height = 'auto';
              ScrollTrigger.refresh();
            },
          });
        } else {
          gsap.to(panel, {
            height: 0,
            duration: reducedMotion ? 0 : 0.35,
            ease: 'power3.out',
            onComplete: () => ScrollTrigger.refresh(),
          });
        }
      });
    });
  }
}

function initScrollReveals() {
  if (reducedMotion) return;
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((block) => {
    const lines = block.querySelectorAll<HTMLElement>('.reveal-line');
    const targets = lines.length ? lines : [block];
    gsap.from(targets, {
      yPercent: lines.length ? 110 : 0,
      y: lines.length ? 0 : 28,
      opacity: lines.length ? 1 : 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: block,
        start: 'top 84%',
        once: true,
      },
    });
  });
}

function initFooterLight() {
  const footer = document.querySelector<HTMLElement>('.site-footer');
  if (!footer || reducedMotion) return;

  let tx = 50;
  let ty = 56;
  let cx = tx;
  let cy = ty;
  let active = false;
  let rafId = 0;

  const tick = () => {
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    footer.style.setProperty('--fx', `${cx.toFixed(2)}%`);
    footer.style.setProperty('--fy', `${cy.toFixed(2)}%`);
    if (active || Math.abs(tx - cx) > 0.08 || Math.abs(ty - cy) > 0.08) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  };

  footer.addEventListener('pointerenter', () => {
    active = true;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  footer.addEventListener('pointerleave', () => {
    active = false;
    tx = 50;
    ty = 56;
  });

  footer.addEventListener(
    'pointermove',
    (e) => {
      const rect = footer.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      tx = ((e.clientX - rect.left) / rect.width) * 100;
      ty = ((e.clientY - rect.top) / rect.height) * 100;
      if (!rafId) rafId = requestAnimationFrame(tick);
    },
    { passive: true }
  );
}

function initCasePage() {
  const root = document.querySelector<HTMLElement>('[data-case-page]');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('work') || SHOWROOMS[0].id;
  const idx = Math.max(0, SHOWROOMS.findIndex((s) => s.id === slug));
  const project: ShowroomProject = SHOWROOMS[idx];
  const nextProject: ShowroomProject = SHOWROOMS[(idx + 1) % SHOWROOMS.length];

  document.title = `${project.name} — BEVAMPED Digital Showroom`;

  const setText = (sel: string, val: string) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) el.textContent = val;
  };

  const heroBg = document.querySelector<HTMLImageElement>('#case-hero-bg');
  if (heroBg) {
    heroBg.src = project.poster;
    heroBg.alt = `${project.name} opening elevation`;
  }

  setText('#case-eyebrow', `${project.index} / ${project.discipline}`);
  setText('#case-title', project.name);
  setText('#case-summary', project.summary);
  setText('#meta-discipline', project.discipline);
  setText('#meta-market', project.market);
  setText('#meta-timeline', project.timeline);
  setText('#meta-year', project.year);
  setText('#case-challenge-title', project.challengeTitle);
  setText('#case-challenge-body', project.challengeBody);
  setText('#case-solution-title', project.solutionTitle);
  setText('#case-solution-body', project.solutionBody);

  const videoEl = document.querySelector<HTMLVideoElement>('#case-video');
  if (videoEl) {
    const isNarrow = window.matchMedia('(max-width: 760px)').matches;
    videoEl.poster = project.poster;
    videoEl.src = isNarrow ? project.fullMobileVideo : project.fullDesktopVideo;
  }

  const spreadsEl = document.querySelector<HTMLElement>('#case-spreads');
  if (spreadsEl) {
    spreadsEl.innerHTML = project.spreads
      .map(
        (sp) => `
      <figure class="spread-figure" data-reveal>
        <img src="${sp.src}" alt="${project.name} — ${sp.label}" loading="lazy" />
        <figcaption>
          <strong>${sp.label}</strong>
          <span>${sp.caption}</span>
        </figcaption>
      </figure>
    `
      )
      .join('');
  }

  const pillarsEl = document.querySelector<HTMLElement>('#case-pillars');
  if (pillarsEl) {
    pillarsEl.innerHTML = project.outcomePoints
      .map(
        (p) => `
      <div class="case-pillar">
        <span class="case-pillar__val">${p.metric}</span>
        <span class="case-pillar__label">${p.label}</span>
      </div>
    `
      )
      .join('');
  }

  const nextBand = document.querySelector<HTMLAnchorElement>('#next-case-band');
  const nextBg = document.querySelector<HTMLImageElement>('#next-case-bg');
  if (nextBand) {
    nextBand.href = `/flagship/work.html?work=${nextProject.id}`;
    nextBand.setAttribute('data-route-label', nextProject.name.toUpperCase());
  }
  if (nextBg) {
    nextBg.src = nextProject.poster;
    nextBg.alt = `${nextProject.name} preview`;
  }
  setText('#next-case-name', nextProject.name);
  setText('#next-case-thesis', nextProject.thesis);
}

// Bootstrap
initCurtainNavigation();
initCasePage();
initHero();
initPerceptionGap();
initShowrooms();
initInstrument();
initMethod();
initStandardsAndFaq();
initSmoothScroll();
initHeaderTheme();
initScrollReveals();
initFooterLight();
