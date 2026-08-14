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

  // legacy footer clock (contact section), if present
  const clock = document.getElementById('clock');
  if (clock) {
    const tickLegacy = () => {
      clock.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    };
    tickLegacy();
    setInterval(tickLegacy, 1000);
  }

  // nav clock — live Lahore (Asia/Karachi, GMT+5) split into digit boxes
  const h = document.getElementById('clk-h');
  const m = document.getElementById('clk-m');
  const mer = document.getElementById('clk-mer');
  if (h && m) {
    const tickLahore = () => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).formatToParts(new Date());
      const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
      h.textContent = get('hour').padStart(2, '0');
      m.textContent = get('minute').padStart(2, '0');
      if (mer) mer.textContent = get('dayPeriod').toUpperCase();
    };
    tickLahore();
    setInterval(tickLahore, 1000);
  }
}
