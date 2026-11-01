import { OFFICES } from '../data/offices';
import { localizedPath, t, type Locale } from '../i18n';
import { COUNTRIES } from './country';
import { CLOSE_MINUTES, OPEN_MINUTES } from './contact/office';
import { site } from './site';

const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** Imagen para compartir de cada idioma (`npm run og` la genera en public/og). */
export const ogImage = (locale: Locale, base: URL | string) => new URL(`/og/${locale}.png`, base);

/**
 * Datos estructurados de la empresa (schema.org `AccountingService`): la sede de Zúrich y una
 * oficina por país (`department`), con el horario de la web. Empresa ficticia (docs/01).
 */
export function organizationJsonLd(locale: Locale, base: URL | string) {
  const url = new URL(localizedPath('/', locale), base).toString();
  const office = (country: (typeof COUNTRIES)[number]) => ({
    '@type': 'PostalAddress',
    streetAddress: OFFICES[country].street,
    postalCode: OFFICES[country].postalCode,
    addressLocality: OFFICES[country].city,
    addressCountry: country,
  });
  const region = new Intl.DisplayNames([locale], { type: 'region' });
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${new URL('/', base)}#organization`,
    name: site.name,
    description: t('brand.descriptor', locale),
    slogan: t('brand.claim', locale),
    url,
    logo: new URL('/brand/logo-header.png', base).toString(),
    image: ogImage(locale, base).toString(),
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded),
    address: office('CH'),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: hhmm(OPEN_MINUTES),
      closes: hhmm(CLOSE_MINUTES),
    },
    areaServed: COUNTRIES.map((c) => ({ '@type': 'Country', name: region.of(c) })),
    department: COUNTRIES.filter((c) => c !== 'CH').map((c) => ({
      '@type': 'AccountingService',
      name: `${site.name} ${OFFICES[c].city}`,
      address: office(c),
    })),
  };
}
