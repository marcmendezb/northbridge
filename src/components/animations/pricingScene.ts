import type { AnimationKit } from './types';

/**
 * Pricing (`[data-pricing]`): the whole page uses the same restrained choreography.
 * - Header: the checkmarks draw one by one and the headline drifts away gently on scroll.
 * - `[data-pr-stagger]` groups: their children enter in sequence (and their checkmarks draw).
 * - Package prices: count up to their value as the card drops in.
 * - Guarantees `[data-pr-draw]`: the symbol draws (deck first, then the arch).
 * - "Extras" `[data-pr-row]`: each row's rule draws from left to right.
 * Only transform, opacity and SVG strokes. Not registered with reduced motion.
 */
export function pricingScene({ gsap, ScrollTrigger }: AnimationKit) {
  if (!document.querySelector('[data-pricing]')) return;
  const ease = 'power3.out';

  // Header headline: drifts away and fades slightly on the way out (scrub, no bounce).
  const drift = document.querySelector('[data-pr-drift]');
  if (drift)
    gsap.to(drift, {
      yPercent: -18,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: drift.closest('header') ?? drift,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

  // Sequences: each group enters on arrival; the checkmarks of its items draw at the same time.
  document.querySelectorAll<HTMLElement>('[data-pr-stagger]').forEach((group) => {
    const items = Array.from(group.children);
    const checks = group.querySelectorAll('[data-pr-check]');
    gsap.set(checks, { strokeDasharray: 1, strokeDashoffset: 1 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
    tl.fromTo(
      items,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease },
      0,
    );
    if (checks.length)
      tl.to(
        checks,
        { strokeDashoffset: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
        0.15,
      );
  });

  // Prices: count up from 60% of their value (no flicker; the final value is already in the DOM).
  document.querySelectorAll<HTMLElement>('.nb-pk .t-price').forEach((price) => {
    const nodes = price.querySelectorAll<HTMLElement>('[data-cc]');
    const targets = nodes.length ? Array.from(nodes) : [price];
    targets.forEach((node) => {
      const final = node.textContent ?? '';
      const value = Number(final.replace(/\D/g, ''));
      if (!value) return;
      const state = { v: value * 0.6 };
      gsap.to(state, {
        v: value,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: price, start: 'top 85%', once: true },
        onStart: () => {
          node.textContent = String(Math.round(state.v));
        },
        onUpdate: () => {
          node.textContent = String(Math.round(state.v / 10) * 10);
        },
        onComplete: () => {
          node.textContent = final;
        },
      });
    });
  });

  // Guarantees: deck first and then the arch, like the brand symbol.
  document.querySelectorAll<SVGElement>('[data-pr-draw]').forEach((svg) => {
    const [deck, arch] = Array.from(svg.querySelectorAll('path'));
    gsap.set([deck, arch], { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap
      .timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } })
      .to(deck, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
      .to(arch, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.35);
  });

  // "Extras": each row appears and its rule draws.
  document.querySelectorAll<HTMLElement>('[data-pr-row]').forEach((row, i) => {
    const rule = row.querySelector('[data-pr-rule]');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 90%', once: true },
      delay: (i % 4) * 0.05,
    });
    tl.fromTo(
      row.querySelectorAll('dt, dd'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease },
      0,
    );
    if (rule)
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.1);
  });

  // Closing: the proposal settles, writes itself line by line, the price counts up and it gets signed.
  const doc = document.querySelector<HTMLElement>('[data-doc]');
  if (doc) {
    const rows = doc.querySelectorAll('[data-doc-row]');
    const rules = doc.querySelectorAll('[data-doc-rule]');
    const signature = doc.querySelector('[data-doc-signature]');
    const stamp = doc.querySelectorAll('[data-doc-stamp] > *');
    const amounts = Array.from(doc.querySelectorAll<HTMLElement>('[data-doc-amount] [data-cc]'));
    const amountNodes = amounts.length
      ? amounts
      : Array.from(doc.querySelectorAll<HTMLElement>('[data-doc-amount]'));
    gsap.set(stamp, { strokeDasharray: 1, strokeDashoffset: 1 });
    const tl = gsap.timeline({
      defaults: { ease },
      scrollTrigger: { trigger: doc, start: 'top 85%', once: true },
    });
    // The sheet writes itself in about two seconds, before a normal scroll moves past it.
    tl.timeScale(1.5);
    tl.fromTo(
      doc,
      { y: 80, rotation: -6, opacity: 0 },
      // Ends on the angle set in CSS (smaller on narrow phones).
      {
        y: 0,
        rotation: () => (window.innerWidth < 520 ? -1 : -1.5),
        opacity: 1,
        duration: 1.3,
        ease: 'expo.out',
      },
      0,
    )
      .fromTo(rows, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.14 }, 0.5)
      .fromTo(
        rules,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, stagger: 0.14, ease: 'power2.inOut' },
        0.55,
      );
    amountNodes.forEach((node) => {
      const final = node.textContent ?? '';
      const value = Number(final.replace(/\D/g, ''));
      if (!value) return;
      const state = { v: 0 };
      tl.to(
        state,
        {
          v: value,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            node.textContent = String(Math.round(state.v / 10) * 10);
          },
          onComplete: () => {
            node.textContent = final;
          },
        },
        1.2,
      );
    });
    if (signature)
      tl.fromTo(
        signature,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power2.inOut' },
        1.9,
      );
    tl.to(stamp, { strokeDashoffset: 0, duration: 0.6, stagger: 0.12, ease: 'power2.inOut' }, 2.6);
  }

  ScrollTrigger.refresh();
}
