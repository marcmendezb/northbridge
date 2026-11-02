import Lenis from 'lenis';

let instance: Lenis | undefined;

/** Smooth scrolling with moderate inertia. Only starts if the user allows motion. */
export function startSmoothScroll(): Lenis {
  if (instance) return instance;
  instance = new Lenis({
    // Exponential ease-out: responsive start and soft finish, without a rubbery feel.
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
  // An open mobile menu locks background scrolling.
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
