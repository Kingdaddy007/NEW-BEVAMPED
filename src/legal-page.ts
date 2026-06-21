import { gsap } from 'gsap';

// 1. Shutter Entrance Animation
function initShutterEntrance() {
  const tl = gsap.timeline();
  
  // Set initial door states
  gsap.set('.loader-door.top', { yPercent: 0 });
  gsap.set('.loader-door.bottom', { yPercent: 0 });
  gsap.set('.loader-logo-split', { opacity: 1, scale: 1 });
  
  // Animate: Doors open, logo fades out
  tl.to('.loader-logo-split', { opacity: 0, duration: 0.5, delay: 0.2 })
    .to('.loader-door.top', { yPercent: -100, duration: 1.2, ease: "power3.inOut" }, "-=0.3")
    .to('.loader-door.bottom', { yPercent: 100, duration: 1.2, ease: "power3.inOut" }, "<")
    .set('#loader-screen', { display: 'none' });
}

// 2. Shutter Exit & Page Transition Logic
function initPageTransitions() {
  const transitionLinks = document.querySelectorAll('.transition-link');
  const loaderScreen = document.getElementById('loader-screen');
  
  transitionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const targetUrl = target.getAttribute('href');
      
      if (!targetUrl) return;

      // Close menu if it's open
      const menuBtn = document.querySelector('.btn-menu');
      if (menuBtn && menuBtn.innerHTML.includes('CLOSE')) {
        menuBtn.dispatchEvent(new Event('click'));
      }

      // Show loader screen
      if (loaderScreen) {
        loaderScreen.style.display = 'flex';
      }

      // Set initial states for closing doors
      gsap.set('.loader-door.top', { yPercent: -100 });
      gsap.set('.loader-door.bottom', { yPercent: 100 });
      gsap.set('.loader-logo-split', { opacity: 0 });

      // Run closing doors animation
      const exitTl = gsap.timeline({
        onComplete: () => {
          // Navigate to target URL
          window.location.href = targetUrl;
        }
      });

      exitTl.to('.loader-door.top', { yPercent: 0, duration: 1.0, ease: "power3.inOut" })
        .to('.loader-door.bottom', { yPercent: 0, duration: 1.0, ease: "power3.inOut" }, "<")
        .to('.loader-logo-split', { opacity: 1, duration: 0.4 }, "-=0.3");
    });
  });
}

// 3. Lightweight Menu Overlay (Matches homepage menu logic)
function initMenuOverlay() {
  const menuBtn = document.querySelector('.btn-menu');
  const overlay = document.querySelector('.menu-overlay');
  const linksContainer = document.querySelector('.menu-col-links');
  const hoverIndicator = document.querySelector('.hover-indicator');

  if (!menuBtn || !overlay) return;

  const menuTl = gsap.timeline({ paused: true });
  let isMenuOpen = false;

  // Curtain Drop
  menuTl.to(overlay, {
    height: '100vh',
    duration: 0.8,
    ease: 'power3.inOut',
    onStart: () => {
      menuBtn.innerHTML = 'CLOSE <span class="equals-sign">X</span>';
      document.querySelector('.inquiry-nav')?.classList.add('menu-open');
    },
    onReverseComplete: () => {
      menuBtn.innerHTML = 'MENU <span class="equals-sign">=</span>';
      document.querySelector('.inquiry-nav')?.classList.remove('menu-open');
      isMenuOpen = false;
    }
  }, 0);

  // Logo Flip
  menuTl.to('.flipper', {
    rotationX: 180,
    duration: 0.8,
    ease: 'power3.inOut'
  }, 0);

  // Stagger Content
  menuTl.from('.menu-link, .menu-contact-group, .menu-status-group, .menu-img-wrapper', {
    y: 40,
    opacity: 0,
    stagger: 0.05,
    duration: 0.6,
    ease: 'power2.out'
  }, "-=0.3");

  menuBtn.addEventListener('click', () => {
    if (isMenuOpen) {
      menuTl.reverse();
    } else {
      isMenuOpen = true;
      menuTl.play();
    }
  });

  // Hover Indicator "Dancing Square" Logic
  if (linksContainer && hoverIndicator) {
    const indicator = hoverIndicator as HTMLElement;
    const links = document.querySelectorAll('.menu-link');
    
    const moveIndicator = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const targetTop = target.offsetTop;
      const targetHeight = target.offsetHeight;
      const indicatorHeight = indicator.offsetHeight;
      
      const yPos = targetTop + (targetHeight / 2) - (indicatorHeight / 2);
      
      gsap.to(indicator, {
        y: yPos,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
      });
    };

    linksContainer.addEventListener('mouseleave', () => {
      gsap.to(indicator, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    links.forEach(link => {
      link.addEventListener('mouseenter', moveIndicator);
    });
  }
}

// 4. Lightweight Scroll Effect for Dark Navbar
function initNavScroll() {
  const nav = document.querySelector('.inquiry-nav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

// Initialize Page Features
document.addEventListener('DOMContentLoaded', () => {
  initShutterEntrance();
  initPageTransitions();
  initMenuOverlay();
  initNavScroll();
});
