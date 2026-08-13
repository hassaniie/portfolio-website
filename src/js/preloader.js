import { gsap } from 'gsap';

/**
 * Counter preloader. Counts to ~80 on a timer, then races the incoming
 * `ready` promise (fonts + init) to 100 before lifting the curtain.
 * Resolves once the curtain has cleared the viewport.
 */
export function runPreloader(readyPromise, reducedMotion) {
  const el = document.getElementById('preloader');
  const countEl = document.getElementById('preloader-count');
  const bar = document.getElementById('preloader-progress');

  const lift = () =>
    new Promise((resolve) => {
      el.classList.add('is-done');
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.style.display = 'none';
        resolve();
      };
      el.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 1300);
    });

  if (reducedMotion) {
    countEl.textContent = '100';
    bar.style.width = '100%';
    return readyPromise.catch(() => {}).then(lift);
  }

  return new Promise((resolve) => {
    const state = { v: 0 };
    let ready = false;
    readyPromise.catch(() => {}).finally(() => (ready = true));

    const set = () => {
      countEl.textContent = Math.round(state.v);
      bar.style.width = `${state.v}%`;
    };

    gsap.to(state, {
      v: 80,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate: set,
      onComplete: () => {
        const finish = () =>
          gsap.to(state, {
            v: 100,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: set,
            onComplete: () => lift().then(resolve),
          });
        if (ready) finish();
        else readyPromise.catch(() => {}).finally(finish);
      },
    });
  });
}
