import Lenis from 'lenis';

let instance: Lenis | undefined;

/** Scroll suave con inercia moderada. Se arranca solo si el usuario admite movimiento. */
export function startSmoothScroll(): Lenis {
  if (instance) return instance;
  instance = new Lenis({
    // Frenada exponencial (ease-out expo): arranque ágil y final suave, sin sensación de goma.
    duration: 1.25,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.9,
    smoothWheel: true,
    autoRaf: true,
    anchors: {
      offset: -(
        (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) ||
          96) + 16
      ),
    },
  });
  // El menú móvil abierto bloquea el scroll de fondo.
  window.addEventListener('nb:scroll-lock', (e) => {
    const locked = (e as CustomEvent<boolean>).detail;
    if (locked) instance?.stop();
    else instance?.start();
  });
  return instance;
}

export function getSmoothScroll(): Lenis | undefined {
  return instance;
}
