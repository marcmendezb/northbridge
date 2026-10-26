import type { ReactNode } from 'react';
import { COUNTRIES, type Country } from '../../lib/country';

/**
 * Versión React de `byCountry` (src/lib/country.ts): una variante por cada resultado distinto,
 * en `<span data-cc>`; el CSS global muestra solo la del país activo, sin esperar a hidratar.
 */
export function ByCountry({
  render,
  keyOf = (node) => String(node),
}: {
  render: (country: Country) => ReactNode;
  /** Clave para agrupar países con el mismo resultado (por defecto, el texto). */
  keyOf?: (node: ReactNode, country: Country) => string;
}) {
  const groups = new Map<string, { node: ReactNode; countries: Country[] }>();
  for (const c of COUNTRIES) {
    const node = render(c);
    const key = keyOf(node, c);
    const group = groups.get(key);
    if (group) group.countries.push(c);
    else groups.set(key, { node, countries: [c] });
  }
  if (groups.size === 1) return <>{[...groups.values()][0].node}</>;
  return (
    <>
      {[...groups.entries()].map(([key, g]) => (
        <span key={key} data-cc={g.countries.join(' ')}>
          {g.node}
        </span>
      ))}
    </>
  );
}
