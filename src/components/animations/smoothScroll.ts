import Lenis from 'lenis';

let instance: Lenis | undefined;

/** Scroll suave con inercia moderada. Se arranca solo si el usuario admite movimiento. */
export function startSmoothScroll(): Lenis {
  if (instance) return instance;
  instance = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.95,
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
