// The poster is the film's last frame. A finished projection can become a print
// at any scroll speed, including when the visitor reverses the transition.
function projectFilm(link: HTMLAnchorElement, stage: HTMLElement, reduced: MediaQueryList) {
  const film = link.querySelector('video')!;
  const sample = document.createElement('canvas');
  sample.width = 4;
  sample.height = 3;
  const context = sample.getContext('2d', { willReadFrequently: true });
  let visible = false;
  let finished = false;
  let previousSample = -1;
  let launch = 0;

  function spill() {
    if (!context || !film.videoWidth || Math.abs(film.currentTime - previousSample) < .18) return;
    previousSample = film.currentTime;
    context.drawImage(film, 0, 0, sample.width, sample.height);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
    const rgb = [0, 0, 0];
    for (let i = 0; i < pixels.length; i += 4) {
      for (let c = 0; c < 3; c++) rgb[c] += pixels[i + c];
    }
    stage.style.setProperty('--spill-' + link.dataset.study, rgb.map(v => Math.round(v / 12)).join(' '));
  }

  function start(replay = false) {
    window.clearTimeout(launch);
    if (!visible || document.hidden || reduced.matches || stage.classList.contains('transferring')) return;
    if (finished && !replay) return;
    if (!film.hasAttribute('src')) film.src = film.dataset.src!;
    if (finished) film.currentTime = 0;
    finished = false;
    film.play().catch(() => film.classList.remove('running'));
  }

  function pause() {
    window.clearTimeout(launch);
    film.pause();
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].intersectionRatio >= .52;
    if (visible) {
      const delay = link.dataset.study === 'studio-bespoke' ? 0 : 270;
      launch = window.setTimeout(start, delay);
    } else pause();
  }, { threshold: [0, .52] });
  observer.observe(link);
  film.addEventListener('playing', () => film.classList.add('running'));
  film.addEventListener('ended', () => {
    finished = true;
    film.classList.remove('running');
  });
  film.addEventListener('error', () => film.classList.remove('running'));
  film.addEventListener('timeupdate', spill);
  link.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') start(true); });
  link.addEventListener('focus', () => { if (link.matches(':focus-visible')) start(true); });
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : start());
  reduced.addEventListener('change', () => {
    if (reduced.matches) { pause(); film.classList.remove('running'); }
    else start();
  });
  stage.addEventListener('leave-projections', () => {
    pause();
    if (film.currentTime > 0) finished = true;
  });
  stage.addEventListener('restore-projections', () => {
    film.classList.remove('running');
    if (!finished) start();
  });
}

function joinExhibition(stage: HTMLElement, reduced: MediaQueryList) {
  const lead = stage.querySelector<HTMLAnchorElement>('[data-study=studio-bespoke]')!;
  const slot = lead.querySelector<HTMLElement>('.projection-slot')!;
  const surface = slot.querySelector<HTMLElement>('.projection-surface')!;
  const wall = stage.querySelector<HTMLElement>('.projection-wall')!;
  const exhibition = document.querySelector<HTMLElement>('.exhibition')!;
  const desktopPrint = exhibition.querySelector<HTMLElement>('.sheet .website-print')!;
  const mobilePrint = exhibition.querySelector<HTMLElement>('.mobile-cover .website-print')!;
  const flight = document.createElement('a');
  flight.className = 'projection-flight';
  flight.href = lead.href;
  flight.tabIndex = -1;
  flight.setAttribute('aria-label', 'Explore Studio Bespoke');
  flight.hidden = true;
  document.body.append(flight);

  let frame = 0;
  let state = 'home';
  function settle(next: 'home' | 'flight' | 'gallery') {
    if (state === next) return;
    if (state === 'home') stage.dispatchEvent(new Event('leave-projections'));
    if (next === 'flight') {
      flight.append(surface);
      flight.hidden = false;
    } else {
      // At the destination the original gallery print has the identical pixels.
      // Leave its native project link, hover film and curved wipe in charge.
      flight.hidden = true;
      slot.append(surface);
    }
    stage.classList.toggle('transferring', next !== 'home');
    desktopPrint.classList.toggle('receiving', next === 'flight');
    mobilePrint.classList.toggle('receiving', next === 'flight');
    exhibition.classList.toggle('receiving-projection', next === 'flight');
    if (next === 'home') stage.dispatchEvent(new Event('restore-projections'));
    state = next;
  }

  function draw() {
    frame = 0;
    if (reduced.matches || wall.scrollLeft > slot.offsetWidth * .35) {
      settle('home');
      return;
    }
    const pinned = exhibition.classList.contains('pinned');
    const target = pinned ? desktopPrint : mobilePrint;
    const from = slot.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const start = Math.max(0, scrollY + from.top + from.height * .5 - innerHeight * .56);
    // The exhibition's own top remains in document flow even after the easel pins.
    const end = pinned ? scrollY + exhibition.getBoundingClientRect().top - innerHeight * .20 :
      scrollY + to.top - innerHeight * .28;
    const progress = Math.min(1, Math.max(0, (scrollY - start) / Math.max(1, end - start)));
    stage.style.setProperty('--retreat', String(Math.min(1, progress * 1.6)));
    if (progress <= 0 || progress >= 1) {
      settle(progress <= 0 ? 'home' : 'gallery');
      return;
    }
    settle('flight');
    const t = progress * progress * (3 - 2 * progress);
    flight.style.setProperty('--film-opacity', String(1 - t));
    exhibition.style.setProperty('--mount-opacity', String(Math.max(0, (progress - .7) / .3)));
    const mix = (a: number, b: number) => a + (b - a) * t;
    flight.style.transform = 'translate3d(' + mix(from.left, to.left) + 'px,' + mix(from.top, to.top) + 'px,0)';
    flight.style.width = mix(from.width, to.width) + 'px';
    flight.style.height = mix(from.height, to.height) + 'px';
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  wall.addEventListener('scroll', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  const resize = new ResizeObserver(schedule);
  resize.observe(stage);
  resize.observe(exhibition);
  document.fonts.ready.then(schedule);
  draw();
}

export function mountProjectionStudio(stage: HTMLElement, reduced: MediaQueryList) {
  if (!location.hash && scrollY < 5 && !reduced.matches) {
    stage.classList.add('entering');
    window.setTimeout(() => stage.classList.remove('entering'), 1750);
  }
  stage.querySelectorAll<HTMLAnchorElement>('.projection').forEach(link => projectFilm(link, stage, reduced));
  joinExhibition(stage, reduced);
}
