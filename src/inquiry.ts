// src/inquiry.ts
import './utils/transition.min.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

declare global {
  interface Window {
    Cal: any;
  }
}

gsap.registerPlugin(ScrollTrigger);

// 1. Setup Smooth Scrolling (Lenis)
const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// 2. Initial Loader & Horizon Line Animation
function initLoader() {
  document.body.classList.add('loader-active'); // Lock animations until loader finishes

  const loaderScreen = document.getElementById('loader-screen');
  const heroHeadline = document.querySelector('.split-reveal-hero');
  
  // 1. Setup Hero Text Splitting for Spatial Light Reveal
  if (heroHeadline) {
    const text = heroHeadline.textContent || '';
    heroHeadline.innerHTML = '';
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      // Create masking container
      const maskSpan = document.createElement('span');
      maskSpan.style.display = 'inline-block';
      maskSpan.style.overflow = 'hidden';
      maskSpan.style.marginRight = wordIndex === words.length - 1 ? '0' : '0.25em';
      maskSpan.style.paddingBottom = '0.1em';
      maskSpan.style.marginBottom = '-0.1em';
      maskSpan.style.verticalAlign = 'top';

      // Create the word element
      const wordSpan = document.createElement('span');
      wordSpan.textContent = word;
      wordSpan.classList.add('hero-word');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.opacity = '0';
      wordSpan.style.transform = 'translateY(100%)';
      
      maskSpan.appendChild(wordSpan);
      heroHeadline.appendChild(maskSpan);
    });
  }

  if (!loaderScreen) return;

  const tl = gsap.timeline();

  // Action 1: Spotlight turns on slowly to illuminate the logo
  tl.to('.spotlight', { scale: 1, duration: 1.5, ease: "power2.out" });

  // Action 2: Hold the spotlight for a moment (simulating load)
  tl.to('.spotlight', { scale: 1.1, duration: 1.5, ease: "none" });

  // Action 3: Loading complete. Spotlight expands massively to wash the screen
  tl.to('.spotlight', {
    scale: 15, // Massive expansion
    opacity: 0.5,
    duration: 1.5,
    ease: "power3.inOut"
  });

  // Action 4: Logo fades out
  tl.to('.loader-content', {
    opacity: 0,
    y: -20,
    duration: 0.8,
    ease: "power2.in"
  }, "-=1.2");

  // Action 5: Entire black loader screen fades away, flooded by the spotlight
  tl.to(loaderScreen, {
    opacity: 0,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
      loaderScreen.style.display = 'none';
      document.body.classList.remove('loader-active');
      document.dispatchEvent(new Event('loaderComplete')); // Release all blocked ScrollTriggers
    }
  }, "-=1.0");

  // Action 6: Spatial Light Reveal for Hero text (Word by Word)
  tl.to('.hero-word', {
    y: '0%',
    opacity: 1,
    duration: 1.2,
    stagger: 0.15, // Meaningful, human-paced pause between words
    ease: 'power3.out'
  }, "-=0.8"); // Delayed so the spotlight wash completes first

  // Action 6: Fade in subtext and capabilities
  tl.fromTo('.hero-subtext, .hero-capabilities', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2 },
    "-=1.0"
  );
}

// 3. Navigation Scroll Effect
function initNavScroll() {
  const nav = document.querySelector('.inquiry-nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -50',
    end: 99999,
    toggleClass: { className: 'scrolled', targets: nav }
  });
}

// 4. Engagements Parallax Text
function initEngagementsParallax() {
  const section = document.querySelector('.engagements-section');
  const bgText = document.querySelector('.engagements-bg-text');
  
  if (!section || !bgText) return;

  gsap.to(bgText, {
    yPercent: 30, // Move down as we scroll down
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

// 4. The Brutalist Velocity Process
function initBrutalProcess() {
  const buildSection = document.querySelector('.build-section');
  const brutalSection = document.querySelector('.brutal-process-section');
  
  if (!buildSection || !brutalSection) return;

  // 1. The Curtain Reveal (Parallax)
  // Removed: Pushing buildSection down created an unnatural gap during the transition.
  // The sticky brutal rows will naturally slide over it perfectly.

  // 2. The Kinetic Velocity Skew
  const skewElements = document.querySelectorAll('.brutal-heading');
  if (skewElements.length === 0) return;

  // Create a proxy object to hold the current skew value
  let proxy = { skew: 0 };
  // Optimize setter for performance
  let skewSetter = gsap.quickSetter(skewElements, "skewY", "deg"); 
  let clamp = gsap.utils.clamp(-15, 15); // Prevent text from skewing too far

  ScrollTrigger.create({
    onUpdate: (self) => {
      // Get scroll velocity, scale it down
      let velocity = clamp(self.getVelocity() / -100);
      
      // Only apply animation if velocity is significant enough
      if (Math.abs(velocity) > Math.abs(proxy.skew)) {
        proxy.skew = velocity;
        
        // Animate the proxy value to the target velocity, then return to 0
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: "power3",
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew) 
        });
      }
    }
  });

  // Reset origin
  gsap.set(skewElements, { transformOrigin: "left center", force3D: true });
}



