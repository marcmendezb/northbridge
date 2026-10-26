import type { AnimationKit } from './types';

/** `[data-reveal]`: fade + desplazamiento de 28 px, escalonado por lotes, con frenada exponencial. Una sola vez. */
export function revealOnScroll({ gsap, ScrollTrigger }: AnimationKit, root: ParentNode = document) {
  const items = root.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  ScrollTrigger.batch(Array.from(items), {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });
}
