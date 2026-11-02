import { useEffect, useId, useRef } from 'react';
import type { Messages } from '../../i18n/es';

interface Props {
  s: Messages['demo'];
  /** What the user tried to send: changes the second sentence. */
  kind: 'form' | 'booking';
  open: boolean;
  onClose: () => void;
  /** Confirmation page, to see how the journey would continue. */
  nextHref: string;
}

/**
 * Fictional site notice (portfolio project): nothing is sent or stored.
 * Native `<dialog>`: traps focus, closes with Esc and returns focus to the submit button.
 */
export default function DemoNotice({ s, kind, open, onClose, nextHref }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="nb-demo"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-text`}
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (outside the panel) also closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="nb-demo__panel">
        <p className="nb-demo__label">{s.label}</p>
        <h2 className="nb-demo__title" id={`${id}-title`}>
          {s.title}
        </h2>
        <div id={`${id}-text`}>
          <p className="nb-demo__text">{s.text}</p>
          <p className="nb-demo__text">{kind === 'form' ? s.form : s.booking}</p>
        </div>
        <div className="nb-demo__actions">
          <button type="button" className="nb-demo__close" onClick={onClose} autoFocus>
            {s.close}
          </button>
          <a className="nb-demo__next" href={nextHref}>
            {s.next}
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M6 18L17.25 6.75M8.25 6.75H17.25V15.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </a>
        </div>
      </div>
    </dialog>
  );
}
