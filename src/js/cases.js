import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Projects — scroll motion (GSAP + ScrollTrigger over Lenis): masked heading
 * reveals, the section rule drawing itself out, and a layered parallax +
 * subtle 3D tilt on each project's device mockup inside its inset frame.
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

  // the section rule draws itself out from the left as the header lands
  const rule = section.querySelector('.cases__rule');
  if (rule) {
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
    ScrollTrigger.create({
      trigger: rule,
      start: 'top 95%',
      once: true,
      onEnter: () => gsap.to(rule, { scaleX: 1, duration: 1.4, ease: 'power3.out' }),
    });
  }

  // per-project: parallax + subtle 3D tilt on the device mockup inside its
  // inset frame — the image drifts against the copy as the row passes through
  gsap.utils.toArray('.project').forEach((project) => {
    const frame = project.querySelector('.mock__frame');
    if (!frame) return;
    gsap.fromTo(
      frame,
      { yPercent: 9, rotateY: 5, scale: 0.96 },
      {
        yPercent: -9,
        rotateY: -5,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );

    // the copy column lags the image slightly — layered depth, not a fade-in
    const mid = project.querySelector('.project__mid');
    if (mid) {
      gsap.fromTo(
        mid,
        { yPercent: 14 },
        {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    }
  });
}
