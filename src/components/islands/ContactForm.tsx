import { useEffect, useId, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import type { Messages } from '../../i18n/es';
import {
  companyTypes,
  contactSchema,
  type ContactData,
  type ContactErrorKey,
} from '../../lib/contact/schema';
import DemoNotice from './DemoNotice';

type Strings = Messages['form'];

interface Props {
  s: Strings;
  demo: Messages['demo'];
  privacyHref: string;
  thanksHref: string;
}

/** Zod resolver for React Hook Form without extra dependencies: each error carries its key. */
const resolver: Resolver<ContactData> = async (values) => {
  const r = contactSchema.safeParse(values);
  if (r.success) return { values: r.data, errors: {} };
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of r.error.issues) {
    const field = String(issue.path[0]);
    errors[field] ??= { type: issue.code, message: issue.message };
  }
  return { values: {}, errors: errors as never };
};

export default function ContactForm({ s, demo, privacyHref, thanksHref }: Props) {
  const id = useId();
  // Fictional site (portfolio): nothing is sent; with valid data the notice opens.
  const [demoOpen, setDemoOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<ContactData>({
    resolver,
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', message: '', privacy: false as never },
  });

  // A question coming from Resources (`?mensaje=…`) is prefilled in the message.
  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get('mensaje');
    if (message) setValue('message', message.slice(0, 600));
  }, [setValue]);

  const onSubmit = handleSubmit(
    () => setDemoOpen(true),
    () => {
      // With errors, focus moves to the first flagged field (RHF does this) and the summary is announced.
    },
  );

  const err = (field: keyof ContactData) => {
    const key = errors[field]?.message as ContactErrorKey | undefined;
    return key ? s.errors[key] : undefined;
  };
  const fieldProps = (field: keyof ContactData) => ({
    id: `${id}-${field}`,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${id}-${field}-error` : undefined,
  });
  const ErrorText = ({ field }: { field: keyof ContactData }) =>
    err(field) ? (
      <p className="nb-form__error" id={`${id}-${field}-error`}>
        {err(field)}
      </p>
    ) : null;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form className="nb-form" onSubmit={onSubmit} noValidate>
      {submitCount > 0 && hasErrors && (
        <p className="nb-form__summary" role="alert">
          {s.summary}
        </p>
      )}

      <div className="nb-form__grid">
        <div className="nb-form__field">
          <label htmlFor={`${id}-name`}>{s.name}</label>
          <input type="text" autoComplete="name" {...fieldProps('name')} {...register('name')} />
          <ErrorText field="name" />
        </div>
        <div className="nb-form__field">
          <label htmlFor={`${id}-email`}>{s.email}</label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            {...fieldProps('email')}
            {...register('email')}
          />
          <ErrorText field="email" />
        </div>
        <div className="nb-form__field">
          <label htmlFor={`${id}-phone`}>
            {s.phone} <span className="nb-form__optional">({s.optional})</span>
          </label>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            {...fieldProps('phone')}
            {...register('phone')}
          />
          <ErrorText field="phone" />
        </div>
        <div className="nb-form__field">
          <label htmlFor={`${id}-company`}>{s.company}</label>
          <select {...fieldProps('company')} {...register('company')} defaultValue="">
            <option value="" disabled>
              {s.companyPlaceholder}
            </option>
            {companyTypes.map((c) => (
              <option key={c} value={c}>
                {s.companyTypes[c]}
              </option>
            ))}
          </select>
          <ErrorText field="company" />
        </div>
      </div>

      <div className="nb-form__field">
        <label htmlFor={`${id}-message`}>{s.message}</label>
        <p className="nb-form__hint" id={`${id}-message-hint`}>
          {s.messageHint}
        </p>
        <textarea
          rows={5}
          {...fieldProps('message')}
          aria-describedby={[`${id}-message-hint`, errors.message && `${id}-message-error`]
            .filter(Boolean)
            .join(' ')}
          {...register('message')}
        />
        <ErrorText field="message" />
      </div>

      <div className="nb-form__field">
        <label className="nb-form__check">
          <input type="checkbox" {...fieldProps('privacy')} {...register('privacy')} />
          <span>
            {s.privacyBefore} <a href={privacyHref}>{s.privacyLink}</a> {s.privacyAfter}
          </span>
        </label>
        <ErrorText field="privacy" />
      </div>

      <button type="submit" className="nb-form__submit" disabled={isSubmitting}>
        {isSubmitting ? s.sending : s.submit}
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M6 18L17.25 6.75M8.25 6.75H17.25V15.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      <DemoNotice
        s={demo}
        kind="form"
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        nextHref={thanksHref}
      />
    </form>
  );
}
