import type { AnimationKit } from './types';

/**
 * Ficha de servicio (`[data-service-hero]`).
 * - Cabecera: la foto se abre de los márgenes al ancho completo y se asienta (scrub).
 * - Qué incluye: cada línea del libro mayor traza su filete y entra.
 * - Para quién: las tres frases entran en cascada y su símbolo se dibuja.
 * - IVA: la regla del año se traza de enero a diciembre con el scroll; cada plazo y su aviso
 *   aparecen cuando la línea los alcanza, y la marca de hoy cae en su sitio.
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
      row.querySelectorAll('.nb-incl__n, .nb-incl__text'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease },
      0.2,
    );
  });

  // Para quién.
  const who = document.querySelector<HTMLElement>('[data-who]');
  if (who) {
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
  }

  // IVA: la regla del año.
  const ruler = document.querySelector<HTMLElement>('[data-yr-ruler]');
  if (ruler) {
    const line = ruler.querySelector('[data-yr-line]');
    const pos = (el: HTMLElement) => {
      const at = parseFloat(el.style.getPropertyValue('--at')) || 0;
      return Math.min(Math.max(at / 100, 0), 1);
    };
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: ruler, start: 'top 92%', end: 'top 55%', scrub: 0.6 },
    });
    if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    ruler.querySelectorAll<HTMLElement>('[data-yr-alert]').forEach((a) => {
      tl.fromTo(a, { opacity: 0 }, { opacity: 1, duration: 0.04 }, pos(a));
    });
    ruler.querySelectorAll<HTMLElement>('[data-yr-dot]').forEach((dot) => {
      tl.fromTo(
        dot,
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.06, ease: 'power3.out' },
        pos(dot) + 0.01,
      );
    });
    const today = ruler.querySelector('[data-yr-today]');
    if (today) tl.fromTo(today, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.1 }, 0.9);
    tl.to({}, { duration: 0.001 }, 1);
  }

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

  ScrollTrigger.refresh();
}
