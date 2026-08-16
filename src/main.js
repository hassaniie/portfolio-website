import './styles/base.css';
import './styles/layout.css';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from './js/webgl/HeroScene.js';
import { initSmoothScroll } from './js/smoothScroll.js';
import { initReveals, revealHero } from './js/reveals.js';
import { initCursor } from './js/cursor.js';
import { initNav, initClock } from './js/nav.js';
import { initCases } from './js/cases.js';
import { runPreloader } from './js/preloader.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- WebGL hero (with graceful fallback) ---------- */
let hero = null;
const canvas = document.getElementById('webgl');
try {
  hero = new HeroScene(canvas, { reducedMotion });
} catch (err) {
  console.warn('WebGL unavailable — using static fallback.', err);
  canvas.style.display = 'none';
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.style.background =
      'linear-gradient(180deg, #241009 0%, #ff6a2c 54%, #ffffff 100%)';
  }
}

/* ---------- immediate, non-visual init ---------- */
const lenis = initSmoothScroll(reducedMotion);
initNav();
initClock();
initCursor();

/* feed scroll progress into the hero shader */
if (hero) {
  const onScroll = () => {
    const p = Math.min(1, window.scrollY / window.innerHeight);
    hero.setScroll(p);
  };
  if (lenis) lenis.on('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- boot sequence ---------- */
async function boot() {
  // wait for fonts so line-splitting + canvas text measure correctly
  const ready = (document.fonts ? document.fonts.ready : Promise.resolve())
    .catch(() => {})
    .then(() => {
      initReveals(reducedMotion);
      initCases(reducedMotion);
      ScrollTrigger.refresh();
    });

  // preloader counts, then lifts once `ready` resolves
  await runPreloader(ready, reducedMotion);

  // reveal the hero in sync with the lifting curtain
  hero?.reveal();
  revealHero(reducedMotion);
  ScrollTrigger.refresh();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  boot();
} else {
  window.addEventListener('DOMContentLoaded', boot);
}
