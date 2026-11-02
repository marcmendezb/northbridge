import { aboutScene } from './aboutScene';
import { calcPreview } from './calcPreview';
import { clockScene } from './clockScene';
import { contactScene } from './contactScene';
import { countUp } from './countUp';
import { finalScene } from './finalScene';
import { drawViaduct } from './drawViaduct';
import { heroScene } from './heroScene';
import { journeyScene } from './journeyScene';
import { mediaReveal } from './mediaReveal';
import { priceDeck } from './priceDeck';
import { pricingScene } from './pricingScene';
import { revealOnScroll } from './revealOnScroll';
import { serviceScene } from './serviceScene';
import { splitReveal } from './splitReveal';
import { getSmoothScroll } from './smoothScroll';

/**
 * Registers the page's scenes based on the `data-*` attributes present.
 * GSAP is imported dynamically and only with `prefers-reduced-motion: no-preference`.
 */
export async function initPage() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  const kit = { gsap, ScrollTrigger };
  // ScrollTrigger follows the scroll position computed by Lenis.
  getSmoothScroll()?.on('scroll', ScrollTrigger.update);

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    heroScene(kit);
    revealOnScroll(kit);
    countUp(kit);
    drawViaduct(kit);
    journeyScene(kit);
    calcPreview(kit);
    finalScene(kit);
    mediaReveal(kit);
    priceDeck(kit);
    pricingScene(kit);
    aboutScene(kit);
    contactScene(kit);
    serviceScene(kit);
    clockScene(kit);
    void splitReveal(kit);
  });

  // Clean up before leaving the page.
  document.addEventListener('astro:before-swap', () => mm.revert(), { once: true });
}