// 7. Timeline Section Text Reveal Animation
function initTimelineTextReveal() {
  const headline = document.querySelector('.split-reveal-timeline');
  if (!headline) return;

  const text = headline.textContent || '';
  headline.innerHTML = '';
  const words = text.split(' ');
  
  words.forEach((word, wordIndex) => {
    const maskSpan = document.createElement('span');
    maskSpan.style.display = 'inline-block';
    maskSpan.style.overflow = 'hidden';
    maskSpan.style.marginRight = wordIndex === words.length - 1 ? '0' : '0.25em';
    maskSpan.style.paddingBottom = '0.1em';
    maskSpan.style.marginBottom = '-0.1em';
    maskSpan.style.verticalAlign = 'top';

    const wordSpan = document.createElement('span');
    wordSpan.textContent = word;
    wordSpan.classList.add('timeline-word');
    
    maskSpan.appendChild(wordSpan);
    headline.appendChild(maskSpan);
  });

  gsap.to('.timeline-word', {
    y: '0%',
    opacity: 1,
    duration: 1.0,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.timeline-section',
      start: 'top 75%', // trigger slightly before it comes into full view
    }
  });
}
// 6. Focal Plane Typography Animation
function initFocalPlane() {
  const focalItems = document.querySelectorAll('.focal-item');
  if (focalItems.length === 0) return;

  focalItems.forEach(item => {
    // Initial state: blurred, tiny, faded, rotated
    gsap.set(item, {
      opacity: 0.15,
      filter: 'blur(10px)',
      scale: 0.85,
      rotationX: 25,
      transformOrigin: 'center center'
    });

    // Animate to full focus in the center of the screen
    gsap.to(item, {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      rotationX: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%', // start focusing when it enters the bottom 20%
        end: 'top 45%', // fully focused at center
        scrub: true,
      }
    });

    // Animate out of focus as it leaves the top of the screen
    gsap.to(item, {
      opacity: 0.15,
      filter: 'blur(10px)',
      scale: 0.85,
      rotationX: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top 45%', // start blurring when it leaves center
        end: 'top 10%', // fully blurred near top
        scrub: true,
      }
    });
  });
}

// 8. Process Section Text Reveal Animation
function initProcessTextReveal() {
  const headline = document.querySelector('.split-reveal-process');
  if (!headline) return;

  const text = headline.textContent || '';
  headline.innerHTML = '';
  const words = text.split(' ');
  
  words.forEach((word, wordIndex) => {
    const maskSpan = document.createElement('span');
    maskSpan.style.display = 'inline-block';
    maskSpan.style.overflow = 'hidden';
    maskSpan.style.marginRight = wordIndex === words.length - 1 ? '0' : '0.25em';
    maskSpan.style.paddingBottom = '0.1em';
    maskSpan.style.marginBottom = '-0.1em';
    maskSpan.style.verticalAlign = 'top';

    const wordSpan = document.createElement('span');
    wordSpan.className = 'process-word';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.transform = 'translateY(100%)';
    wordSpan.style.opacity = '0';
    wordSpan.style.willChange = 'transform, opacity';
    wordSpan.innerHTML = word; // Use innerHTML to preserve any potential HTML tags

    maskSpan.appendChild(wordSpan);
    headline.appendChild(maskSpan);
  });

  ScrollTrigger.create({
    trigger: headline,
    start: "top 85%",
    onEnter: () => {
      gsap.to('.process-word', {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.05
      });
    },
    once: true
  });
}

