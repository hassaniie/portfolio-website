import { gsap } from 'gsap';
import WorkPreview from './webgl/WorkPreview.js';

/**
 * Selected-work list: a floating WebGL preview follows the cursor and
 * transitions between projects on hover (fine pointers only).
 */
export function initWork(reducedMotion) {
  const list = document.getElementById('work-list');
  const canvas = document.getElementById('work-preview');
  if (!list || !canvas) return;

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || reducedMotion) {
    canvas.remove();
    return;
  }

  const preview = new WorkPreview(canvas);
  const items = [...list.querySelectorAll('.work__item')];

  const pos = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let active = false;

  gsap.ticker.add(() => {
    if (!active) return;
    pos.x += (target.x - pos.x) * 0.12;
    pos.y += (target.y - pos.y) * 0.12;
    canvas.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    // tilt based on velocity toward target
    preview.setTilt((target.x - pos.x) / 60, (target.y - pos.y) / 60);
  });

  list.addEventListener('pointermove', (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  });

  items.forEach((item) => {
    const index = parseInt(item.dataset.index, 10);
    item.addEventListener('pointerenter', () => {
      if (!active) {
        pos.x = target.x;
        pos.y = target.y;
      }
      active = true;
      preview.show(index);
      canvas.classList.add('is-visible');
      preview.start();
    });
  });

  list.addEventListener('pointerleave', () => {
    active = false;
    canvas.classList.remove('is-visible');
    // let the fade finish, then pause the loop
    setTimeout(() => {
      if (!active) preview.stop();
    }, 600);
  });
}
