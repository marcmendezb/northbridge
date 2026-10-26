/** Utilidades WCAG 2.x. Los colores se leen de tokens.css: no hay hex duplicados. */
import tokensCss from '../styles/tokens.css?raw';

export function readTokens(css: string = tokensCss): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g))
    out[m[1]] = m[2].toLowerCase();
  return out;
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  );
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Parejas del brand book (docs/02-marca.md · Reglas de contraste). */
export const contrastPairs = [
  { fg: 'navy-800', bg: 'piedra-50', use: 'Texto principal', min: 4.5 },
  { fg: 'white', bg: 'navy-800', use: 'Texto invertido, botón primario', min: 4.5 },
  { fg: 'piedra-700', bg: 'piedra-100', use: 'Texto secundario', min: 4.5 },
  { fg: 'piedra-600', bg: 'white', use: 'Pies de foto y metadatos', min: 4.5 },
  { fg: 'salvia-600', bg: 'white', use: 'Etiquetas y enlaces activos', min: 4.5 },
  { fg: 'navy-800', bg: 'salvia-400', use: 'Texto sobre bloque de acento', min: 4.5 },
  { fg: 'salvia-300', bg: 'navy-800', use: 'Acento sobre fondo oscuro', min: 4.5 },
  { fg: 'piedra-500', bg: 'piedra-50', use: 'Solo texto grande o desactivado', min: 3 },
] as const;

export const forbiddenPairs = [
  { fg: 'white', bg: 'salvia-400', use: 'Blanco sobre Salvia 400: no usar para texto' },
] as const;
