import type { AnimationKit } from './types';

/** `[data-reveal]`: fade plus a 28 px rise, staggered in batches, with an exponential ease-out. Once. */
export function revealOnScroll({ gsap, ScrollTrigger }: AnimationKit, root: ParentNode = document) {
  const all = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  // Variants for other countries (hidden with `data-cc`) get no ScrollTrigger: they are left visible
  // in case the country changes. With five countries, this saves hundreds of measurements on refresh.
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
