import type { AnimationKit } from './types';

/**
 * `[data-split]`: the headline rises line by line from a mask (SplitText, transform/opacity only).
 * It is split once fonts have loaded so the line breaks are final.
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
