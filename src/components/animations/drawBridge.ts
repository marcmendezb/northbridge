import type { Gsap } from './types';

/** Draws the deck and then the arch of a `BridgeMark` (pathLength = 1). Returns the timeline. */
export function drawBridge(
  gsap: Gsap,
  svg: Element,
  { at = 0, speed = 1 }: { at?: number; speed?: number } = {},
) {
  const deck = svg.querySelector('.nb-deck');
  const arch = svg.querySelector('.nb-arch');
  const tl = gsap.timeline({ defaults: { strokeDashoffset: 0 } });
  if (deck)
    tl.fromTo(deck, { strokeDashoffset: 1 }, { duration: 0.9 / speed, ease: 'power2.inOut' }, at);
  if (arch)
    tl.fromTo(
      arch,
      { strokeDashoffset: 1 },
      { duration: 1.2 / speed, ease: 'power2.inOut' },
      at + 0.5 / speed,
    );
  return tl;
}
