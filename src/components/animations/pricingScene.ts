import type { AnimationKit } from './types';

/**
 * Precios (`[data-pricing]`): la página entera se anima con la misma coreografía sobria.
 * - Cabecera: los checks se trazan uno a uno y el titular se aleja suavemente con el scroll.
 * - Grupos `[data-pr-stagger]`: sus hijos entran en cascada (y sus checks se trazan).
 * - Precios de los paquetes: cuentan hasta su valor cuando la tarjeta se descuelga.
 * - Garantías `[data-pr-draw]`: el símbolo se traza (tablero y después arco).
 * - «Aparte» `[data-pr-row]`: el filete de cada fila se dibuja de izquierda a derecha.
 * Solo transform, opacity y el trazo de los SVG. Con movimiento reducido no se registra.
 */
export function pricingScene({ gsap, ScrollTrigger }: AnimationKit) {
  if (!document.querySelector('[data-pricing]')) return;
  const ease = 'power3.out';

  // Titular de la cabecera: se aleja y pierde algo de presencia al salir (scrub, sin rebote).
  const drift = document.querySelector('[data-pr-drift]');
  if (drift)
    gsap.to(drift, {
      yPercent: -18,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: drift.closest('header') ?? drift,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

  // Cascadas: cada grupo entra al llegar; los checks de sus elementos se dibujan a la vez.
  document.querySelectorAll<HTMLElement>('[data-pr-stagger]').forEach((group) => {
    const items = Array.from(group.children);
    const checks = group.querySelectorAll('[data-pr-check]');
    gsap.set(checks, { strokeDasharray: 1, strokeDashoffset: 1 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
    tl.fromTo(
      items,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease },
      0,
    );
    if (checks.length)
      tl.to(
        checks,
        { strokeDashoffset: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
        0.15,
      );
  });

  // Precios: cuentan desde un 60 % de su valor (sin parpadeos; el valor final queda en el DOM).
  document.querySelectorAll<HTMLElement>('.nb-pk .t-price').forEach((price) => {
    const nodes = price.querySelectorAll<HTMLElement>('[data-cc]');
    const targets = nodes.length ? Array.from(nodes) : [price];
    targets.forEach((node) => {
      const final = node.textContent ?? '';
      const value = Number(final.replace(/\D/g, ''));
      if (!value) return;
      const state = { v: value * 0.6 };
      gsap.to(state, {
        v: value,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: price, start: 'top 85%', once: true },
        onStart: () => {
          node.textContent = String(Math.round(state.v));
        },
        onUpdate: () => {
          node.textContent = String(Math.round(state.v / 10) * 10);
        },
        onComplete: () => {
          node.textContent = final;
        },
      });
    });
  });

  // Garantías: tablero primero y después el arco, como el símbolo de la marca.
  document.querySelectorAll<SVGElement>('[data-pr-draw]').forEach((svg) => {
    const [deck, arch] = Array.from(svg.querySelectorAll('path'));
    gsap.set([deck, arch], { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap
      .timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } })
      .to(deck, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
      .to(arch, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.35);
  });

  // «Aparte»: cada fila aparece y su filete se dibuja.
  document.querySelectorAll<HTMLElement>('[data-pr-row]').forEach((row, i) => {
    const rule = row.querySelector('[data-pr-rule]');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 90%', once: true },
      delay: (i % 4) * 0.05,
    });
    tl.fromTo(
      row.querySelectorAll('dt, dd'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease },
      0,
    );
    if (rule)
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.1);
  });

  // Cierre: la propuesta se posa, se escribe línea a línea, el precio cuenta y se firma.
  const doc = document.querySelector<HTMLElement>('[data-doc]');
  if (doc) {
    const rows = doc.querySelectorAll('[data-doc-row]');
    const rules = doc.querySelectorAll('[data-doc-rule]');
    const signature = doc.querySelector('[data-doc-signature]');
    const stamp = doc.querySelectorAll('[data-doc-stamp] > *');
    const amounts = Array.from(doc.querySelectorAll<HTMLElement>('[data-doc-amount] [data-cc]'));
    const amountNodes = amounts.length
      ? amounts
      : Array.from(doc.querySelectorAll<HTMLElement>('[data-doc-amount]'));
    gsap.set(stamp, { strokeDasharray: 1, strokeDashoffset: 1 });
    const tl = gsap.timeline({
      defaults: { ease },
      scrollTrigger: { trigger: doc, start: 'top 78%', once: true },
    });
    tl.fromTo(
      doc,
      { y: 80, rotation: -6, opacity: 0 },
      { y: 0, rotation: -1.5, opacity: 1, duration: 1.3, ease: 'expo.out' },
      0,
    )
      .fromTo(rows, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.14 }, 0.5)
      .fromTo(
        rules,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, stagger: 0.14, ease: 'power2.inOut' },
        0.55,
      );
    amountNodes.forEach((node) => {
      const final = node.textContent ?? '';
      const value = Number(final.replace(/\D/g, ''));
      if (!value) return;
      const state = { v: 0 };
      tl.to(
        state,
        {
          v: value,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            node.textContent = String(Math.round(state.v / 10) * 10);
          },
          onComplete: () => {
            node.textContent = final;
          },
        },
        1.2,
      );
    });
    if (signature)
      tl.fromTo(
        signature,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power2.inOut' },
        1.9,
      );
    tl.to(stamp, { strokeDashoffset: 0, duration: 0.6, stagger: 0.12, ease: 'power2.inOut' }, 2.6);
  }

  ScrollTrigger.refresh();
}
