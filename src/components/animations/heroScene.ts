import { drawBridge } from './drawBridge';
import type { AnimationKit } from './types';

/**
 * Escena del hero (docs/06-animacion.md, momento 1). `[data-hero]` contiene:
 * `[data-hero-pattern]`, `[data-hero-mark]`, `[data-hero-line]`, `[data-hero-fade="<s>"]`.
 */
export function heroScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const q = <T extends Element>(sel: string) => Array.from(hero.querySelectorAll<T>(sel));

  const tl = gsap.timeline();
  const pattern = q('[data-hero-pattern]');
  if (pattern.length)
    tl.fromTo(pattern, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power1.out' }, 0);

  const mark = hero.querySelector('[data-hero-mark]');
  if (mark) tl.add(drawBridge(gsap, mark), 0);

  const lines = q('[data-hero-line]');
  if (lines.length) {
    tl.fromTo(
      lines,
      { yPercent: 105, y: 0 },
      { yPercent: 0, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
      1.0,
    );
  }

  q<HTMLElement>('[data-hero-fade]').forEach((el) => {
    const at = Number(el.dataset.heroFade);
    tl.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      at,
    );
  });

  // Parallax mínimo del patrón al hacer scroll.
  if (pattern.length) {
    gsap.to(pattern, {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
  ScrollTrigger.refresh();
}
