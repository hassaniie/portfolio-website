import { gsap } from 'gsap';

/**
 * Minimal custom cursor: a single 8px dot in the primary colour that tracks
 * the pointer precisely and nudges larger over interactive targets.
 * Fine-pointer devices only.
 */
export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;

  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  if (!cursor || !dot) return;

  const trail = document.getElementById('cursor-ring');
  document.body.classList.add('has-cursor');

  // gsap owns the transform; keep both centred on the pointer
  gsap.set([dot, trail].filter(Boolean), { xPercent: -50, yPercent: -50 });

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const lag = { x: mouse.x, y: mouse.y };

  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    },
    { passive: true }
  );

  // the trailing mark eases toward the pointer, lagging behind the dot
  if (trail) {
    gsap.ticker.add(() => {
      lag.x += (mouse.x - lag.x) * 0.16;
      lag.y += (mouse.y - lag.y) * 0.16;
      gsap.set(trail, { x: lag.x, y: lag.y });
    });
  }

  document.querySelectorAll('[data-cursor], a, button').forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });

  initMagnetic();
}

/** Magnetic pull for elements marked [data-magnetic] (and nav CTA). */
function initMagnetic() {
  const targets = document.querySelectorAll('[data-magnetic], .nav__cta, .hero__scroll');
  targets.forEach((el) => {
    const strength = 0.35;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
