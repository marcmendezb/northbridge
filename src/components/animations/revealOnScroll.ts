import type { AnimationKit } from './types';

/** `[data-reveal]`: fade + desplazamiento de 28 px, escalonado por lotes, con frenada exponencial. Una sola vez. */
export function revealOnScroll({ gsap, ScrollTrigger }: AnimationKit, root: ParentNode = document) {
  const all = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  // Las variantes de otros países (ocultas con `data-cc`) no llevan ScrollTrigger: se dejan visibles
  // por si se cambia de país. Con cinco países, ahorra cientos de mediciones al refrescar.
  const hidden = all.filter((el) => el.getClientRects().length === 0);
  if (hidden.length) gsap.set(hidden, { opacity: 1, y: 0 });
  const items = all.filter((el) => !hidden.includes(el));
  if (!items.length) return;
  ScrollTrigger.batch(items, {
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