// 9. Foundation Section Text Reveal Animation
function initFoundationTextReveal() {
  const headline = document.querySelector('.split-reveal-foundation');
  if (!headline) return;

  const text = headline.textContent || '';
  headline.innerHTML = '';
  const words = text.split(' ');
  
  words.forEach((word, wordIndex) => {
    const maskSpan = document.createElement('span');
    maskSpan.style.display = 'inline-block';
    maskSpan.style.overflow = 'hidden';
    maskSpan.style.marginRight = wordIndex === words.length - 1 ? '0' : '0.25em';
    maskSpan.style.paddingBottom = '0.1em';
    maskSpan.style.marginBottom = '-0.1em';
    maskSpan.style.verticalAlign = 'top';

    const wordSpan = document.createElement('span');
    wordSpan.className = 'foundation-word';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.transform = 'translateY(100%)';
    wordSpan.style.opacity = '0';
    wordSpan.style.willChange = 'transform, opacity';
    wordSpan.innerHTML = word; 

    maskSpan.appendChild(wordSpan);
    headline.appendChild(maskSpan);
  });

  ScrollTrigger.create({
    trigger: headline,
    start: "top 85%",
    onEnter: () => {
      gsap.to('.foundation-word', {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.05
      });
    },
    once: true
  });
}

// 10. FAQ Animations: Text Reveal, Accordion, and Scramble Hover
function initFaqAnimations() {
  // 8a. Text Reveal
  const headline = document.querySelector('.split-reveal-faq');
  if (headline) {
    const text = headline.textContent || '';
    headline.innerHTML = '';
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
      const maskSpan = document.createElement('span');
      maskSpan.style.display = 'inline-block';
      maskSpan.style.overflow = 'hidden';
      maskSpan.style.marginRight = wordIndex === words.length - 1 ? '0' : '0.25em';
      maskSpan.style.paddingBottom = '0.1em';
      maskSpan.style.marginBottom = '-0.1em';
      maskSpan.style.verticalAlign = 'top';

      const wordSpan = document.createElement('span');
      wordSpan.textContent = word;
      wordSpan.classList.add('faq-word');
      
      maskSpan.appendChild(wordSpan);
      headline.appendChild(maskSpan);
    });

    gsap.to('.faq-word', {
      y: '0%',
      opacity: 1,
      duration: 1.0,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.faq-section',
        start: 'top 75%',
      }
    });
  }

  // 8b. Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        // Optional: close others
        // faqItems.forEach(other => { if(other !== item) other.classList.remove('is-open'); });
        item.classList.toggle('is-open');
      });
    }
  });

  // 8c. Scramble Text on Click (Goodfella Style)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const questions = document.querySelectorAll('.faq-question');
  
  questions.forEach(q => {
    // Store original text strictly from textContent to avoid re-scrambling HTML tags
    const originalText = q.textContent?.trim() || '';
    let interval: ReturnType<typeof setInterval>;

    q.addEventListener('click', () => {
      let iteration = 0;
      clearInterval(interval);
      
      interval = setInterval(() => {
        q.innerHTML = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            // Preserve spaces
            if (char === ' ') return ' ';
            // Scrambled characters get the gold color
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            return `<span style="color: var(--vamped-gold)">${randomChar}</span>`;
          })
          .join('');
        
        // Speed of the reveal (adjust step size for speed)
        iteration += 1.5; 
        if (iteration >= originalText.length) {
          clearInterval(interval);
          q.innerHTML = originalText;
        }
      }, 30); // Milliseconds per frame
    });
  });
}

// 9. Contact Section Animations
function initContactAnimations() {
  const headline = document.querySelector('.contact-title.split-reveal');
  if (headline) {
    const text = headline.textContent || '';
    headline.innerHTML = '';
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
      const maskSpan = document.createElement('span');
      maskSpan.style.display = 'inline-block';
      maskSpan.style.overflow = 'hidden';
      maskSpan.style.marginRight = wordIndex === words.length - 1 ? '0' : '0.25em';
      maskSpan.style.paddingBottom = '0.1em';
      maskSpan.style.marginBottom = '-0.1em';
      maskSpan.style.verticalAlign = 'top';

      const wordSpan = document.createElement('span');
      wordSpan.textContent = word;
      wordSpan.classList.add('contact-word');
      // Set initial state via CSS variable or inline style for GSAP to animate from
      wordSpan.style.display = 'inline-block';
      wordSpan.style.transform = 'translateY(110%)';
      wordSpan.style.opacity = '0';
      
      maskSpan.appendChild(wordSpan);
      headline.appendChild(maskSpan);
    });

    gsap.to('.contact-word', {
      y: '0%',
      opacity: 1,
      duration: 1.0,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.pre-footer-contact',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    });
  }
}

