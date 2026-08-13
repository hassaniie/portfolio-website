import { gsap } from 'gsap';

const LABELS = {
  view: 'View',
  mail: 'Say hi',
  scroll: 'Scroll',
  home: 'Top',
};

/**
 * Blend-mode custom cursor: a dot that tracks precisely and a ring that
 * trails and grows over interactive targets. Fine-pointer devices only.
 */
export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;

  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');
  if (!cursor) return;

  document.body.classList.add('has-cursor');

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: mouse.x, y: mouse.y };

  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.set(dot, { x: mouse.x, y: mouse.y });
    },
    { passive: true }
  );

  gsap.ticker.add(() => {
    ringPos.x += (mouse.x - ringPos.x) * 0.18;
    ringPos.y += (mouse.y - ringPos.y) * 0.18;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });

  // hover targets
  document.querySelectorAll('[data-cursor], a, button').forEach((el) => {
    const key = el.getAttribute('data-cursor');
    el.addEventListener('pointerenter', () => {
      cursor.classList.add('is-hover');
      label.textContent = key && LABELS[key] ? LABELS[key] : '';
    });
    el.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-hover');
      label.textContent = '';
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
