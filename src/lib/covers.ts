import type { ImageMetadata } from 'astro';
import gmbh from '../assets/img/about/resources/nb-blog-gmbh-01.jpeg';
import calendario from '../assets/img/about/resources/nb-blog-calendario-01.jpeg';
import errores from '../assets/img/about/resources/nb-blog-errores-startups-01.jpeg';

/** Portada de cada artículo, por su clave estable (nombre de archivo, igual en todos los idiomas). */
export const articleCovers: Record<string, ImageMetadata> = {
  'como-constituir-una-gmbh-en-zurich': gmbh,
  'calendario-fiscal-para-pymes': calendario,
  '5-errores-contables-de-las-startups': errores,
};
