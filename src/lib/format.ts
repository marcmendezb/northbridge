const NNBSP = ' ';

/** 4380 → «4 380» con espacio fino no separable como separador de miles. */
export function formatNumber(value: number): string {
  const [int, dec] = Math.abs(value).toString().split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  return `${value < 0 ? '−' : ''}${grouped}${dec ? `,${dec}` : ''}`;
}

/** 4380 → «4 380 CHF» (espacio fino no separable entre cifra y moneda). */
export function formatCHF(value: number): string {
  return `${formatNumber(value)}${NNBSP}CHF`;
}

/** Fecha larga en español: «30 de noviembre de 2026». */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Zurich',
  }).format(d);
}
