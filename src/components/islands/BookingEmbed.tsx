import { useEffect, useId, useState } from 'react';
import type { Messages } from '../../i18n/es';

type Strings = Messages['booking'];

interface Props {
  s: Strings;
  /** Etiqueta BCP 47 para las fechas («es», «de-CH»…). */
  intl: string;
  thanksHref: string;
  /** Enlace de Cal.com («equipo/consulta-20-min»). Sin él, calendario de demostración. */
  calLink?: string;
}

const SLOTS = ['09:00', '09:30', '10:30', '11:00', '14:00', '15:00', '16:30'];
const pad = (n: number) => String(n).padStart(2, '0');
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Los próximos `n` días laborables a partir de mañana (lunes a viernes). */
function nextWorkingDays(n: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
  }
  return days;
}

/** Disponibilidad de demostración, estable por día: algunas horas ya están ocupadas. */
const freeSlots = (day: Date) => SLOTS.filter((_, i) => (day.getDate() + i * 3) % 4 !== 0);

function DemoScheduler({ s, intl, thanksHref }: Omit<Props, 'calLink'>) {
  const id = useId();
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState<string>('');
  const [time, setTime] = useState<string>('');

  // Las fechas dependen del día de hoy: se calculan en el navegador, no al compilar.
  useEffect(() => setDays(nextWorkingDays(5)), []);

  const selectedDay = days.find((d) => isoDay(d) === day);
  const weekday = new Intl.DateTimeFormat(intl, { weekday: 'short' });
  const dayNum = new Intl.DateTimeFormat(intl, { day: 'numeric', month: 'short' });
  const long = new Intl.DateTimeFormat(intl, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <form
      className="nb-book"
      onSubmit={(e) => {
        e.preventDefault();
        if (!day || !time) return;
        window.location.assign(`${thanksHref}?fecha=${day}&hora=${time}`);
      }}
    >
      <fieldset className="nb-book__set">
        <legend className="nb-book__legend">{s.day}</legend>
        <div className="nb-book__days">
          {days.map((d) => (
            <label key={isoDay(d)} className="nb-book__day">
              <input
                type="radio"
                name={`${id}-day`}
                value={isoDay(d)}
                checked={day === isoDay(d)}
                onChange={() => {
                  setDay(isoDay(d));
                  setTime('');
                }}
              />
              <span className="nb-book__weekday">{weekday.format(d)}</span>
              <span className="nb-book__date">{dayNum.format(d)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="nb-book__set" disabled={!selectedDay}>
        <legend className="nb-book__legend">{s.time}</legend>
        <div className="nb-book__times">
          {(selectedDay ? freeSlots(selectedDay) : SLOTS).map((slot) => (
            <label key={slot} className="nb-book__time">
              <input
                type="radio"
                name={`${id}-time`}
                value={slot}
                checked={time === slot}
                onChange={() => setTime(slot)}
              />
              <span>{slot}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="nb-book__status" aria-live="polite">
        {selectedDay && time
          ? s.selected.replace('{date}', long.format(selectedDay)).replace('{time}', time)
          : s.pick}
      </p>
      <button type="submit" className="nb-book__confirm" disabled={!day || !time}>
        {s.confirm}
      </button>
      <p className="nb-book__demo">{s.demoNote}</p>
    </form>
  );
}

/** Calendario de reservas: Cal.com solo tras consentimiento; si no hay enlace, demostración. */
export default function BookingEmbed({ s, intl, thanksHref, calLink }: Props) {
  const [consent, setConsent] = useState(false);
  if (!calLink) return <DemoScheduler s={s} intl={intl} thanksHref={thanksHref} />;
  if (!consent)
    return (
      <div className="nb-book nb-book--consent">
        <p className="nb-book__consent-title">{s.consentTitle}</p>
        <p className="nb-book__consent-text">{s.consentText}</p>
        <button type="button" className="nb-book__confirm" onClick={() => setConsent(true)}>
          {s.consentButton}
        </button>
      </div>
    );
  return (
    <iframe
      className="nb-book__frame"
      title={s.calendarFrame}
      src={`https://cal.com/${calLink}?embed=true&theme=light`}
      loading="lazy"
    />
  );
}
