import { useEffect, useId, useState } from 'react';
import type { Messages } from '../../i18n/es';
import DemoNotice from './DemoNotice';

type Strings = Messages['booking'];

interface Props {
  s: Strings;
  demo: Messages['demo'];
  /** BCP 47 tag for dates ("es", "de-CH"…). */
  intl: string;
  thanksHref: string;
  /** Cal.com link ("team/20-min-call"). Without it, a demo calendar is shown. */
  calLink?: string;
}

const SLOTS = ['09:00', '09:30', '10:30', '11:00', '14:00', '15:00', '16:30'];
const pad = (n: number) => String(n).padStart(2, '0');
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The next `n` working days starting tomorrow (Monday to Friday). */
function nextWorkingDays(n: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
  }
  return days;
}

/** Demo availability, stable per day: some slots are already taken. */
const freeSlots = (day: Date) => SLOTS.filter((_, i) => (day.getDate() + i * 3) % 4 !== 0);

function DemoScheduler({ s, demo, intl, thanksHref }: Omit<Props, 'calLink'>) {
  const id = useId();
  // Fictional site (portfolio): nothing is booked; confirming opens the notice.
  const [demoOpen, setDemoOpen] = useState(false);
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState<string>('');
  const [time, setTime] = useState<string>('');

  // Dates depend on today, so they are computed in the browser, not at build time.
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
        setDemoOpen(true);
      }}
    >
      <fieldset className="nb-book__set">
        <legend className="nb-book__legend">{s.day}</legend>
        <div className="nb-book__days">
          {/* Until the dates are known in the browser, five empty slots hold the row in place. */}
          {days.length === 0 &&
            [0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="nb-book__day nb-book__day--pending" aria-hidden="true" />
            ))}
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

      <DemoNotice
        s={demo}
        kind="booking"
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        nextHref={`${thanksHref}?fecha=${day}&hora=${time}`}
      />
    </form>
  );
}

/** Booking calendar: Cal.com only after consent; without a link, a demo. */
export default function BookingEmbed({ s, demo, intl, thanksHref, calLink }: Props) {
  const [consent, setConsent] = useState(false);
  if (!calLink) return <DemoScheduler s={s} demo={demo} intl={intl} thanksHref={thanksHref} />;
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
