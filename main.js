/* ============================================================
   FUSSNER SENIORENBETREUUNG – Main JavaScript (2026)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initCounters();
  initModals();
  initContactForm();
  initSuccessPopup();
  initHeroParallax();
  initActiveNavHighlight();
  initServiceCardHighlight();
});

/* — Scroll Reveal (IntersectionObserver) — */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* — Sticky Header with Blur — */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* — Mobile Menu (Drawer) — */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const backdrop = document.getElementById('nav-backdrop');

  function openMenu() {
    nav.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('visible');
  }

  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('visible');
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  // Close when clicking backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* — Smooth Scroll for Anchor Links — */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const position = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });
}

/* — Animated Counters — */
function initCounters() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (prefersReducedMotion) {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || '';
      counter.textContent = target + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* — Hero Parallax — */
function initHeroParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Add in-view class immediately
  hero.classList.add('in-view');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroH = hero.offsetHeight;
    if (scrolled < heroH) {
      const heroImg = hero.querySelector('.hero-bg img');
      if (heroImg) {
        heroImg.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
      }
    }
  }, { passive: true });
}

/* — Active Nav Highlight on Scroll — */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

/* — Modals (Impressum / Datenschutz) — */
function initModals() {
  const modals = {
    'open-impressum': 'impressum-modal',
    'open-datenschutz': 'datenschutz-modal'
  };

  Object.entries(modals).forEach(([triggerId, modalId]) => {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('.modal-close');

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
}

/* — Contact Form — Pre-flight validation (Formspree AJAX SDK handles submission) — */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // The @formspree/ajax CDN script (loaded after main.js) takes over form
  // submission, field-level errors (data-fs-error), aria-invalid on fields
  // (data-fs-field), the success message (data-fs-success), and button
  // state (data-fs-submit-btn).
  //
  // This function only adds client-side pre-flight highlighting so users
  // get instant feedback before the request leaves the browser.

  const requiredFields = ['vorname', 'nachname', 'email', 'nachricht'];

  function markField(field, hasError) {
    field.style.borderColor = hasError ? 'var(--color-error, #e53e3e)' : '';
    field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function validateAll() {
    let valid = true;

    requiredFields.forEach(name => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      const empty = !field.value.trim();
      markField(field, empty);
      if (empty) valid = false;
    });

    // Extra: email format check
    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      markField(emailField, true);
      valid = false;
    }

    return valid;
  }

  // Clear individual field error on input
  form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
    field.addEventListener('input', () => {
      markField(field, false);
    });
  });

  // Pre-validate before Formspree's own submit handler runs
  form.addEventListener('submit', (e) => {
    if (!validateAll()) {
      e.preventDefault();
      e.stopImmediatePropagation(); // prevent Formspree from submitting too
      form.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, { capture: true }); // capture: true so we run before the SDK listener
}

/* — Service Card Highlight on Scroll (Mobile) — */
function initServiceCardHighlight() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  // Only activate on mobile viewports
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function clearActive() {
    cards.forEach(c => c.classList.remove('card-active'));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!isMobile()) { clearActive(); return; }

      // Find the entry with the highest intersection ratio
      let best = null;
      entries.forEach(entry => {
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      });

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          entry.target.classList.add('card-active');
        } else {
          entry.target.classList.remove('card-active');
        }
      });
    },
    {
      threshold: [0, 0.3, 0.55, 0.8, 1.0],
      rootMargin: '-10% 0px -10% 0px'
    }
  );

  cards.forEach(card => observer.observe(card));

  // Re-evaluate on resize
  window.addEventListener('resize', () => {
    if (!isMobile()) clearActive();
  }, { passive: true });
}
/* — Success Popup (triggered when Formspree marks submission as succeeded) — */
function initSuccessPopup() {
  const overlay  = document.getElementById('success-popup');
  const closeBtn = document.getElementById('success-popup-close');
  const fsSuccess = document.querySelector('[data-fs-success]');

  if (!overlay || !fsSuccess) return;

  let autoCloseTimer;

  function openPopup() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Watch for Formspree setting the success element visible
  const observer = new MutationObserver(() => {
    if (fsSuccess.style.display === 'block') openPopup();
  });

  observer.observe(fsSuccess, { attributes: true, attributeFilter: ['style', 'hidden'] });

  // Close handlers
  closeBtn.addEventListener('click', closePopup);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup();
  });
}
