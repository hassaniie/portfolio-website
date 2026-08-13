import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Mobile menu toggle + nav hide-on-scroll-down / show-on-scroll-up. */
export function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('menu');

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // hide nav when scrolling down, reveal when scrolling up
  let last = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      if (y > last && y > 200) gsap.to(nav, { yPercent: -140, duration: 0.5, ease: 'power2.out' });
      else gsap.to(nav, { yPercent: 0, duration: 0.5, ease: 'power2.out' });
      last = y;
    },
  });
}

/** Footer clock + copyright year. */
export function initClock() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const clock = document.getElementById('clock');
  if (!clock) return;
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };
  tick();
  setInterval(tick, 1000);
}
