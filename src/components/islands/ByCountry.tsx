import type { ReactNode } from 'react';
import { COUNTRIES, type Country } from '../../lib/country';

/**
 * React version of `byCountry` (src/lib/country.ts): one variant per distinct result,
 * in `<span data-cc>`; global CSS shows only the active country, without waiting for hydration.
 */
export function ByCountry({
  render,
  keyOf = (node) => String(node),
}: {
  render: (country: Country) => ReactNode;
  /** Key used to group countries with the same result (defaults to the text). */
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
