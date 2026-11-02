import type { AnimationKit } from './types';

/**
 * `[data-reveal-media]`: the photo is revealed from the bottom up (clip-path, paint only) and the
 * image inside moves a little slower than the page (subtle parallax, scrub).
 */
export function mediaReveal({ gsap }: AnimationKit, root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-reveal-media]').forEach((el) => {
    const img = el.querySelector('img');
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      },
    );
    if (img)
      gsap.fromTo(
        img,
        { scale: 1.18, yPercent: -6 },
        {
          scale: 1.08,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      );
  });
}
