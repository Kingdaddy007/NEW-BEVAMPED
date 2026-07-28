import './more-than-a-gallery.css';

type ProjectId = 'studio-bespoke' | 'laterite' | 'xbd-collective';

type NetworkInformation = {
  saveData?: boolean;
};

interface ProjectConfig {
  id: ProjectId;
  number: string;
  name: string;
  desktopSource: string;
  mobileSource: string;
  poster: string;
  caption: string;
}

const projects: Record<ProjectId, ProjectConfig> = {
  'studio-bespoke': {
    id: 'studio-bespoke',
    number: '01',
    name: 'Studio Bespoke',
    desktopSource: '/more-than-a-gallery/projects/studio-bespoke-desktop.mp4',
    mobileSource: '/more-than-a-gallery/projects/studio-bespoke-mobile.mp4',
    poster: '/more-than-a-gallery/projects/studio-bespoke-poster.webp',
    caption: 'Website concept recording — Studio Bespoke',
  },
  laterite: {
    id: 'laterite',
    number: '02',
    name: 'Laterite',
    desktopSource: '/more-than-a-gallery/projects/laterite-desktop.mp4',
    mobileSource: '/more-than-a-gallery/projects/laterite-mobile.mp4',
    poster: '/more-than-a-gallery/projects/laterite-poster.webp',
    caption: 'Website concept recording — Laterite',
  },
  'xbd-collective': {
    id: 'xbd-collective',
    number: '03',
    name: 'XBD Collective',
    desktopSource: '/more-than-a-gallery/projects/xbd-collective-desktop.mp4',
    mobileSource: '/more-than-a-gallery/projects/xbd-collective-mobile.mp4',
    poster: '/more-than-a-gallery/projects/xbd-collective-poster.webp',
    caption: 'Website concept recording — XBD Collective',
  },
};

const screeningSection = document.querySelector<HTMLElement>('[data-screening-section]');
const screeningShell = document.querySelector<HTMLElement>('[data-screening-shell]');
const projectStage = document.querySelector<HTMLElement>('[data-project-stage]');
const videoFrame = document.querySelector<HTMLElement>('[data-video-frame]');
const video = document.querySelector<HTMLVideoElement>('[data-project-video]');
const stagePoster = document.querySelector<HTMLElement>('[data-stage-poster]');
const projectButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-project]'),
);
const closeProjectButton = document.querySelector<HTMLButtonElement>('[data-close-project]');
const primaryPlayButton = document.querySelector<HTMLButtonElement>('[data-primary-play]');
const primaryPlayLabel = document.querySelector<HTMLElement>('[data-primary-play-label]');
const togglePlayButton = document.querySelector<HTMLButtonElement>('[data-toggle-play]');
const replayButton = document.querySelector<HTMLButtonElement>('[data-replay]');
const progressBar = document.querySelector<HTMLElement>('[data-progress]');
const elapsedTime = document.querySelector<HTMLTimeElement>('[data-elapsed]');
const projectStatus = document.querySelector<HTMLElement>('[data-project-status]');
const projectNumber = document.querySelector<HTMLElement>('[data-project-number]');
const projectName = document.querySelector<HTMLElement>('[data-project-name]');
const projectCaption = document.querySelector<HTMLElement>('[data-project-caption]');
const approachSection = document.querySelector<HTMLElement>('.approach-section');
const attentionStatement = document.querySelector<HTMLElement>('[data-attention]');
const principleSections = document.querySelectorAll<HTMLElement>('[data-principle]');
const contactThreshold = document.querySelector<HTMLElement>('.contact-threshold');

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrowViewportQuery = window.matchMedia('(max-width: 767px)');
const networkInformation = (
  navigator as Navigator & {
    connection?: NetworkInformation;
  }
).connection;

const prefersReducedMotion = reducedMotionQuery.matches;
const shouldUseMobileSource =
  narrowViewportQuery.matches || networkInformation?.saveData === true;

let selectedProjectId: ProjectId | null = null;
let loadedProjectId: ProjectId | null = null;
let mediaLoadFailed = false;

