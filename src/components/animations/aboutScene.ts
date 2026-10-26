import type { AnimationKit } from './types';

/**
 * Nosotros (`[data-about-hero]`): coreografía de la página.
 * - Cabecera: la foto se acerca despacio y el texto se aleja al salir (scrub).
 * - Historia: las cifras del año suben una a una desde su máscara.
 * - Principios: la fila que pasa por el centro de la pantalla se ilumina (clase `is-lit`).
 * - Equipo: cada retrato se descubre en arco y su nombre sube, línea a línea.
 * Solo transform, opacity, clip-path y trazos. Con movimiento reducido no se registra.
 */
export function aboutScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-about-hero]');
  if (!hero) return;

  const img = hero.querySelector('img');
  const content = hero.querySelector('[data-about-hero-content]');
  const out = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
  if (img) gsap.fromTo(img, { scale: 1.02 }, { scale: 1.12, ease: 'none', scrollTrigger: out });
  if (content) gsap.to(content, { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: out });

  // Año de fundación: cifra a cifra.
  const digits = document.querySelectorAll('[data-year] .nb-hist__digit > span');
  if (digits.length)
    gsap.fromTo(
      digits,
      // y: 0 anula el translateY del CSS inicial (GSAP lo leería como desplazamiento en px).
      { yPercent: 135, y: 0 },
      {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.nb-hist', start: 'top 75%', once: true },
      },
    );

  // Principios: foco en la fila del centro.
  document.querySelectorAll<HTMLElement>('[data-focus-row]').forEach((row) => {
    ScrollTrigger.create({
      trigger: row,
      start: 'top 50%',
      end: 'bottom 50%',
      toggleClass: { targets: row, className: 'is-lit' },
    });
  });

  // Equipo: arco que se descubre de abajo arriba; después, el nombre.
  document.querySelectorAll<HTMLElement>('[data-crew-arch]').forEach((arch, i) => {
    const lines = arch.querySelectorAll('.nb-crew__line > span');
    const photo = arch.querySelector('img');
    const tl = gsap.timeline({
      delay: (i % 4) * 0.12,
      scrollTrigger: { trigger: arch, start: 'top 85%', once: true },
    });
    tl.fromTo(
      arch,
      { clipPath: 'inset(100% 0% 0% 0% round 9999px 9999px 0px 0px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 9999px 9999px 0px 0px)',
        duration: 1.4,
        ease: 'expo.inOut',
      },
      0,
    );
    if (photo) tl.fromTo(photo, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
    tl.fromTo(
      lines,
      { yPercent: 135, y: 0 },
      { yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out' },
      0.75,
    );
  });

  // Cierre: la línea de base se traza y el equipo se levanta sobre ella, pilar a pilar.
  const meet = document.querySelector<HTMLElement>('[data-meet]');
  if (meet) {
    const base = meet.querySelector('[data-meet-base]');
    const arches = meet.querySelectorAll('[data-meet-arch]');
    const names = meet.querySelectorAll('[data-meet-name]');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: meet.querySelector('.nb-meet__team'),
        start: 'top 80%',
        once: true,
      },
    });
    if (base) tl.fromTo(base, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);
    tl.fromTo(
      arches,
      { yPercent: 101, y: 0 },
      { yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out' },
      0.45,
    ).fromTo(
      names,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      0.95,
    );
  }

  ScrollTrigger.refresh();
}
