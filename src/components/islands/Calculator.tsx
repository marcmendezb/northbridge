import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import type { Messages } from '../../i18n/es';
import type { Locale } from '../../i18n/locales';
import { COUNTRIES, CURRENCY_BY_COUNTRY, LEGAL_FORMS } from '../../lib/country';
import { formatNumber } from '../../lib/format';
import {
  calculate,
  invoiceFee,
  payrollFee,
  type CalculatorInput,
  type CompanyType,
} from '../../lib/pricing/calculate';
import { BASE, EXCHANGE_RATES, PACKAGES, type Currency } from '../../lib/pricing/config';
import { CURRENCY_SYMBOL, convert } from '../../lib/pricing/currency';
import { ByCountry } from './ByCountry';

type Strings = Messages['calculator'];

interface Props {
  locale: Locale;
  s: Strings;
  /** «Precios sin IVA» y la unidad «{currency}/mes» del diccionario. */
  vatNote: string;
  perMonth: string;
  note: string;
  bookLabel: string;
  /** Etiqueta corta del paquete recomendado («Recomendado»). */
  recommendedTag: string;
  bookHref: string;
  pricingHref: string;
}

const TYPES: CompanyType[] = ['autonomo', 'startup', 'gmbh', 'ag'];
const MAX_INVOICES = 200;
const MAX_EMPLOYEES = 50;
const DEFAULT: CalculatorInput = { type: 'gmbh', invoices: 60, employees: 5 };
const CURRENCIES = [...new Set(COUNTRIES.map((c) => CURRENCY_BY_COUNTRY[c]))] as Currency[];
const countriesOf = (currency: Currency) =>
  COUNTRIES.filter((c) => CURRENCY_BY_COUNTRY[c] === currency).join(' ');

const fill = (text: string, vars: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
const clamp = (n: number, max: number) => Math.min(max, Math.max(0, Math.round(n) || 0));

/** Estado desde la URL (`?tipo=gmbh&facturas=60&empleados=5`); `facturas=mas` = más de 200. */
function readUrl(): { input: CalculatorInput; more: boolean } | null {
  const q = new URLSearchParams(window.location.search);
  if (!q.has('tipo') && !q.has('facturas') && !q.has('empleados')) return null;
  const tipo = q.get('tipo') as CompanyType;
  const facturas = q.get('facturas');
  return {
    input: {
      type: TYPES.includes(tipo) ? tipo : DEFAULT.type,
      invoices: facturas && facturas !== 'mas' ? clamp(Number(facturas), MAX_INVOICES) : 0,
      employees: clamp(Number(q.get('empleados') ?? 0), MAX_EMPLOYEES),
    },
    more: facturas === 'mas',
  };
}
const toQuery = (input: CalculatorInput, more: boolean) =>
  `?tipo=${input.type}&facturas=${more ? 'mas' : input.invoices}&empleados=${input.employees}`;

/** Cifra que «rueda» hasta su nuevo valor (0,6 s, sin rebote); inmediata con movimiento reducido. */
function Rolling({ value, locale }: { value: number; locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = formatNumber(value, locale);
      shown.current = value;
      return;
    }
    const controls = animate(shown.current, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        shown.current = v;
        node.textContent = formatNumber(Math.round(v), locale);
      },
    });
    return () => controls.stop();
  }, [value, locale, reduce]);
  return <span ref={ref}>{formatNumber(value, locale)}</span>;
}

/** Importe de una línea del desglose: la conversión exacta, redondeada a la unidad. */
const lineAmount = (eur: number, currency: Currency) =>
  currency === 'EUR' ? eur : Math.round(eur * EXCHANGE_RATES[currency]);

