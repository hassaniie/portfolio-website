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

  document.body.classList.add('has-cursor');

  // gsap owns the transform; keep it centred on the pointer via xPercent/yPercent
  gsap.set(dot, { xPercent: -50, yPercent: -50 });

  window.addEventListener(
    'pointermove',
    (e) => gsap.set(dot, { x: e.clientX, y: e.clientY }),
    { passive: true }
  );

  document.querySelectorAll('[data-cursor], a, button').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      cursor.classList.add('is-hover');
      gsap.to(dot, { scale: 1.7, duration: 0.25, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-hover');
      gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power3.out' });
    });
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
