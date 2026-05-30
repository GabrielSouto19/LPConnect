/* ============================================
   CONNECT – Script
   ============================================ */

// ---- HEADER SCROLL ----
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ---- MOBILE NAV ----
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile-link, .nav-mobile .btn').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ---- SMOOTH SCROLL FOR NAV ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- BACK TO TOP ----
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- SCROLL REVEAL ----
const revealElements = document.querySelectorAll(
  '.service-card, .case-card, .testimonial-card, .team-card, .blog-card, .stat-item, .philosophy-text, .contact-item'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  el.classList.add(`reveal-delay-${(i % 5) + 1}`);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => observer.observe(el));

// Also reveal section headers
document.querySelectorAll('.section-header, .about-content, .about-visual, .contact-info, .contact-form-wrapper, .cta-content, .cta-actions').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ---- COUNTER ANIMATION ----
const counters = document.querySelectorAll('.stat-number');

const animateCounter = (el) => {
  const text = el.textContent;
  const suffix = el.querySelector('.stat-plus')?.textContent || '';
  const prefix = text.replace(/[0-9.,+%M]/g, '').replace(suffix, '');
  const rawNum = parseFloat(text.replace(/[^0-9.]/g, ''));
  if (isNaN(rawNum)) return;

  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (rawNum * eased).toFixed(rawNum % 1 !== 0 ? 0 : 0);
    el.childNodes[0].textContent = prefix + current;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ---- FORM SUBMIT ----
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Mensagem enviada! ✓';
      btn.style.background = '#22c55e';
      this.reset();
      setTimeout(() => {
        btn.textContent = 'Enviar mensagem';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1500);
  });
}

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-desktop a');

const activeNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => activeNavObserver.observe(section));

// ---- CURSOR GLOW (desktop only) ----
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,69,0,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