export default function Calculator({
  locale,
  s,
  vatNote,
  perMonth,
  note,
  bookLabel,
  recommendedTag,
  bookHref,
  pricingHref,
}: Props) {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT);
  const [more, setMore] = useState(false);
  const [announce, setAnnounce] = useState('');
  const id = useId();
  /** Solo se escribe en la URL y se anuncia el resultado cuando la persona cambia algo. */
  const touched = useRef(false);

  // Al hidratar: respuestas de la URL (si las hay).
  useEffect(() => {
    const fromUrl = readUrl();
    if (fromUrl) {
      setInput(fromUrl.input);
      setMore(fromUrl.more);
    }
  }, []);

  const result = useMemo(
    () => (more ? ({ custom: true } as const) : calculate(input)),
    [input, more],
  );

  // URL compartible y anuncio para lectores de pantalla (con 400 ms de espera, sin saturar).
  useEffect(() => {
    if (!touched.current) return;
    window.history.replaceState(null, '', toQuery(input, more));
    const country = (document.documentElement.dataset.country ?? 'CH') as keyof typeof LEGAL_FORMS;
    const currency = CURRENCY_BY_COUNTRY[country] ?? 'CHF';
    const timer = window.setTimeout(() => {
      if (result.custom) return setAnnounce(s.custom);
      const [min, max] = result.range.map((v) => convert(v, currency));
      const unit = fill(perMonth, { currency: CURRENCY_SYMBOL[currency] });
      setAnnounce(
        fill(s.live, {
          range: `${fill(s.between, { min: formatNumber(min, locale), max: formatNumber(max, locale) })} ${unit}`,
          name: PACKAGES[result.package].name,
        }),
      );
    }, 400);
    return () => window.clearTimeout(timer);
  }, [input, more, result, s, perMonth, locale]);

  const set = (patch: Partial<CalculatorInput>) => {
    touched.current = true;
    setInput((prev) => ({ ...prev, ...patch }));
  };
  const onNumber =
    (key: 'invoices' | 'employees', max: number) => (e: ChangeEvent<HTMLInputElement>) =>
      set({ [key]: clamp(Number(e.target.value), max) });

  const typeLabel = (type: CompanyType) =>
    type === 'gmbh' || type === 'ag' ? (
      <ByCountry render={(c) => fill(s.types[type], { form: LEGAL_FORMS[c][type] })} />
    ) : (
      s.types[type]
    );

  const unit = (
    <ByCountry
      render={(c) => fill(perMonth, { currency: CURRENCY_SYMBOL[CURRENCY_BY_COUNTRY[c]] })}
    />
  );
  const money = (eur: number, line = false) => (
    <>
      {CURRENCIES.map((cur) => (
        <span key={cur} data-cc={countriesOf(cur)}>
          {formatNumber(line ? lineAmount(eur, cur) : convert(eur, cur), locale)}
          {' '}
          {CURRENCY_SYMBOL[cur]}
        </span>
      ))}
    </>
  );

  const [baseBefore, baseAfter = ''] = s.lineBase.split('{type}');
  const fee = { invoices: invoiceFee(input.invoices), payroll: payrollFee(input.employees) };
  const floorGap = result.custom ? 0 : result.price - result.raw;
  const bookWithContext = `${bookHref}${toQuery(input, more)}`;

  return (
    <div className="nb-calcx">
      <form className="nb-calcx__controls" onSubmit={(e) => e.preventDefault()} noValidate>
        <fieldset className="nb-calcx__field">
          <legend className="nb-calcx__legend">{s.type}</legend>
          <div className="nb-calcx__types">
            {TYPES.map((type) => (
              <label key={type} className="nb-calcx__type">
                <input
                  type="radio"
                  name={`${id}-type`}
                  value={type}
                  checked={input.type === type}
                  onChange={() => set({ type })}
                />
                <span className="nb-calcx__type-name">{typeLabel(type)}</span>
                <span className="nb-calcx__type-hint">{s.typeHints[type]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="nb-calcx__field">
          <div className="nb-calcx__row">
            <label className="nb-calcx__legend" htmlFor={`${id}-inv`}>
              {s.invoices}
            </label>
            <input
              className="nb-calcx__num"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_INVOICES}
              value={input.invoices}
              disabled={more}
              onChange={onNumber('invoices', MAX_INVOICES)}
              aria-label={s.invoices}
            />
          </div>
          <p className="nb-calcx__help" id={`${id}-inv-help`}>
            {s.invoicesHelp}
          </p>
          <input
            id={`${id}-inv`}
            className="nb-calcx__range"
            type="range"
            min={0}
            max={MAX_INVOICES}
            step={1}
            value={input.invoices}
            disabled={more}
            onChange={onNumber('invoices', MAX_INVOICES)}
            aria-valuetext={fill(s.invoicesValue, { n: input.invoices })}
            aria-describedby={`${id}-inv-help`}
            style={{ '--v': input.invoices / MAX_INVOICES } as React.CSSProperties}
          />
          <label className="nb-calcx__check">
            <input
              type="checkbox"
              checked={more}
              onChange={(e) => {
                touched.current = true;
                setMore(e.target.checked);
              }}
            />
            <span>{s.more200}</span>
          </label>
        </div>

        <div className="nb-calcx__field">
          <div className="nb-calcx__row">
            <label className="nb-calcx__legend" htmlFor={`${id}-emp`}>
              {s.employees}
            </label>
            <input
              className="nb-calcx__num"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_EMPLOYEES}
              value={input.employees}
              onChange={onNumber('employees', MAX_EMPLOYEES)}
              aria-label={s.employees}
            />
          </div>
          <p className="nb-calcx__help" id={`${id}-emp-help`}>
            {s.employeesHelp}
          </p>
          <input
            id={`${id}-emp`}
            className="nb-calcx__range"
            type="range"
            min={0}
            max={MAX_EMPLOYEES}
            step={1}
            value={input.employees}
            onChange={onNumber('employees', MAX_EMPLOYEES)}
            aria-valuetext={fill(s.employeesValue, { n: input.employees })}
            aria-describedby={`${id}-emp-help`}
            style={{ '--v': input.employees / MAX_EMPLOYEES } as React.CSSProperties}
          />
        </div>
        <p className="nb-calcx__share">{s.shareNote}</p>
      </form>

      <section className="nb-calcx__result" aria-labelledby={`${id}-result`} id="resultado">
        <p className="nb-calcx__result-label" id={`${id}-result`}>
          {s.result}
        </p>
        {result.custom ? (
          <div className="nb-calcx__custom">
            <p className="nb-calcx__custom-text">{s.custom}</p>
            <a className="nb-calcx__cta" href={bookWithContext}>
              {s.customCta}
            </a>
          </div>
        ) : (
          <>
            <p className="nb-calcx__price">
              <span className="nb-calcx__amount">
                {CURRENCIES.map((cur) => (
                  <span key={cur} data-cc={countriesOf(cur)}>
                    <Rolling value={convert(result.range[0], cur)} locale={locale} />
                    <span className="nb-calcx__dash">–</span>
                    <Rolling value={convert(result.range[1], cur)} locale={locale} />
                  </span>
                ))}
              </span>
              <span className="nb-calcx__unit">{unit}</span>
            </p>
            <p className="nb-calcx__vat">{vatNote}</p>

            <div className="nb-calcx__packages" role="list" aria-label={s.recommended}>
              {(Object.keys(PACKAGES) as (keyof typeof PACKAGES)[]).map((p) => (
                <span
                  key={p}
                  role="listitem"
                  className="nb-calcx__pkg"
                  data-active={result.package === p ? '' : undefined}
                  aria-current={result.package === p ? 'true' : undefined}
                >
                  {PACKAGES[p].name}
                  {result.package === p && (
                    <span className="nb-calcx__pkg-tag">{recommendedTag}</span>
                  )}
                </span>
              ))}
            </div>

            <dl className="nb-calcx__lines" aria-label={s.breakdown}>
              <div className="nb-calcx__line">
                <dt>
                  {baseBefore}
                  {typeLabel(input.type)}
                  {baseAfter}
                </dt>
                <dd>{money(BASE[input.type], true)}</dd>
              </div>
              {fee.invoices > 0 && (
                <div className="nb-calcx__line">
                  <dt>{s.lineInvoices}</dt>
                  <dd>{money(fee.invoices, true)}</dd>
                </div>
              )}
              {fee.payroll > 0 && (
                <div className="nb-calcx__line">
                  <dt>{fill(s.linePayroll, { n: input.employees })}</dt>
                  <dd>{money(fee.payroll, true)}</dd>
                </div>
              )}
              {floorGap > 0 && (
                <div className="nb-calcx__line">
                  <dt>{fill(s.lineFloor, { name: PACKAGES[result.package].name })}</dt>
                  <dd>+{money(floorGap, true)}</dd>
                </div>
              )}
              <div className="nb-calcx__line nb-calcx__line--total">
                <dt>{s.lineTotal}</dt>
                <dd>{money(result.price)}</dd>
              </div>
            </dl>
          </>
        )}
        <p className="nb-calcx__note">{note}</p>
        <div className="nb-calcx__actions">
          <a className="nb-calcx__cta" href={bookWithContext}>
            {bookLabel}
          </a>
          <a className="nb-calcx__link" href={pricingHref}>
            {s.seePackages}
          </a>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </section>

      {!result.custom && (
        <a className="nb-calcx__bar" href="#resultado" aria-hidden="true" tabIndex={-1}>
          <span className="nb-calcx__bar-price">
            {money(result.range[0])}–{money(result.range[1])}
          </span>
          <span className="nb-calcx__bar-pkg">{PACKAGES[result.package].name}</span>
        </a>
      )}
    </div>
  );
}
