import type { AnimationKit } from './types';

/**
 * `[data-final]`: the hero in reverse. The video starts inside the arch (on the right, where the hero
 * ended) and the arch opens to full screen; then the CTA block comes in.
 */
export function finalScene({ gsap }: AnimationKit) {
  const el = document.querySelector<HTMLElement>('[data-final]');
  const media = el?.querySelector<HTMLElement>('[data-final-media]');
  const aside = el?.querySelector<HTMLElement>('[data-final-aside]');
  if (!el || !media) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    /** The arch: on the right, aligned with the edge of the header bar, as at the end of the hero. */
    const arch = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const barEnd = document.querySelector('.nb-bar')?.getBoundingClientRect().right ?? w - 80;
      const right = w - barEnd;
      const archW = Math.min(w * 0.3, 420);
      const top = h * 0.2;
      const bottom = h * 0.1;
      return `inset(${top}px ${right}px ${bottom}px ${w - right - archW}px round ${archW / 2}px ${archW / 2}px 0px 0px)`;
    };
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.9,
        invalidateOnRefresh: true,
      },
    });
    tl.fromTo(
      media,
      { clipPath: arch },
      {
        clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)',
        ease: 'power2.inOut',
        duration: 0.6,
      },
      0.05,
    )
      .fromTo(
        media.querySelectorAll('img, video'),
        { scale: 1.12 },
        { scale: 1, ease: 'power2.out', duration: 0.65 },
        0.05,
      )
      .fromTo(
        aside ?? [],
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, ease: 'power3.out', duration: 0.25 },
        0.62,
      )
      .to({}, { duration: 0.001 }, 1);
    return () => gsap.set([media, aside].filter(Boolean), { clearProps: 'all' });
  });
}
