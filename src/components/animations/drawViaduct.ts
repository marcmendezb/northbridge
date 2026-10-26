import type { AnimationKit } from './types';

/**
 * `[data-viaduct]`: el tablero se traza de izquierda a derecha y después cada arco,
 * uno tras otro; el texto de cada paso aparece cuando su arco se cierra. Scrub suave.
 */
export function drawViaduct({ gsap }: AnimationKit, root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-viaduct]').forEach((el) => {
    const deck = el.querySelectorAll('[data-viaduct-deck]');
    const steps = Array.from(el.querySelectorAll<HTMLElement>('[data-viaduct-step]'));
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 70%', scrub: 0.9 },
    });
    tl.fromTo(deck, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power1.inOut' }, 0);
    steps.forEach((step, i) => {
      const at = 0.18 + i * 0.22;
      tl.fromTo(
        step.querySelectorAll('[data-viaduct-arch] path'),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.36, ease: 'power1.inOut' },
        at,
      ).fromTo(
        step.querySelectorAll('[data-viaduct-text] > *'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.24, stagger: 0.05, ease: 'power2.out' },
        at + 0.2,
      );
    });
    tl.to({}, { duration: 0.001 });
  });
}
