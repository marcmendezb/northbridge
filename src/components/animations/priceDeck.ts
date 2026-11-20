import type { AnimationKit } from './types';

/**
 * `[data-price-deck]` (Pricing): the deck draws from left to right, the pillars drop
 * one by one and each package hangs from its pillar. Once, on entering the viewport.
 */
export function priceDeck({ gsap }: AnimationKit) {
  const deck = document.querySelector<HTMLElement>('[data-price-deck]');
  if (!deck) return;
  const line = deck.querySelector('[data-deck-line]');
  const pillars = deck.querySelectorAll('[data-deck-pillar]');
  const cards = deck.querySelectorAll('.nb-pk__card');

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: { trigger: deck, start: 'top 80%', once: true },
  });
  if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);
  tl.fromTo(
    pillars,
    { scaleY: 0 },
    { scaleY: 1, duration: 0.6, stagger: 0.14, ease: 'power2.inOut' },
    0.45,
  ).fromTo(
    cards,
    { opacity: 0, y: -24 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.14 },
    // Stacked cards (below desktop) don't wait for the whole bridge to be drawn.
    window.innerWidth >= 1024 ? 0.75 : 0.15,
  );
}
