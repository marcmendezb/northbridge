import type { AnimationKit } from './types';

/**
 * `[data-calc-preview]`: when it enters the viewport the preview fills itself in: the company type
 * is picked, the sliders move to their value, the figures count up and the estimate appears. Once.
 */
export function calcPreview({ gsap }: AnimationKit) {
  document.querySelectorAll<HTMLElement>('[data-calc-preview]').forEach((el) => {
    const chipBg = el.querySelector('[data-calc-chip-bg]');
    const tracks = el.querySelectorAll<HTMLElement>('[data-calc-track]');
    const counts = el.querySelectorAll<HTMLElement>('[data-calc-count]');
    const result = el.querySelector('[data-calc-result]');
    const activeChip = el.querySelector<HTMLElement>('.nb-calc__chip[data-active]');

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      scrollTrigger: { trigger: el, start: 'top 75%', once: true },
    });
    if (chipBg) {
      activeChip?.removeAttribute('data-active');
      tl.fromTo(
        chipBg,
        {
          xPercent:
            -100 *
            Number(
              getComputedStyle(el.querySelector('.nb-calc__chips')!).getPropertyValue('--active'),
            ),
        },
        { xPercent: 0, duration: 0.9, ease: 'power3.inOut' },
        0.1,
      ).add(() => activeChip?.setAttribute('data-active', ''), 0.7);
    }
    tracks.forEach((track, i) => {
      const v = Number(track.style.getPropertyValue('--v'));
      tl.fromTo(
        track.querySelector('.nb-calc__fill'),
        { scaleX: 0 },
        { scaleX: v, duration: 1.2 },
        0.45 + i * 0.15,
      ).fromTo(
        track.querySelector('.nb-calc__knob'),
        { x: 0 },
        { x: () => v * track.clientWidth, duration: 1.2 },
        0.45 + i * 0.15,
      );
    });
    counts.forEach((node, i) => {
      const to = Number(node.dataset.calcCount);
      const label = node.textContent ?? String(to);
      const state = { n: 0 };
      tl.to(
        state,
        {
          n: to,
          duration: 1.2,
          onUpdate: () => (node.textContent = String(Math.round(state.n))),
          onComplete: () => (node.textContent = label),
        },
        i < 2 ? 0.45 + i * 0.15 : 0.95,
      );
    });
    if (result) tl.fromTo(result, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1 }, 0.85);
  });
}
