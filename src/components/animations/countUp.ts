import type { AnimationKit } from './types';

/** `[data-count="200"]`: cuenta de 0 al valor al entrar en pantalla (una vez, 1,6 s, power2.out). */
export function countUp({ gsap, ScrollTrigger }: AnimationKit, root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    const state = { value: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(state.value));
          },
          onComplete: () => {
            el.textContent = String(target);
          },
        }),
    });
  });
}
