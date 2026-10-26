import { countUp } from './countUp';
import { drawConnector } from './drawConnector';
import { heroScene } from './heroScene';
import { revealOnScroll } from './revealOnScroll';

/**
 * Registra las escenas de la página según los atributos `data-*` presentes.
 * GSAP se importa de forma dinámica y solo con `prefers-reduced-motion: no-preference`.
 */
export async function initPage() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  const kit = { gsap, ScrollTrigger };

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    heroScene(kit);
    revealOnScroll(kit);
    countUp(kit);
    drawConnector(kit);
  });

  // Limpieza antes de cambiar de página (View Transitions, fase 7).
  document.addEventListener('astro:before-swap', () => mm.revert(), { once: true });
}
