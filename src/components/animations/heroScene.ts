import { drawBridge } from './drawBridge';
import type { AnimationKit } from './types';

/**
 * Hero scene.
 * 1) Intro: the bridge draws, the headline rises line by line, then the subtitle, buttons and proof.
 * 2) Arch portal (desktop): as you start scrolling, the full-bleed photo shrinks until it is cropped
 *    into the brand's arch, the intro text leaves and the promise appears. The transition completes
 *    on its own (it is not tied to the scroll position) so it never gets stuck halfway.
 */
export function heroScene({ gsap, ScrollTrigger }: AnimationKit) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const q = <T extends Element>(sel: string) => Array.from(hero.querySelectorAll<T>(sel));

  // ── Intro ──
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const mark = hero.querySelector('[data-hero-mark]');
  if (mark) intro.add(drawBridge(gsap, mark, { speed: 1.6 }), 0);

  const lines = q('[data-hero-line]');
  if (lines.length) {
    intro.fromTo(
      lines,
      // y: 0 cancels the initial CSS translation (GSAP would read it as pixels).
      { yPercent: 135, y: 0, opacity: 0 },
      { yPercent: 0, y: 0, opacity: 1, duration: 1.2, stagger: 0.09 },
      0.12,
    );
  }
  q<HTMLElement>('[data-hero-fade]').forEach((el) => {
    const at = Number(el.dataset.heroFade);
    intro.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1 }, at);
  });

  // The photo "breathes" on load: from 1.06 to 1 (transform only).
  const img = hero.querySelector('[data-hero-media]');
  if (img) gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 2.4, ease: 'expo.out' });

  // ── Arch portal ──
  const photo = hero.querySelector<HTMLElement>('[data-hero-photo]');
  const introLayer = hero.querySelector<HTMLElement>('.hero__intro');
  const introText = hero.querySelector<HTMLElement>('.hero__intro-inner');
  const band = hero.querySelector<HTMLElement>('[data-hero-band]');
  if (!photo || !introLayer) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (min-height: 560px)', () => {
    const promiseParts = q('.hero__promise-inner > *');

    /** Geometry of the final arch, computed from the current viewport. */
    const geometry = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Right edge of the arch = right edge of the header bar (shared grid).
      const barEnd = document.querySelector('.nb-bar')?.getBoundingClientRect().right;
      const edge = barEnd ? w - barEnd : Math.max(0, (w - 1280) / 2) + 40;
      const archW = Math.min(w * 0.4, 520);
      const headerH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 96;
      const top = headerH + 28; // below the floating header
      const bottom = Math.max(48, h * 0.07);
      const left = w - edge - archW;
      // Where the window of light falls in the photo (object-fit: cover, object-position 18% 50%).
      const s = Math.max(w / 1280, h / 720);
      const iw = 1280 * s;
      const ih = 720 * s;
      // On portrait screens the window can fall outside: the zoom point is kept inside.
      const winX = Math.min(Math.max((w - iw) * 0.18 + 0.655 * iw, w * 0.15), w * 0.85);
      const winY = Math.min(Math.max((h - ih) * 0.5 + 0.4 * ih, h * 0.15), h * 0.85);
      const archH = h - top - bottom;
      // Framing scale (the window fills the arch) and a minimum so that the photo, centred on the
      // window, covers the arch on all four sides at any aspect ratio.
      const frame = Math.min(archW / (0.3 * iw), archH / (0.62 * ih));
      const cover = Math.max(
        archW / 2 / Math.max(1, winX),
        archW / 2 / Math.max(1, w - winX),
        archH / 2 / Math.max(1, winY),
        archH / 2 / Math.max(1, h - winY),
      );
      const scale = Math.max(1, frame, cover * 1.02);
      return {
        left,
        bottom,
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
      // Once scrolling starts, the transition completes on its own (and reverses when scrolling back up):
      // with scrub, stopping halfway left the arch in an in-between shape (flat top).
      scrollTrigger: {
        trigger: hero,
        start: 'top+=24 top',
        end: 'bottom bottom',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true,
      },
    });
    tl.timeScale(0.6);
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
      .to(
        introText ?? introLayer,
        { autoAlpha: 0, y: -48, ease: 'power1.in', duration: 0.26 },
        0.02,
      )
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
    // Before the promise appears, the rule is not drawn yet.
    gsap.set('[data-hero-rule] path', { strokeDasharray: 1, strokeDashoffset: 1 });
    // Image footer: rises with the crop to the base of the arch, the credentials move into it,
    // "Scroll" disappears and the band turns white with navy text.
    if (band) {
      const facts = band.querySelector<HTMLElement>('.hero__facts');
      const cue = band.querySelector<HTMLElement>('.hero__scroll');
      const token = (name: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const restLeft = () =>
        facts ? facts.getBoundingClientRect().left - Number(gsap.getProperty(facts, 'x')) : 0;
      // The bar floats --band-gap from the edge: it rises just enough to sit on the base of the arch.
      const gap = () => parseFloat(getComputedStyle(band).bottom) || 0;
      tl.to(
        band,
        {
          y: () => gap() - geometry().bottom,
          borderRadius: 0,
          ease: 'power2.inOut',
          duration: 0.62,
        },
        0.04,
      )
        .to(
          facts,
          { x: () => geometry().left + 28 - restLeft(), ease: 'power2.inOut', duration: 0.62 },
          0.04,
        )
        .to(cue, { autoAlpha: 0, duration: 0.12 }, 0)
        .to(
          band,
          {
            backgroundColor: token('--white'),
            borderColor: token('--white'),
            '--band-fg': token('--navy-800'),
            '--band-divider': token('--piedra-200'),
            duration: 0.1,
          },
          0.54,
        );
    }
    ScrollTrigger.refresh();
    return () => {
      gsap.set(
        [
          photo,
          introLayer,
          introText,
          band,
          band?.querySelector('.hero__facts'),
          band?.querySelector('.hero__scroll'),
          img,
          ...promiseParts,
        ].filter(Boolean),
        {
          clearProps: 'all',
        },
      );
    };
  });
}
