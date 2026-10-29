import type { AnimationKit } from './types';

/**
 * Ficha de servicio (`[data-service-hero]`).
 * - Cabecera: la foto se abre de los márgenes al ancho completo y se asienta (scrub).
 * - Qué incluye: cada línea del libro mayor traza su filete y entra.
 * - Para quién: las tres frases entran en cascada y su símbolo se dibuja.
 * - IVA: en el gráfico del año, las banderas se levantan por orden de fecha, las pistas de aviso
 *   se tienden y la línea de hoy baja.
 * - Proceso: la línea entre pasos se rellena y cada arco se enciende al alcanzarlo.
 * - Precio: el recibo se posa y sus conceptos entran uno a uno.
 * Solo transform, opacity, clip-path y trazos. Con movimiento reducido no se registra.
 */
export function serviceScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-service-hero]');
  if (!hero) return;
  const ease = 'expo.out';

  // Cabecera: la foto se abre.
  const photo = hero.querySelector<HTMLElement>('[data-sx-photo]');
  const img = photo?.querySelector('img');
  if (photo) {
    const open = { trigger: photo, start: 'top 95%', end: 'top 25%', scrub: 0.6 };
    gsap.fromTo(
      photo,
      { clipPath: 'inset(0% 9% 0% 9% round 8px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 8px)', ease: 'none', scrollTrigger: open },
    );
    if (img) gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: open });
  }

  // Qué incluye.
  document.querySelectorAll<HTMLElement>('[data-incl-row]').forEach((row) => {
    const rule = row.querySelector('[data-incl-rule]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 90%', once: true } });
    if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);
    tl.fromTo(
      row.querySelector('.nb-incl__text'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease },
      0.2,
    );
  });

  // Para quién.
  document.querySelectorAll<HTMLElement>('[data-who]').forEach((who) => {
    const items = who.querySelectorAll('.nb-who__item');
    const marks = who.querySelectorAll('.nb-who__mark path');
    gsap.set(marks, { strokeDasharray: 1, strokeDashoffset: 1, attr: { pathLength: 1 } });
    gsap
      .timeline({ scrollTrigger: { trigger: who, start: 'top 82%', once: true } })
      .fromTo(
        items,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease },
        0,
      )
      .to(marks, { strokeDashoffset: 0, duration: 0.8, stagger: 0.08, ease: 'power2.inOut' }, 0.3);
  });

  // IVA: el gráfico del año. Las banderas se levantan por orden de fecha, cada pista de aviso se
  // tiende hacia su plazo y la línea de hoy baja al final.
  document.querySelectorAll<HTMLElement>('[data-yr-ruler]').forEach((ruler) => {
    const pos = (el: HTMLElement) => {
      const at = parseFloat(el.style.getPropertyValue('--at')) || 0;
      return Math.min(Math.max(at / 100, 0), 1);
    };
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: ruler, start: 'top 88%', end: 'top 45%', scrub: 0.6 },
    });
    ruler.querySelectorAll<HTMLElement>('[data-yr-alert]').forEach((r) => {
      tl.fromTo(
        r,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.08 },
        pos(r) * 0.85,
      );
    });
    ruler.querySelectorAll<HTMLElement>('[data-yr-span]').forEach((w) => {
      tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0);
    });
    ruler.querySelectorAll<HTMLElement>('[data-yr-dot]').forEach((flag) => {
      tl.fromTo(
        flag,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power3.out' },
        pos(flag) * 0.85 + 0.04,
      );
    });
    const today = ruler.querySelector('[data-yr-today]');
    if (today)
      tl.fromTo(
        today,
        { scaleY: 0, transformOrigin: '50% 0%' },
        { scaleY: 1, duration: 0.12, ease: 'power2.out' },
        0.88,
      );
    tl.to({}, { duration: 0.001 }, 1);
  });

  // Precio: el recibo.
  const receipt = document.querySelector<HTMLElement>('[data-receipt]');
  if (receipt) {
    gsap
      .timeline({ scrollTrigger: { trigger: receipt, start: 'top 82%', once: true } })
      .fromTo(receipt, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.2, ease }, 0)
      .fromTo(
        receipt.querySelectorAll('.nb-receipt__row'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease },
        0.35,
      );
  }

  // Proceso: cada tramo entre arcos se rellena con el scroll y cada paso se enciende al alcanzarlo.
  document.querySelectorAll<HTMLElement>('[data-steps-path]').forEach((path) => {
    path.querySelectorAll<HTMLElement>('[data-steps-item]').forEach((step) => {
      const fill = step.querySelector('[data-steps-fill]');
      if (fill)
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: step, start: 'top 62%', end: 'bottom 50%', scrub: 0.5 },
          },
        );
      ScrollTrigger.create({
        trigger: step,
        start: 'top 68%',
        onEnter: () => step.classList.add('is-on'),
        onLeaveBack: () => step.classList.remove('is-on'),
      });
    });
  });

  ScrollTrigger.refresh();
}
