import type { Locale } from '../../i18n/locales';
import type { DeadlineRule } from '../../lib/fiscal/deadlines';

/** Text in the site's five languages. */
export type Text = Record<Locale, string>;

/** A deadline in the tax calendar of an SME whose financial year is the calendar year. */
export interface FiscalEvent {
  id: string;
  /** Month (1–12) it falls due, for sorting and for "coming up". */
  month: number;
  /** Short name for the yearly chart ("Q4", "Corporate tax"). */
  short?: Text;
  when: Text;
  what: Text;
  need: Text;
  /** Legal rule used to compute the exact date each year (src/lib/fiscal/deadlines.ts). */
  rule?: DeadlineRule;
  /** Extension of another deadline (id): drawn as its continuation. */
  extends?: string;
  /** Minor recurring deadline (instalments): a small mark without a label in the chart. */
  minor?: boolean;
  /** Chart lane (inferred from the id if missing). */
  cat?: 'vat' | 'tax' | 'pay' | 'payroll';
  /** Deadline that repeats every month: list only, without a specific date. */
  recurring?: boolean;
}