function isProjectId(value: string | undefined): value is ProjectId {
  return value === 'studio-bespoke' || value === 'laterite' || value === 'xbd-collective';
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

function selectedProject(): ProjectConfig | null {
  return selectedProjectId ? projects[selectedProjectId] : null;
}

function updateProjectControls(): void {
  if (!video || !primaryPlayButton || !primaryPlayLabel || !togglePlayButton) return;

  const isPlaying = !video.paused && !video.ended;
  const isReplay = video.ended;
  const label = isPlaying ? 'Pause recording' : isReplay ? 'Replay recording' : 'Play recording';

  videoFrame?.classList.toggle('is-playing', isPlaying);
  primaryPlayButton.setAttribute('aria-label', label);
  primaryPlayLabel.textContent = isPlaying ? 'Playing' : isReplay ? 'Replay recording' : 'Play recording';
  togglePlayButton.textContent = isPlaying ? 'Pause recording' : isReplay ? 'Replay recording' : 'Play recording';
}

function updateProgress(): void {
  if (!video || !progressBar || !elapsedTime) return;

  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const progress = duration > 0 ? Math.min(100, (video.currentTime / duration) * 100) : 0;

  progressBar.style.width = `${progress}%`;
  elapsedTime.textContent = formatTime(video.currentTime);
  elapsedTime.dateTime = `PT${Math.floor(video.currentTime)}S`;
}

function unloadVideo(): void {
  if (!video) return;

  video.pause();
  video.removeAttribute('src');
  video.load();
  loadedProjectId = null;
  mediaLoadFailed = false;
  videoFrame?.classList.remove('is-playing', 'has-loaded-media', 'has-media-error');
  updateProgress();
  updateProjectControls();
}

function loadSelectedVideo(): void {
  const project = selectedProject();
  if (!project || !video || loadedProjectId === project.id) return;

  video.pause();
  videoFrame?.classList.remove('is-playing', 'has-loaded-media', 'has-media-error');
  mediaLoadFailed = false;
  video.poster = project.poster;
  video.src = shouldUseMobileSource ? project.mobileSource : project.desktopSource;
  video.load();
  loadedProjectId = project.id;

  if (projectStatus) projectStatus.textContent = `${project.name} is ready to play`;
  updateProgress();
  updateProjectControls();
}

async function playSelectedVideo({ restart = false }: { restart?: boolean } = {}): Promise<void> {
  if (!video || !selectedProjectId) return;

  loadSelectedVideo();

  if (restart || video.ended) {
    video.currentTime = 0;
    updateProgress();
  }

  try {
    await video.play();
    if (projectStatus) projectStatus.textContent = `${selectedProject()?.name ?? 'Recording'} playing`;
  } catch {
    if (projectStatus && !mediaLoadFailed) {
      projectStatus.textContent = 'Playback needs a deliberate press of the play control';
    }
  }

  updateProjectControls();
}

function pauseSelectedVideo(): void {
  if (!video || video.paused) return;

  video.pause();
  if (projectStatus) projectStatus.textContent = `${selectedProject()?.name ?? 'Recording'} paused`;
  updateProjectControls();
}

function togglePlayback(): void {
  if (!video || !selectedProjectId) return;

  if (video.paused || video.ended) {
    void playSelectedVideo({ restart: video.ended });
  } else {
    pauseSelectedVideo();
  }
}

function selectProject(projectId: ProjectId): void {
  const project = projects[projectId];
  const isNewProject = selectedProjectId !== projectId;

  if (isNewProject) {
    unloadVideo();
  }

  selectedProjectId = projectId;

  projectButtons.forEach((button) => {
    const isSelected = button.dataset.project === projectId;
    button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  screeningShell?.classList.add('is-project-open');
  projectStage?.setAttribute('aria-hidden', 'false');

  if (projectNumber) projectNumber.textContent = project.number;
  if (projectName) projectName.textContent = project.name;
  if (projectCaption) projectCaption.textContent = project.caption;
  if (stagePoster) stagePoster.style.backgroundImage = `url("${project.poster}")`;

  loadSelectedVideo();

  if (isNewProject) {
    projectStage?.scrollIntoView({
      block: narrowViewportQuery.matches ? 'start' : 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }
}

function closeProject(): void {
  unloadVideo();
  selectedProjectId = null;
  screeningShell?.classList.remove('is-project-open');
  projectStage?.setAttribute('aria-hidden', 'true');
  projectButtons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
  if (projectStatus) projectStatus.textContent = 'Choose a concept to begin';
  projectButtons[0]?.focus({ preventScroll: true });
}

function revealPage(): void {
  if (prefersReducedMotion) {
    document.documentElement.classList.add('is-reduced-motion', 'is-ready');
    return;
  }

  requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
}

function observePageChapters(): void {
  if (prefersReducedMotion) {
    screeningSection?.classList.add('is-revealed');
    approachSection?.classList.add('is-threshold-visible');
    attentionStatement?.classList.add('is-focused');
    principleSections.forEach((section) => section.classList.add('is-visible'));
    contactThreshold?.classList.add('is-visible');
    return;
  }

  const revealOnce = (
    target: Element | null,
    className: string,
    options: IntersectionObserverInit,
  ): void => {
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      entry.target.classList.add(className);
      observer.disconnect();
    }, options);

    observer.observe(target);
  };

  revealOnce(screeningSection, 'is-revealed', { threshold: 0.12 });
  revealOnce(approachSection, 'is-threshold-visible', { threshold: 0.04 });
  revealOnce(attentionStatement, 'is-focused', { threshold: 0.42 });
  principleSections.forEach((section) => {
    revealOnce(section, 'is-visible', { threshold: narrowViewportQuery.matches ? 0.16 : 0.28 });
  });
  revealOnce(contactThreshold, 'is-visible', { threshold: 0.18 });
}

function pauseVideoWhenOffscreen(): void {
  if (!projectStage || !video) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting && !video.paused) {
        pauseSelectedVideo();
      }
    },
    { threshold: 0.22 },
  );

  observer.observe(projectStage);
}

projectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const projectId = button.dataset.project;
    if (isProjectId(projectId)) selectProject(projectId);
  });
});

closeProjectButton?.addEventListener('click', closeProject);
primaryPlayButton?.addEventListener('click', togglePlayback);
togglePlayButton?.addEventListener('click', togglePlayback);
replayButton?.addEventListener('click', () => void playSelectedVideo({ restart: true }));

video?.addEventListener('play', updateProjectControls);
video?.addEventListener('pause', updateProjectControls);
video?.addEventListener('timeupdate', updateProgress);
video?.addEventListener('loadedmetadata', updateProgress);
video?.addEventListener('loadeddata', () => {
  videoFrame?.classList.add('has-loaded-media');
  if (projectStatus) projectStatus.textContent = `${selectedProject()?.name ?? 'Recording'} ready`;
});
video?.addEventListener('ended', () => {
  if (projectStatus) projectStatus.textContent = `${selectedProject()?.name ?? 'Recording'} complete`;
  updateProgress();
  updateProjectControls();
});
video?.addEventListener('error', () => {
  if (!loadedProjectId) return;

  mediaLoadFailed = true;
  videoFrame?.classList.add('has-media-error');
  if (projectStatus) {
    projectStatus.textContent = 'This recording could not be loaded. Its poster remains available.';
  }
  updateProjectControls();
});

revealPage();
observePageChapters();
pauseVideoWhenOffscreen();
updateProjectControls();
updateProgress();
