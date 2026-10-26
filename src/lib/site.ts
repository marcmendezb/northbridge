import { t, localizedPath } from '../i18n';

/** Datos de empresa. Provisionales (empresa ficticia): docs/01-proyecto.md. */
export const site = {
  name: 'Northbridge Advisory',
  legalName: 'Northbridge Advisory',
  url: 'https://northbridge.ch',
  founded: 2014,
  email: 'hola@northbridge.ch',
  phone: '+41 44 512 30 00',
  phoneDirect: '+41 44 512 30 18',
  address: { street: 'Seefeldstrasse 45', postalCode: '8008', city: 'Zürich', country: 'CH' },
  registry: 'CHE-000.000.000 MWST',
  hours: 'Lunes a viernes, 08:30–17:30',
  bookingPath: '/consulta-gratuita',
} as const;

export const mainNav = [
  { href: localizedPath('/servicios'), label: t('nav.services') },
  { href: localizedPath('/precios'), label: t('nav.prices') },
  { href: localizedPath('/nosotros'), label: t('nav.about') },
  { href: localizedPath('/recursos'), label: t('nav.resources') },
  { href: localizedPath('/contacto'), label: t('nav.contact') },
] as const;

export const bookingCta = { href: localizedPath(site.bookingPath), label: t('cta.book') };

export const serviceLinks = [
  {
    href: '/servicios/contabilidad-y-cierres',
    icon: 'contabilidad' as const,
    label: t('servicesList.contabilidad'),
  },
  { href: '/servicios/iva-y-fiscalidad', icon: 'iva' as const, label: t('servicesList.iva') },
  {
    href: '/servicios/nominas-y-seguros-sociales',
    icon: 'nominas' as const,
    label: t('servicesList.nominas'),
  },
  {
    href: '/servicios/constitucion-de-empresas',
    icon: 'constitucion' as const,
    label: t('servicesList.constitucion'),
  },
  {
    href: '/servicios/asesoria-para-startups',
    icon: 'startups' as const,
    label: t('servicesList.startups'),
  },
].map((l) => ({ ...l, href: localizedPath(l.href) }));

export const resourceLinks = [
  { href: '/recursos/como-constituir-una-gmbh-en-zurich', label: t('resourcesList.gmbh') },
  { href: '/recursos/calendario-fiscal-para-pymes', label: t('resourcesList.calendar') },
  { href: '/recursos/5-errores-contables-de-las-startups', label: t('resourcesList.errors') },
].map((l) => ({ ...l, href: localizedPath(l.href) }));

export const legalLinks = [
  { href: localizedPath('/privacidad'), label: t('footer.privacy') },
  { href: localizedPath('/aviso-legal'), label: t('footer.legalNotice') },
  { href: localizedPath('/cookies'), label: t('footer.cookies') },
] as const;
