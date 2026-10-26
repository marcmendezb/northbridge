import type { gsap as GsapCore } from 'gsap';
import type { ScrollTrigger as ScrollTriggerCore } from 'gsap/ScrollTrigger';

export type Gsap = typeof GsapCore;
export type ScrollTriggerPlugin = typeof ScrollTriggerCore;

export interface AnimationKit {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerPlugin;
}
