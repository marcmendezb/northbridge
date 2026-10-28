import type { AnimationKit } from './types';

/**
 * Cierre «20 minutos» (`[data-clock]`): con el scroll, el cabezal recorre la llamada de 0 a 20,
 * la regla se rellena, el reloj corre y cada momento se enciende al alcanzarlo; al final aparece
 * el «+24 h». Solo transform, opacity y texto. Con movimiento reducido no se registra.
 */
export function clockScene({ gsap }: AnimationKit) {
  document.querySelectorAll<HTMLElement>('[data-clock]').forEach((clock) => {
    const track = clock.querySelector<HTMLElement>('[data-clock-track]');
    const fill = clock.querySelector('[data-clock-fill]');
    const head = clock.querySelector('[data-clock-head]');
    const after = clock.querySelector('[data-clock-after]');
    const time = clock.querySelector('[data-clock-time]');
    const moments = Array.from(clock.querySelectorAll<HTMLElement>('[data-clock-moment]'));
    if (!track || !fill || !head || !time) return;

    const pad = (n: number) => String(n).padStart(2, '0');
    const render = (p: number) => {
      const seconds = Math.round(p * 20 * 60);
      time.textContent = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
      moments.forEach((m, i) =>
        m.classList.toggle('is-on', i === 0 ? p > 0 : i === 1 ? p >= 0.5 : p >= 0.999),
      );
    };
    render(0);
    gsap.set(fill, { scaleX: 0 });
    if (after) gsap.set(after, { opacity: 0 });

    const state = { p: 0 };
    gsap
      .timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      .to(state, { p: 1, ease: 'none', duration: 1, onUpdate: () => render(state.p) }, 0)
      .to(fill, { scaleX: 1, ease: 'none', duration: 1 }, 0)
      .fromTo(head, { x: 0 }, { x: () => track.clientWidth, ease: 'none', duration: 1 }, 0)
      .to(after ?? {}, { opacity: 1, duration: 0.12 }, 0.9);
  });
}
