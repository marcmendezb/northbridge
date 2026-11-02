import { defaultLocale, localizedPath, t, type Locale } from '../i18n';

/** Company details (fictional company). */
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
  bookingPath: '/consulta-gratuita',
} as const;

export const serviceIcons = {
  'contabilidad-y-cierres': 'contabilidad',
  'iva-y-fiscalidad': 'iva',
  'nominas-y-seguros-sociales': 'nominas',
  'constitucion-de-empresas': 'constitucion',
  'asesoria-para-startups': 'startups',
} as const;

export const getMainNav = (locale: Locale = defaultLocale) =>
  [
    { href: localizedPath('/servicios', locale), label: t('nav.services', locale) },
    { href: localizedPath('/precios', locale), label: t('nav.prices', locale) },
    { href: localizedPath('/nosotros', locale), label: t('nav.about', locale) },
    { href: localizedPath('/recursos', locale), label: t('nav.resources', locale) },
    { href: localizedPath('/contacto', locale), label: t('nav.contact', locale) },
  ] as const;

export const getBookingCta = (locale: Locale = defaultLocale) => ({
  href: localizedPath(site.bookingPath, locale),
  label: t('cta.book', locale),
});

const serviceLabelKeys = {
  'contabilidad-y-cierres': 'servicesList.contabilidad',
  'iva-y-fiscalidad': 'servicesList.iva',
  'nominas-y-seguros-sociales': 'servicesList.nominas',
  'constitucion-de-empresas': 'servicesList.constitucion',
  'asesoria-para-startups': 'servicesList.startups',
} as const;

export const getServiceLinks = (locale: Locale = defaultLocale) =>
  (Object.keys(serviceLabelKeys) as (keyof typeof serviceLabelKeys)[]).map((key) => ({
    key,
    href: localizedPath(`/servicios/${key}`, locale),
    icon: serviceIcons[key],
    label: t(serviceLabelKeys[key], locale),
  }));

export const getLegalLinks = (locale: Locale = defaultLocale) =>
  [
    { href: localizedPath('/privacidad', locale), label: t('footer.privacy', locale) },
    { href: localizedPath('/aviso-legal', locale), label: t('footer.legalNotice', locale) },
    { href: localizedPath('/cookies', locale), label: t('footer.cookies', locale) },
  ] as const;
