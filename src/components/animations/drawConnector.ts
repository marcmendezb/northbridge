import type { AnimationKit } from './types';

/**
 * `[data-connector]`: línea de 1,5 px que se dibuja con el scroll (scrub suave)
 * y remata con el arco. Dentro: `[data-connector-line]` (escala) y `[data-connector-arch] path`.
 */
export function drawConnector({ gsap, ScrollTrigger }: AnimationKit, root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-connector]').forEach((el) => {
    const lines = el.querySelectorAll<HTMLElement>('[data-connector-line]');
    const arch = el.querySelectorAll<SVGPathElement>('[data-connector-arch] path');
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 55%', scrub: 0.6 },
    });
    lines.forEach((line) => {
      const vertical = line.dataset.connectorLine === 'v';
      tl.fromTo(
        line,
        vertical ? { scaleY: 0 } : { scaleX: 0 },
        vertical ? { scaleY: 1 } : { scaleX: 1 },
        0,
      );
    });
    if (arch.length)
      tl.fromTo(arch, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2 }, '>-0.05');
    tl.to({}, { duration: 0.001 }); // ScrollTrigger necesita duración total
    ScrollTrigger.refresh();
  });
}
