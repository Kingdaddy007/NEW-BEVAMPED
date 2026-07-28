import './more-than-a-gallery.css';

const film = document.querySelector<HTMLVideoElement>('[data-film]');
const filmStage = document.querySelector<HTMLElement>('[data-film-stage]');
const primaryPlayButton = document.querySelector<HTMLButtonElement>('[data-play]');
const playLabel = document.querySelector<HTMLElement>('[data-play-label]');
const togglePlayButton = document.querySelector<HTMLButtonElement>('[data-toggle-play]');
const replayButton = document.querySelector<HTMLButtonElement>('[data-replay]');
const progressBar = document.querySelector<HTMLElement>('[data-progress]');
const filmStatus = document.querySelector<HTMLElement>('[data-film-status]');

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrowViewportQuery = window.matchMedia('(max-width: 767px)');
const networkInformation = (
  navigator as Navigator & {
    connection?: { saveData?: boolean };
  }
).connection;

const prefersReducedMotion = reducedMotionQuery.matches;
const shouldUseMobileFilm = narrowViewportQuery.matches || networkInformation?.saveData === true;

let filmSourceLoaded = false;
let autoplayAttempted = false;
let playbackStarted = false;
let mediaLoadFailed = false;

function updateFilmControls(): void {
  if (!film || !playLabel || !togglePlayButton || !primaryPlayButton) return;

  const isPlaying = !film.paused && !film.ended;
  const label = isPlaying ? 'Pause film' : film.ended ? 'Replay film' : 'Play film';

  playLabel.textContent = label;
  togglePlayButton.textContent = isPlaying ? 'Pause' : film.ended ? 'Replay' : 'Play';
  primaryPlayButton.setAttribute('aria-label', label);
  filmStage?.classList.toggle('is-playing', isPlaying);
}

function updateFilmProgress(): void {
  if (!film || !progressBar || !Number.isFinite(film.duration) || film.duration <= 0) return;
  const progress = Math.min(100, Math.max(0, (film.currentTime / film.duration) * 100));
  progressBar.style.width = `${progress}%`;
}

function loadFilmSource(): void {
  if (!film || filmSourceLoaded) return;

  film.src = shouldUseMobileFilm
    ? '/more-than-a-gallery/bevamped-demonstration-mobile.mp4'
    : '/more-than-a-gallery/bevamped-demonstration-desktop.mp4';
  film.load();
  filmSourceLoaded = true;
}

async function playFilm({ restart = false }: { restart?: boolean } = {}): Promise<void> {
  if (!film) return;

  loadFilmSource();
  if (restart || film.ended) film.currentTime = 0;

  try {
    await film.play();
    playbackStarted = true;
    if (filmStatus) filmStatus.textContent = 'Film playing';
  } catch {
    if (filmStatus && !mediaLoadFailed) filmStatus.textContent = 'Press play to begin the film';
  }

  updateFilmControls();
}

function pauseFilm(): void {
  if (!film || film.paused) return;
  film.pause();
  if (filmStatus) filmStatus.textContent = 'Film paused';
  updateFilmControls();
}

function handlePrimaryPlay(): void {
  if (!film) return;
  if (film.paused || film.ended) {
    void playFilm({ restart: film.ended });
  } else {
    pauseFilm();
  }
}

function revealPage(): void {
  if (prefersReducedMotion) {
    document.documentElement.classList.add('is-reduced-motion', 'is-ready');
    return;
  }

  requestAnimationFrame(() => {
    document.documentElement.classList.add('is-ready');
  });
}

function observeFilmStage(): void {
  if (!filmStage || !film) return;

  const preloadObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      loadFilmSource();
      filmStage.classList.add('is-revealed');
      observer.disconnect();
    },
    { rootMargin: '300px 0px' },
  );

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!prefersReducedMotion && !autoplayAttempted) {
          autoplayAttempted = true;
          void playFilm();
        }
        return;
      }

      if (playbackStarted) pauseFilm();
    },
    { threshold: 0.05 },
  );

  preloadObserver.observe(filmStage);
  visibilityObserver.observe(filmStage);
}

primaryPlayButton?.addEventListener('click', handlePrimaryPlay);
togglePlayButton?.addEventListener('click', handlePrimaryPlay);
replayButton?.addEventListener('click', () => void playFilm({ restart: true }));

film?.addEventListener('play', updateFilmControls);
film?.addEventListener('pause', updateFilmControls);
film?.addEventListener('ended', () => {
  if (filmStatus) filmStatus.textContent = 'Film complete';
  updateFilmControls();
  updateFilmProgress();
});
film?.addEventListener('timeupdate', updateFilmProgress);
film?.addEventListener('loadedmetadata', updateFilmProgress);
film?.addEventListener('error', () => {
  mediaLoadFailed = true;
  filmStage?.classList.add('has-media-error');
  if (filmStatus) {
    filmStatus.textContent = 'The film could not be loaded. The poster remains available.';
  }
});

revealPage();
observeFilmStage();
updateFilmControls();
