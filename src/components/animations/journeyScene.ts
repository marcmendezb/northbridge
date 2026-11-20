import type { AnimationKit } from './types';

/**
 * `[data-journey]`: on desktop the section pins and the steps cross the screen (scrub) over a
 * deck that draws itself; each step draws its scene as it enters. On mobile, each scene draws on arrival.
 */
export function journeyScene({ gsap, ScrollTrigger }: AnimationKit) {
  const el = document.querySelector<HTMLElement>('[data-journey]');
  if (!el) return;
  const pin = el.querySelector<HTMLElement>('[data-journey-pin]');
  const track = el.querySelector<HTMLElement>('[data-journey-track]');
  const deck = el.querySelector('[data-journey-deck]');
  const progress = el.querySelector('[data-journey-progress]');
  const panels = Array.from(el.querySelectorAll<HTMLElement>('[data-journey-panel]'));
  if (!pin || !track || !panels.length) return;

  /** Scene for each step (paused): from empty to fully drawn. */
  const scene = (panel: HTMLElement) => {
    const q = (s: string) => panel.querySelectorAll(s);
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    const hand = { angle: 0 };
    tl.fromTo(
      q('.nb-journey__text > *'),
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out' },
      0,
    );
    switch (panel.dataset.visual) {
      case 'timer':
        tl.fromTo(q('.v-tick'), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.02 }, 0)
          .fromTo(
            q('.v-arc'),
            { strokeDashoffset: 1 },
            // No rounding: the 20-minute arc is exactly a third of the circle (pathLength = 1).
            { strokeDashoffset: 0.6667, duration: 0.8, autoRound: false },
            0.1,
          )
          // The hand turns 120° (20 minutes) around the centre: its SVG transform attribute is animated.
          .fromTo(
            hand,
            { angle: 0 },
            {
              angle: 120,
              duration: 0.8,
              onUpdate: () =>
                q('.v-hand').forEach((line) =>
                  line.setAttribute('transform', `rotate(${hand.angle} 120 120)`),
                ),
            },
            0.1,
          );
        break;
      case 'symbol':
        tl.fromTo(
          q('.v-arch'),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.6 },
          0.05,
        ).fromTo(
          q('.v-deck'),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.35 },
          0.55,
        );
        break;
      case 'ledger':
        q('.v-row').forEach((row, i) => {
          tl.fromTo(
            row,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.3 },
            0.08 + i * 0.16,
          );
        });
        q('.v-check').forEach((check, i) => {
          tl.fromTo(
            check,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.14, ease: 'power2.out' },
            0.32 + i * 0.16,
          );
        });
        break;
    }
    return tl;
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px) and (min-height: 560px)', () => {
    const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
    const move = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    const along = { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: 1 };
    if (deck)
      gsap.fromTo(deck, { scaleX: 0.08 }, { scaleX: 1, ease: 'none', scrollTrigger: along });
    if (progress)
      gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: along });

    panels.forEach((panel, i) => {
      const animation = scene(panel);
      ScrollTrigger.create(
        i === 0
          ? { trigger: el, start: 'top 65%', end: 'top top', scrub: 0.8, animation }
          : {
              trigger: panel,
              containerAnimation: move,
              start: 'left 85%',
              end: 'left 35%',
              scrub: 0.8,
              animation,
            },
      );
    });
    ScrollTrigger.refresh();
  });

  mm.add('(max-width: 1023px)', () => {
    panels.forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 85%',
        end: 'center 55%',
        scrub: 0.8,
        animation: scene(panel),
      });
    });
  });
}
