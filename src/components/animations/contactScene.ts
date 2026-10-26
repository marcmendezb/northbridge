import type { AnimationKit } from './types';

/**
 * Contacto (`[data-contact-hero]`): «la puerta abierta».
 * - Cabecera: la foto se descubre en arco y su filete se dibuja; al bajar, la cámara se acerca
 *   a la puerta (scrub) y el texto se aleja.
 * - Caminos: cada fila entra y su filete se traza de izquierda a derecha.
 * - Carta: el papel se posa, el membrete se subraya y la línea de tiempo baja con el scroll,
 *   encendiendo cada paso al alcanzarlo.
 * - Oficina: el camino desde Stadelhofen se dibuja con el scroll y el símbolo marca la llegada.
 * Solo transform, opacity, clip-path y trazos. Con movimiento reducido no se registra.
 */
export function contactScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-contact-hero]');
  if (!hero) return;
  const ease = 'expo.out';

  // 1 · Puerta: arco que sube desde la base, foto que se asienta y filete que la contornea.
  const arch = hero.querySelector<HTMLElement>('[data-cx-arch]');
  const img = arch?.querySelector('img');
  const outline = hero.querySelector('[data-cx-outline]');
  if (arch) {
    const intro = gsap.timeline({ defaults: { ease } });
    intro.fromTo(
      arch,
      { clipPath: 'inset(100% 0% 0% 0% round 9999px 9999px 0px 0px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 9999px 9999px 0px 0px)',
        duration: 1.6,
        ease: 'expo.inOut',
      },
      0.1,
    );
    if (img) intro.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2.2 }, 0.1);
    if (outline)
      intro.fromTo(
        outline,
        { opacity: 0, scale: 0.94, transformOrigin: '50% 100%' },
        { opacity: 1, scale: 1, duration: 1.8 },
        0.9,
      );
    // Al salir: se cruza la puerta.
    const out = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
    if (img)
      gsap.to(img, {
        scale: 1.22,
        ease: 'none',
        scrollTrigger: out,
        immediateRender: false,
      });
  }
  const drift = hero.querySelector('[data-cx-drift]');
  if (drift)
    gsap.to(drift, {
      yPercent: -10,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });

  // 2 · Caminos.
  document.querySelectorAll<HTMLElement>('[data-way]').forEach((row, i) => {
    const rule = row.querySelector('[data-way-rule]');
    const link = row.querySelector('a');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 88%', once: true },
      delay: i * 0.08,
    });
    if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0);
    if (link)
      tl.fromTo(
        link.children,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.07, ease },
        0.15,
      );
  });

  // 3 · Carta y línea de tiempo.
  const sheet = document.querySelector<HTMLElement>('[data-sheet]');
  if (sheet) {
    const rule = sheet.querySelector('[data-sheet-rule]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: sheet, start: 'top 82%', once: true } });
    tl.fromTo(sheet, { opacity: 0, y: 64 }, { opacity: 1, y: 0, duration: 1.3, ease }, 0);
    if (rule)
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.45);
  }
  const steps = document.querySelector<HTMLElement>('[data-steps]');
  const line = steps?.querySelector('[data-steps-line]');
  if (steps && line) {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: steps, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
      },
    );
    steps.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 70%',
        onEnter: () => step.classList.add('is-on'),
        onLeaveBack: () => step.classList.remove('is-on'),
      });
    });
  }

  // 4 · Mapa: calles, camino que se traza con el scroll y llegada.
  const map = document.querySelector<HTMLElement>('[data-map]');
  if (map) {
    const route = map.querySelector('[data-map-route]');
    const pin = map.querySelector('[data-map-pin]');
    const walk = map.querySelector('[data-map-walk]');
    gsap.fromTo(
      map.querySelectorAll('[data-map-streets] path'),
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: map, start: 'top 85%', once: true },
      },
    );
    const tl = gsap.timeline({
      scrollTrigger: { trigger: map, start: 'top 80%', end: 'center 60%', scrub: 0.8 },
    });
    if (route) tl.fromTo(route, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none' }, 0);
    if (walk) tl.fromTo(walk, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.35);
    if (pin)
      tl.fromTo(
        pin,
        { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' },
        0.8,
      );
  }

  ScrollTrigger.refresh();
}
