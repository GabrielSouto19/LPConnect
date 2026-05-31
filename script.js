/* ============================================
   CONNECT — Script (Tron Edition)
   ============================================ */

// ---- HEADER SCROLL ----
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 60);
  backToTop.classList.toggle('visible', y > 500);
}, { passive: true });

// ---- MOBILE NAV ----
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile-link, .nav-mobile .btn').forEach(el => {
  el.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});

// ---- BACK TO TOP ----
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll(
  '.service-card, .case-card, .testimonial-card, .team-card, .blog-card, .pitch-stat, .about-card, .contact-item'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal', `reveal-delay-${(i % 5) + 1}`);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// Also reveal section blocks
document.querySelectorAll('.pitch-inner, .section-header, .about-content, .about-visual, .philosophy-inner, .cta-content, .cta-actions, .contact-info, .contact-form-wrapper').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---- COUNTER ANIMATION ----
document.querySelectorAll('.pstat-num').forEach(el => {
  const suffix = el.querySelector('.pstat-plus')?.textContent || '';
  const rawText = el.childNodes[0]?.textContent || '';
  const num = parseFloat(rawText.replace(/[^0-9.]/g, ''));
  const prefix = rawText.replace(/[0-9.]/g, '');
  if (isNaN(num)) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    const start = performance.now();
    const duration = 1600;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.childNodes[0].textContent = prefix + Math.round(num * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.5 });

  observer.observe(el);
});

// ---- FORM SUBMIT ----
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Mensagem enviada ✓';
      btn.style.background = '#00FF88';
      this.reset();
      setTimeout(() => {
        btn.textContent = 'Enviar mensagem';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1500);
  });
}

// ---- TRON CURSOR TRAIL (desktop only) ----
if (window.matchMedia('(pointer: fine)').matches) {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 6px; height: 6px; border-radius: 50%;
    background: #00D4FF;
    box-shadow: 0 0 10px #00D4FF, 0 0 20px rgba(0,212,255,0.5);
    transform: translate(-50%, -50%);
    transition: left 0.08s linear, top 0.08s linear;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(trail);

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.2s ease, top 0.2s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
    glow.style.left  = e.clientX + 'px';
    glow.style.top   = e.clientY + 'px';
  });
}

// ---- ACTIVE NAV HIGHLIGHT ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-desktop a');

new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}` ? 'var(--cyan)' : '';
      });
    }
  });
}, { threshold: 0.4 }).observe(document.querySelector('#pitch') || document.body);

sections.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}` ? 'var(--cyan)' : '';
        });
      }
    });
  }, { threshold: 0.4 }).observe(s);
});