// 10. Footer Curtain Reveal / Parallax
function initFooterParallax() {
  // Select the inner grid and watermark to parallax them upwards as the footer enters
  gsap.from('.footer-grid, .footer-watermark', {
    yPercent: -40,
    scale: 0.95,
    ease: 'none',
    scrollTrigger: {
      trigger: '.negative-footer',
      start: 'top bottom', // when top of footer hits bottom of viewport
      end: 'bottom bottom', // when bottom of footer hits bottom of viewport
      scrub: true
    }
  });
}

// 11. CTA Parallax Reveal
function initCTAParallax() {
  let mm = gsap.matchMedia();

  // Desktop: Deep parallax
  mm.add("(min-width: 1024px)", () => {
    gsap.from('.contact-video-bg, .contact-content-overlay', {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.pre-footer-contact',
        start: 'top bottom',
        end: 'top top',
        scrub: true
      }
    });
  });

  // Mobile: Subtle parallax, preventing heavy top cutoff
  mm.add("(max-width: 1023px)", () => {
    gsap.from('.contact-video-bg, .contact-content-overlay', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.pre-footer-contact',
        start: 'top bottom',
        end: 'top top',
        scrub: true
      }
    });
  });
}

// 12. Menu Overlay Animation
function initMenuOverlay() {
  const menuBtn = document.querySelector('.btn-menu');
  const overlay = document.querySelector('.menu-overlay');
  const menuLinks = document.querySelectorAll('.menu-link, .btn-cta-main[data-scroll-to], .btn-cta-icon[data-scroll-to]');
  const linksContainer = document.querySelector('.menu-col-links');
  const hoverIndicator = document.querySelector('.hover-indicator');

  if (!menuBtn || !overlay) return;

  // Build the GSAP Timeline
  const menuTl = gsap.timeline({ paused: true });
  let isMenuOpen = false;

  // 1. Curtain Drop
  menuTl.to(overlay, {
    height: '100vh',
    duration: 0.8,
    ease: 'power3.inOut',
    onStart: () => {
      // Toggle button text and nav style
      menuBtn.innerHTML = 'CLOSE <span class="equals-sign">X</span>';
      document.querySelector('.inquiry-nav')?.classList.add('menu-open');
    },
    onReverseComplete: () => {
      menuBtn.innerHTML = 'MENU <span class="equals-sign">=</span>';
      document.querySelector('.inquiry-nav')?.classList.remove('menu-open');
      isMenuOpen = false;
    }
  }, 0);

  // 1b. Logo Flip
  menuTl.to('.flipper', {
    rotationX: 180,
    duration: 0.8,
    ease: 'power3.inOut'
  }, 0);

  // 2. Stagger Content
  menuTl.from('.menu-link, .menu-contact-group, .menu-status-group, .menu-img-wrapper', {
    y: 40,
    opacity: 0,
    stagger: 0.05,
    duration: 0.6,
    ease: 'power2.out'
  }, "-=0.3");

  // Open/Close Toggle Event
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
    
    // Animate to position
    const moveIndicator = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      // Calculate top offset relative to the container
      const targetTop = target.offsetTop;
      const targetHeight = target.offsetHeight;
      const indicatorHeight = indicator.offsetHeight;
      
      // Center the indicator vertically against the text
      const yPos = targetTop + (targetHeight / 2) - (indicatorHeight / 2);
      
      gsap.to(indicator, {
        y: yPos,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
      });
    };

    // Fade out when leaving the entire column
    linksContainer.addEventListener('mouseleave', () => {
      gsap.to(indicator, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // Attach listeners to each link
    links.forEach(link => {
      link.addEventListener('mouseenter', moveIndicator);
    });
  }

  // Link Click Events (Smooth Scroll + Close)
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = (link as HTMLElement).dataset.scrollTo;
      if (targetId) {
        // Reverse menu
        menuTl.reverse();
        // Wait for reverse to finish before scrolling
        setTimeout(() => {
          lenis.scrollTo(targetId, {
            offset: -100, // Account for top nav
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }, 500); // Wait half a second for the menu to start closing
      }
    });
  });

  // Start a Project Menu Button
  const btnInquireMenu = document.querySelector('.btn-inquire-menu');
  if (btnInquireMenu) {
    btnInquireMenu.addEventListener('click', () => {
      menuTl.reverse();
      // Wait for reverse to finish before opening modal
      setTimeout(() => {
        const mainCta = document.querySelector('.btn-cta-main') as HTMLElement;
        if (mainCta) mainCta.click();
      }, 500);
    });
  }
}

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavScroll();
  initEngagementsParallax();
  initBrutalProcess();
  initFocalPlane();
  initMenuOverlay();
  initQualificationModal();
  
  // Event listener for loader completion
  document.addEventListener('loaderComplete', () => {
    initTimelineTextReveal();
    initProcessTextReveal();
    initFoundationTextReveal();
    initFaqAnimations();
    initContactAnimations();
    initCTAParallax();
    initFooterParallax();
  });
});

