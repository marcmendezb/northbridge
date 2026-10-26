import type { Gsap } from './types';

/** Dibuja el tablero y después el arco de un `BridgeMark` (pathLength = 1). Devuelve la línea de tiempo. */
export function drawBridge(gsap: Gsap, svg: Element, { at = 0 }: { at?: number } = {}) {
  const deck = svg.querySelector('.nb-deck');
  const arch = svg.querySelector('.nb-arch');
  const tl = gsap.timeline({ defaults: { strokeDashoffset: 0 } });
  if (deck) tl.fromTo(deck, { strokeDashoffset: 1 }, { duration: 0.9, ease: 'power2.inOut' }, at);
  if (arch)
    tl.fromTo(arch, { strokeDashoffset: 1 }, { duration: 1.2, ease: 'power2.inOut' }, at + 0.5);
  return tl;
}
