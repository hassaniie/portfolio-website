import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitLines } from './splitText.js';

/**
 * Hero entrance — driven manually so it plays in sync with the preloader
 * curtain rather than firing under it.
 */
export function revealHero(reducedMotion) {
  const headline = document.querySelector('[data-hero-headline]');
  const fades = gsap.utils.toArray('.hero [data-reveal]');
  const portrait = document.querySelector('[data-hero-parallax]');

  if (reducedMotion) {
    gsap.set([headline, ...fades, portrait].filter(Boolean), {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: 'none',
    });
    return;
  }

  const tl = gsap.timeline({ delay: 0.15 });

  if (headline) {
    gsap.set(headline, { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' });
    tl.to(
      headline,
      { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out' },
      0
    );
  }
  if (portrait) {
    gsap.set(portrait, { opacity: 0, scale: 1.08 });
    tl.to(portrait, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, 0.25);
  }
  gsap.set(fades, { y: 26, opacity: 0 });
  tl.to(fades, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.09 }, 0.4);
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

  // ---- hero portrait parallax (scrolls faster than the rest of the page) ----
  const portrait = document.querySelector('[data-hero-parallax]');
  if (portrait && window.matchMedia('(min-width: 861px)').matches) {
    gsap.to(portrait, {
      yPercent: -26,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

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
