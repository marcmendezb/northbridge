import type { ImageMetadata } from 'astro';
import gmbh from '../assets/img/about/resources/nb-blog-gmbh-01.jpeg';
import calendario from '../assets/img/about/resources/nb-blog-calendario-01.jpeg';
import errores from '../assets/img/about/resources/nb-blog-errores-startups-01.jpeg';

/** Portada de cada guía por su tema (la misma en todas las versiones por país). */
export const topicCovers: Record<string, ImageMetadata> = {
  constitucion: gmbh,
  calendario,
  errores,
};
