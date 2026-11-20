import type { AnimationKit } from './types';

/**
 * About page (`[data-about-hero]`): page choreography.
 * - Header: the photo slowly zooms in and the text drifts away on the way out (scrub).
 * - Story: the year's digits rise one by one from their mask.
 * - Principles: the row crossing the middle of the screen lights up (`is-lit` class).
 * - Team: each portrait is revealed in an arch and the name rises, line by line.
 * Only transform, opacity, clip-path and strokes. Not registered with reduced motion.
 */
export function aboutScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-about-hero]');
  if (!hero) return;

  const img = hero.querySelector('img');
  const content = hero.querySelector('[data-about-hero-content]');
  const out = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
  if (img) gsap.fromTo(img, { scale: 1.02 }, { scale: 1.12, ease: 'none', scrollTrigger: out });
  if (content) gsap.to(content, { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: out });

  // Founding year: digit by digit.
  const digits = document.querySelectorAll('[data-year] .nb-hist__digit > span');
  if (digits.length)
    gsap.fromTo(
      digits,
      // y: 0 cancels the translateY from the initial CSS (GSAP would read it as a pixel offset).
      { yPercent: 135, y: 0 },
      {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.nb-hist', start: 'top 75%', once: true },
      },
    );

  // Principles: focus on the middle row.
  document.querySelectorAll<HTMLElement>('[data-focus-row]').forEach((row) => {
    ScrollTrigger.create({
      trigger: row,
      start: 'top 50%',
      end: 'bottom 50%',
      toggleClass: { targets: row, className: 'is-lit' },
    });
  });

  // Team: arch revealed from the bottom up, then the name.
  document.querySelectorAll<HTMLElement>('[data-crew-arch]').forEach((arch, i) => {
    const lines = arch.querySelectorAll('.nb-crew__line > span');
    const photo = arch.querySelector('img');
    // The stagger only reads as such when the four arches share a row (desktop).
    const tl = gsap.timeline({
      delay: window.innerWidth >= 1024 ? (i % 4) * 0.12 : 0,
      scrollTrigger: { trigger: arch, start: 'top 90%', once: true },
    });
    tl.fromTo(
      arch,
      { clipPath: 'inset(100% 0% 0% 0% round 9999px 9999px 0px 0px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 9999px 9999px 0px 0px)',
        duration: 1.1,
        ease: 'expo.out',
      },
      0,
    );
    if (photo) tl.fromTo(photo, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
    tl.fromTo(
      lines,
      { yPercent: 135, y: 0 },
      { yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out' },
      0.4,
    );
  });

  // Closing: the baseline draws and the team rises on top of it, pillar by pillar.
  const meet = document.querySelector<HTMLElement>('[data-meet]');
  if (meet) {
    const base = meet.querySelector('[data-meet-base]');
    const arches = meet.querySelectorAll('[data-meet-arch]');
    const names = meet.querySelectorAll('[data-meet-name]');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: meet.querySelector('.nb-meet__team'),
        start: 'top 80%',
        once: true,
      },
    });
    if (base) tl.fromTo(base, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);
    tl.fromTo(
      arches,
      { yPercent: 101, y: 0 },
      { yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out' },
      0.45,
    ).fromTo(
      names,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      0.95,
    );
  }

  ScrollTrigger.refresh();
}
