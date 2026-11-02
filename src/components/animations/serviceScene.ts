import type { AnimationKit } from './types';

/**
 * Service page (`[data-service-hero]`).
 * - Header: the photo opens from the margins to full width and settles (scrub).
 * - What's included: each ledger line draws its rule and slides in.
 * - Who it's for: the three statements enter in sequence and their symbol draws.
 * - VAT: in the yearly chart, the flags rise in date order, the reminder tracks
 *   extend and the today line drops in.
 * - Process: the line between steps fills and each arch lights up as it is reached.
 * - Price: the receipt settles and its lines enter one by one.
 * Only transform, opacity, clip-path and strokes. Not registered with reduced motion.
 */
export function serviceScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-service-hero]');
  if (!hero) return;
  const ease = 'expo.out';
  /**
   * Variants for other countries (hidden with `data-cc`): no ScrollTrigger, which is expensive with
   * five calendars on the page; they are left in their final state in case the country changes.
   */
  // A single read pass (not interleaved with writes, which would force layout).
  const off = new Set(
    Array.from(
      document.querySelectorAll('[data-incl-row], [data-who], [data-yr-ruler], [data-steps-path]'),
    ).filter((el) => el.getClientRects().length === 0),
  );
  const hidden = (el: Element) => off.has(el);
  const settle = (root: Element, opacity: string, scale: string[]) => {
    if (opacity) gsap.set(root.querySelectorAll(opacity), { opacity: 1, y: 0 });
    scale.forEach((sel) => gsap.set(root.querySelectorAll(sel), { scaleX: 1, scaleY: 1 }));
  };

  // Header: the photo opens.
  const photo = hero.querySelector<HTMLElement>('[data-sx-photo]');
  const img = photo?.querySelector('img');
  if (photo) {
    const open = { trigger: photo, start: 'top 95%', end: 'top 25%', scrub: 0.6 };
    gsap.fromTo(
      photo,
      { clipPath: 'inset(0% 9% 0% 9% round 8px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 8px)', ease: 'none', scrollTrigger: open },
    );
    if (img) gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: open });
  }

  // What's included.
  document.querySelectorAll<HTMLElement>('[data-incl-row]').forEach((row) => {
    if (hidden(row)) return settle(row, '.nb-incl__text', ['[data-incl-rule]']);
    const rule = row.querySelector('[data-incl-rule]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 90%', once: true } });
    if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);
    tl.fromTo(
      row.querySelector('.nb-incl__text'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease },
      0.2,
    );
  });

  // Who it's for.
  document.querySelectorAll<HTMLElement>('[data-who]').forEach((who) => {
    if (hidden(who)) return settle(who, '.nb-who__item', []);
    const items = who.querySelectorAll('.nb-who__item');
    const marks = who.querySelectorAll('.nb-who__mark path');
    gsap.set(marks, { strokeDasharray: 1, strokeDashoffset: 1, attr: { pathLength: 1 } });
    gsap
      .timeline({ scrollTrigger: { trigger: who, start: 'top 82%', once: true } })
      .fromTo(
        items,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease },
        0,
      )
      .to(marks, { strokeDashoffset: 0, duration: 0.8, stagger: 0.08, ease: 'power2.inOut' }, 0.3);
  });

  // VAT: the yearly chart. Flags rise in date order, each reminder track
  // extends towards its deadline and the today line drops in at the end.
  document.querySelectorAll<HTMLElement>('[data-yr-ruler]').forEach((ruler) => {
    if (hidden(ruler))
      return settle(ruler, '[data-yr-dot], [data-yr-span]', ['[data-yr-alert]', '[data-yr-today]']);
    const pos = (el: HTMLElement) => {
      const at = parseFloat(el.style.getPropertyValue('--at')) || 0;
      return Math.min(Math.max(at / 100, 0), 1);
    };
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: ruler, start: 'top 88%', end: 'top 45%', scrub: 0.6 },
    });
    ruler.querySelectorAll<HTMLElement>('[data-yr-alert]').forEach((r) => {
      tl.fromTo(
        r,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.08 },
        pos(r) * 0.85,
      );
    });
    ruler.querySelectorAll<HTMLElement>('[data-yr-span]').forEach((w) => {
      tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0);
    });
    ruler.querySelectorAll<HTMLElement>('[data-yr-dot]').forEach((flag) => {
      tl.fromTo(
        flag,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power3.out' },
        pos(flag) * 0.85 + 0.04,
      );
    });
    const today = ruler.querySelector('[data-yr-today]');
    if (today)
      tl.fromTo(
        today,
        { scaleY: 0, transformOrigin: '50% 0%' },
        { scaleY: 1, duration: 0.12, ease: 'power2.out' },
        0.88,
      );
    tl.to({}, { duration: 0.001 }, 1);
  });

  // Price: the receipt.
  const receipt = document.querySelector<HTMLElement>('[data-receipt]');
  if (receipt) {
    gsap
      .timeline({ scrollTrigger: { trigger: receipt, start: 'top 82%', once: true } })
      .fromTo(receipt, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.2, ease }, 0)
      .fromTo(
        receipt.querySelectorAll('.nb-receipt__row'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease },
        0.35,
      );
  }

  // Process: each segment between arches fills with the scroll and each step lights up as it is reached.
  document.querySelectorAll<HTMLElement>('[data-steps-path]').forEach((path) => {
    if (hidden(path)) {
      settle(path, '', ['[data-steps-fill]']);
      path.querySelectorAll('[data-steps-item]').forEach((step) => step.classList.add('is-on'));
      return;
    }
    path.querySelectorAll<HTMLElement>('[data-steps-item]').forEach((step) => {
      const fill = step.querySelector('[data-steps-fill]');
      if (fill)
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: step, start: 'top 62%', end: 'bottom 50%', scrub: 0.5 },
          },
        );
      ScrollTrigger.create({
        trigger: step,
        start: 'top 68%',
        onEnter: () => step.classList.add('is-on'),
        onLeaveBack: () => step.classList.remove('is-on'),
      });
    });
  });

  ScrollTrigger.refresh();
}
