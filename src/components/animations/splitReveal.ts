import type { AnimationKit } from './types';

/**
 * `[data-split]`: el titular sube línea a línea desde una máscara (SplitText, solo transform/opacity).
 * Se divide cuando las fuentes ya han cargado para que los cortes de línea sean los definitivos.
 */
export async function splitReveal(
  { gsap, ScrollTrigger }: AnimationKit,
  root: ParentNode = document,
) {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-split]'));
  if (!items.length) return;
  const { SplitText } = await import('gsap/SplitText');
  gsap.registerPlugin(SplitText);
  await document.fonts.ready;

  items.forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'nb-split-line',
      autoSplit: true,
      aria: 'auto',
      onSplit: (self) => {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 135,
          opacity: 0,
          duration: 1.2,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
  ScrollTrigger.refresh();
}
