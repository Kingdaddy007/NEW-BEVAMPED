const unit = (n: number) => Math.max(0, Math.min(1, n));
function ease(from: number, to: number, value: number) {
  const t = unit((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

export function mountFirstImpression(chapter: HTMLElement, reduced: MediaQueryList) {
  const page = document.documentElement;
  const stage = chapter.querySelector<HTMLElement>('.optical-stage')!;
  const picture = chapter.querySelector<HTMLElement>('.optical-picture')!;
  const film = picture.querySelector('video')!;
  const note = chapter.querySelector<HTMLElement>('.second-note')!;
  const firstNote = chapter.querySelector<HTMLElement>('.first-note')!;
  const short = matchMedia('(max-height:535px)');
  let scheduled = 0;
  let wanted = 0;
  let inRange = true;
  let second = false;

  // Seek only when the preceding seek is complete. Fast trackpad input can
  // otherwise keep the decoder from ever presenting a settled frame.
  function presentFrame() {
    if (!inRange || reduced.matches || film.seeking || !Number.isFinite(film.duration)) return;
    const time = wanted * Math.max(0, film.duration - .06);
    if (Math.abs(time - film.currentTime) > .044) film.currentTime = time;
  }
  film.addEventListener('loadeddata', () => {
    film.classList.add('available');
    presentFrame();
  });
  film.addEventListener('seeked', presentFrame);
  film.addEventListener('error', () => film.classList.remove('available'));

  function finishIdent() { page.classList.remove('play-ident'); }
  window.setTimeout(finishIdent, 3450);
  window.addEventListener('pageshow', e => { if (e.persisted) finishIdent(); });
  document.addEventListener('focusin', finishIdent, { once:true });

  function draw() {
    scheduled = 0;
    if (scrollY > 12) finishIdent();
    if (!chapter.classList.contains('scripted')) return;
    const box = chapter.getBoundingClientRect();
    const p = unit(-box.top / Math.max(1, box.height - stage.offsetHeight));
    stage.style.setProperty('--progress', String(p));
    stage.style.setProperty('--open', String(ease(.01,.43,p)));
    stage.style.setProperty('--leaves', String(1 - ease(.33,.52,p)));
    stage.style.setProperty('--room', String(ease(.33,.52,p)));
    stage.style.setProperty('--first', String(1 - ease(.23,.44,p)));
    stage.style.setProperty('--second', String(ease(.44,.64,p)));
    if (second !== (p >= .44)) {
      second = p >= .44;
      note.setAttribute('aria-hidden', String(!second));
      firstNote.setAttribute('aria-hidden', String(second));
    }
    wanted = ease(.48,.94,p);
    if (p > .05 && inRange && !film.hasAttribute('src')) {
      film.preload = 'auto';
      film.src = film.dataset.src!;
      film.load();
    }
    presentFrame();
  }
  function schedule() {
    if (!scheduled) scheduled = requestAnimationFrame(draw);
  }
  function configure() {
    const active = !reduced.matches && !short.matches;
    chapter.classList.toggle('scripted', active);
    if (!active) {
      finishIdent();
      film.pause();
      stage.style.removeProperty('--look');
    }
    second = false;
    note.setAttribute('aria-hidden', String(active));
    firstNote.removeAttribute('aria-hidden');
    draw();
  }
  new IntersectionObserver(entries => {
    inRange = entries[0].isIntersecting;
    if (inRange) schedule();
  }).observe(chapter);
  window.addEventListener('scroll', () => { if (inRange) schedule(); }, { passive:true });
  window.addEventListener('resize', schedule);
  reduced.addEventListener('change', configure);
  short.addEventListener('change', configure);
  picture.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || reduced.matches) return;
    const box = picture.getBoundingClientRect();
    stage.style.setProperty('--look', String(2 * (e.clientX - box.left) / box.width - 1));
  });
  picture.addEventListener('pointerleave', () => stage.style.removeProperty('--look'));
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in-frame');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .12 });
  document.querySelectorAll('.approach-steps article,.instrument .composition,.commission,.colophon').forEach(el => reveal.observe(el));
  configure();
}
