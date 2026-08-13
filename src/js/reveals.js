import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitLines } from './splitText.js';

/**
 * Hero entrance — driven manually so it plays in sync with the preloader
 * curtain rather than firing under it.
 */
export function revealHero(reducedMotion) {
  const splits = gsap.utils.toArray('.hero [data-split]');
  const fades = gsap.utils.toArray('.hero [data-reveal]');
  if (reducedMotion) {
    gsap.set([...splits, ...fades], { yPercent: 0, y: 0, opacity: 1 });
    return;
  }
  gsap.set(splits, { yPercent: 110 });
  gsap.set(fades, { y: 24, opacity: 0 });
  gsap
    .timeline({ delay: 0.15 })
    .to(splits, { yPercent: 0, duration: 1.25, ease: 'power4.out', stagger: 0.12 }, 0)
    .to(fades, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.35);
}

/**
 * Scroll-driven reveals + parallax. Everything degrades to visible/static
 * when reduced motion is requested.
 */
export function initReveals(reducedMotion) {
  if (reducedMotion) {
    document.querySelectorAll('[data-reveal], [data-split], [data-split-lines]').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  const notHero = (el) => !el.closest('.hero');

  // ---- headline "split" words: slide up from mask (hero handled separately) ----
  gsap.utils.toArray('[data-split]').filter(notHero).forEach((el) => {
    gsap.set(el, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(el, { yPercent: 0, duration: 1.1, ease: 'power4.out' }),
    });
  });

  // ---- multi-line paragraph reveals ----
  gsap.utils.toArray('[data-split-lines]').forEach((el) => {
    const inners = splitLines(el);
    gsap.set(inners, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(inners, {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.09,
        }),
    });
  });

  // ---- generic fade/rise reveals (hero handled separately) ----
  gsap.utils.toArray('[data-reveal]').filter(notHero).forEach((el) => {
    gsap.set(el, { y: 26, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }),
    });
  });

  // ---- counters ----
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        }),
    });
  });

  // ---- parallax layers ----
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: -speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // ---- horizontal strip marquee driven by scroll velocity ----
  gsap.utils.toArray('[data-marquee]').forEach((track) => {
    const half = track.scrollWidth / 2;
    let base = gsap.timeline({ repeat: -1 })
      .to(track, { x: -half, duration: 22, ease: 'none' });
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.abs(self.getVelocity()) / 1200;
        base.timeScale(Math.min(boost, 6));
      },
    });
    // ease timeScale back down
    gsap.ticker.add(() => {
      base.timeScale(gsap.utils.interpolate(base.timeScale(), 1, 0.05));
    });
  });
}
