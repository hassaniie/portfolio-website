import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Selected Work / Impact section: heading reveals, horizontal parallax on the
 * alternating case visuals, a flagship rise, and the signal-pulse travelling
 * down the spine as you scroll.
 */
export function initCases(reducedMotion) {
  const section = document.querySelector('.cases');
  if (!section) return;

  const names = gsap.utils.toArray('[data-case-name]');

  if (reducedMotion) {
    gsap.set(names, { clipPath: 'none', yPercent: 0, opacity: 1 });
    return;
  }

  // masked heading reveals
  names.forEach((el) => {
    gsap.set(el, { yPercent: 16, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          yPercent: 0,
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          ease: 'power4.out',
        }),
    });
  });

  // horizontal drift on the alternating case visuals
  gsap.utils.toArray('.case--alt').forEach((c) => {
    const viz = c.querySelector('.viz');
    if (!viz) return;
    const flip = c.hasAttribute('data-flip');
    gsap.fromTo(
      viz,
      { xPercent: flip ? 7 : -7 },
      {
        xPercent: flip ? -7 : 7,
        ease: 'none',
        scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  // flagship visual rises subtly through its scroll
  const lead = document.querySelector('.case--lead .viz');
  if (lead) {
    gsap.fromTo(
      lead,
      { y: 48 },
      {
        y: -24,
        ease: 'none',
        scrollTrigger: { trigger: '.case--lead', start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  }

  // signal pulse travels down the spine
  const pulse = document.querySelector('[data-signal-pulse]');
  if (pulse) {
    gsap.to(pulse, {
      top: '100%',
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top center', end: 'bottom bottom', scrub: 0.4 },
    });
  }
}