// 13. Qualification Modal Logic
function initQualificationModal() {
  const modalOverlay = document.getElementById('qual-modal-overlay');
  const modalContainer = document.querySelector('.qual-modal-container');
  const btnClose = document.querySelector('.btn-qual-close');
  // Only grab CTA buttons OUTSIDE the modal — nav, engagement cards, pre-footer
  const triggerBtns = document.querySelectorAll(
    '.inquiry-nav .btn-cta-main, .inquiry-nav .btn-cta-icon,' +
    '.engage-card .btn-cta-main, .engage-card .btn-cta-icon,' +
    '.contact-cta-wrapper .btn-cta-main, .contact-cta-wrapper .btn-cta-icon'
  );
  
  const steps = document.querySelectorAll('.qual-step');
  const options = document.querySelectorAll('.btn-qual-option');
  
  if (!modalOverlay || !modalContainer) return;

  let currentStep = 1;
  const formData = {
    scope: '',
    timeline: '',
    challenge: ''
  };

  // Open Modal
  const openModal = () => {
    // Reset to step 1
    currentStep = 1;
    modalContainer.classList.remove('is-cal-step');
    updateSteps();
    
    // Add Cal.com script if not already present
    if (!window.Cal) {
      (function (C: any, A: string, L: string) {
        let p = function (a: any, ar: any) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; 
      })(window, "https://app.cal.com/embed/embed.js", "init");
      window.Cal("init", {origin:"https://app.cal.com"});
    }
    
    modalOverlay.classList.add('is-active');
    gsap.fromTo(modalContainer, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
  };

  // Close Modal
  const closeModal = () => {
    gsap.to(modalContainer, { 
      y: 40, opacity: 0, duration: 0.4, ease: 'power3.in',
      onComplete: () => {
        modalOverlay.classList.remove('is-active');
      }
    });
  };

  triggerBtns.forEach(btn => btn.addEventListener('click', (e) => {
    // Prevent default if it's inside a link
    e.preventDefault();
    openModal();
  }));
  
  btnClose?.addEventListener('click', closeModal);

  const updateSteps = () => {
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      if (stepNum === currentStep) {
        step.classList.add('active');
        gsap.fromTo(step, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 });
      } else {
        step.classList.remove('active');
        // Reset transform
        gsap.set(step, { x: 20, opacity: 0 });
      }
    });
  };

  options.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const value = target.dataset.value;
      
      if (currentStep === 1) formData.scope = value || '';
      else if (currentStep === 2) formData.timeline = value || '';
      else if (currentStep === 3) formData.challenge = value || '';

      if (currentStep < 3) {
        currentStep++;
        updateSteps();
      } else {
        // Form Complete -> Load Cal.com
        currentStep = 4;
        modalContainer.classList.add('is-cal-step');
        updateSteps();
        loadCalCom();
      }
    });
  });

  const loadCalCom = () => {
    const calLoadingText = document.getElementById('cal-loading-text');
    
    // Check if Cal is loaded
    const checkCal = setInterval(() => {
      if (window.Cal) {
        clearInterval(checkCal);
        if (calLoadingText) calLoadingText.style.display = 'none';
        
        // Construct notes
        const notes = `Scope: ${formData.scope}\nTimeline: ${formData.timeline}\nChallenge: ${formData.challenge}`;
        
        window.Cal("inline", {
          elementOrSelector: "#my-cal-inline",
          calLink: "godswill-beloved-gjve7v/30min",
          layout: "month_view",
          config: {
            name: "",
            email: "",
            notes: notes,
            theme: "dark"
          }
        });
        window.Cal("ui", {"styles":{"branding":{"brandColor":"#D4AF37"}},"hideEventTypeDetails":false,"layout":"month_view"});
      }
    }, 100);
  };
}

