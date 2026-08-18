import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Selected Work / Impact: masked heading reveals and a gentle vertical parallax
 * on each project's device mockup as it scrolls through the viewport.
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
    gsap.set(el, { yPercent: 14, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
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

  // parallax the device mockup within each full-height project
  gsap.utils.toArray('.project').forEach((project) => {
    const frame = project.querySelector('.mock__frame');
    if (!frame) return;
    gsap.fromTo(
      frame,
      { yPercent: 8 },
      {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}
