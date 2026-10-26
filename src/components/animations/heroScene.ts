import { drawBridge } from './drawBridge';
import type { AnimationKit } from './types';

/**
 * Escena del hero.
 * 1) Entrada: el puente se dibuja, el título sube por líneas, aparecen subtítulo, botones y prueba.
 * 2) Arco-portal (escritorio): al hacer scroll, la foto a sangre se encoge hasta quedar recortada en el
 *    arco de la marca, el texto de entrada sale y aparece la promesa.
 */
export function heroScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const q = <T extends Element>(sel: string) => Array.from(hero.querySelectorAll<T>(sel));

  // ── Entrada ──
  const intro = gsap.timeline();
  const mark = hero.querySelector('[data-hero-mark]');
  if (mark) intro.add(drawBridge(gsap, mark), 0);

  const lines = q('[data-hero-line]');
  if (lines.length) {
    intro.fromTo(
      lines,
      { yPercent: 105, y: 0 },
      { yPercent: 0, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
      1.0,
    );
  }
  q<HTMLElement>('[data-hero-fade]').forEach((el) => {
    const at = Number(el.dataset.heroFade);
    intro.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      at,
    );
  });

  // La foto «respira» al cargar: de 1,06 a 1 (solo transform).
  const img = hero.querySelector('[data-hero-media]');
  if (img) gsap.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 2.2, ease: 'power2.out' });

  // ── Arco-portal ──
  const photo = hero.querySelector<HTMLElement>('[data-hero-photo]');
  const introLayer = hero.querySelector<HTMLElement>('.hero__intro');
  if (!photo || !introLayer) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    const promiseParts = q('.hero__promise-inner > *');

    /** Geometría del arco final, calculada con el viewport actual. */
    const geometry = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const edge = Math.max(0, (w - 1280) / 2) + 40; // borde del contenedor (1200 + 2 × 40)
      const archW = Math.min(w * 0.4, 520);
      const headerH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 96;
      const top = headerH + 28; // bajo el header flotante
      const bottom = Math.max(48, h * 0.07);
      const left = w - edge - archW;
      // Dónde cae la ventana de luz de la foto (object-fit: cover, object-position 30 % 50 %).
      const s = Math.max(w / 1280, h / 720);
      const iw = 1280 * s;
      const ih = 720 * s;
      const winX = (w - iw) * 0.3 + 0.655 * iw;
      const winY = (h - ih) * 0.5 + 0.4 * ih;
      const archH = h - top - bottom;
      const scale = Math.max(1, Math.min(archW / (0.3 * iw), archH / (0.62 * ih)));
      return {
        clip: `inset(${top}px ${edge}px ${bottom}px ${left}px round ${archW / 2}px ${archW / 2}px 0px 0px)`,
        origin: `${winX}px ${winY}px`,
        x: left + archW / 2 - winX,
        y: top + archH / 2 - winY,
        scale,
      };
    };
    const arch = () => geometry().clip;

    gsap.set(photo, { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)' });
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    tl.to(photo, { clipPath: arch, ease: 'power2.inOut', duration: 0.62 }, 0.04)
      .to(
        img ?? photo,
        {
          scale: () => geometry().scale,
          x: () => geometry().x,
          y: () => geometry().y,
          transformOrigin: () => geometry().origin,
          duration: 0.7,
        },
        0,
      )
      .to(introLayer, { autoAlpha: 0, y: -48, ease: 'power1.in', duration: 0.26 }, 0.02)
      .fromTo(
        promiseParts,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.2, stagger: 0.09, ease: 'power3.out' },
        0.5,
      )
      .fromTo(
        '[data-hero-rule] path',
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' },
        0.46,
      )
      .to({}, { duration: 0.001 }, 1);
    // Antes de que la promesa aparezca, la regla está sin trazar.
    gsap.set('[data-hero-rule] path', { strokeDasharray: 1, strokeDashoffset: 1 });
    ScrollTrigger.refresh();
    return () => {
      gsap.set([photo, introLayer, img, ...promiseParts].filter(Boolean), { clearProps: 'all' });
    };
  });
}
