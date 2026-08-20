import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Selected Work / Impact — scroll motion (GSAP + ScrollTrigger over Lenis):
 * masked heading reveals, the signal wave drawing itself in, and a layered
 * parallax + subtle 3D tilt on each project's device mockup.
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

  // the signal wave draws itself in (energy continued from the hero)
  const wavePath = section.querySelector('.wave-rule path');
  if (wavePath && wavePath.getTotalLength) {
    const len = wavePath.getTotalLength();
    gsap.set(wavePath, { strokeDasharray: len, strokeDashoffset: len });
    ScrollTrigger.create({
      trigger: '.wave-rule',
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(wavePath, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.out' }),
    });
  }

  // per-project: parallax + subtle 3D tilt on the device mockup
  gsap.utils.toArray('.project').forEach((project) => {
    const frame = project.querySelector('.mock__frame');
    if (!frame) return;
    const flip = project.hasAttribute('data-flip');
    gsap.fromTo(
      frame,
      { yPercent: 11, rotateY: flip ? -5 : 5, scale: 0.97 },
      {
        yPercent: -11,
        rotateY: flip ? 5 : -5,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}
