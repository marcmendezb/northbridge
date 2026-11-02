# Architecture

A quick tour of how the site is put together, for anyone reading the code.

## Rendering

Astro builds every page to static HTML at build time. There is no server: the output in `dist/` is plain files on Cloudflare Pages.

React is used only for the parts that need state in the browser, as Astro islands:

- `Calculator.tsx`, the price calculator
- `ContactForm.tsx`, the contact form (React Hook Form and Zod)
- `BookingEmbed.tsx`, the demo booking calendar (or Cal.com, only after consent)

Both forms open `DemoNotice.tsx`, a native `<dialog>` that explains nothing was sent, before linking to the confirmation page.

Islands hydrate with `client:visible`, so their JavaScript loads only when they scroll into view. Everything else is HTML and CSS, plus small inline scripts where a page needs a little behaviour (dates, the country switch, the countdown).

## Routing and languages

There is one route file, `src/pages/[...path].astro`. It maps every URL to a view in `src/views/`.

- Spanish is the default language and has no prefix (`/servicios/iva-y-fiscalidad`). The other languages are prefixed and their slugs are translated (`/de/leistungen/mwst-und-steuern`). The slug table lives in `src/i18n/routes.ts`.
- UI strings are in `src/i18n/{es,en,de,fr,it}.ts`. The Spanish file defines the shape and the others are type-checked against it, so a missing key fails the build.
- Every page links its four translations with `hreflang`, and the sitemap is split by language.

## Countries

Country and language are independent. The country decides currency, legal forms, office, tax calendar and some of the content.

- The country is stored in `localStorage` and set on `<html data-country>` by a small inline script in `<head>`, before the first paint. On a first visit it is inferred from the browser's time zone, falling back to the region in its language setting.
- When content differs by country, the HTML contains one variant per country and CSS shows only the active one (`[data-cc]` in `global.css`). This keeps the site static and makes the country switch instant, with no flash.
- Where the variants are heavy, they aren't rendered live. On the VAT page, each country's tax calendar sits in a `<template>`, and only the active one is mounted. That cut hundreds of hidden nodes and scroll triggers from the page.

Country-specific copy for the services lives in `src/content/servicios-pais/{language}/{country}/`, and `getServiceVariants()` in `src/lib/content.ts` groups countries that share the same text.

## Tax deadlines

`src/lib/fiscal/deadlines.ts` defines a few rule types (`fixed`, `monthEnd`, `afterPeriod`, `nthWorkdayAfter`, `range`) and resolves them to a date for a given year, moving to the next working day when the law says so. Holidays are computed per year (Easter-based ones included) for each office.

`src/lib/fiscal/timeline.ts` lays the deadlines out on the yearly chart, works out the reminder date and finds the next deadline from today. The same code runs at build time (so the page is correct without JavaScript) and in the browser (so it is correct on the day you visit).

The data for each country is in `src/data/fiscal-calendar/`, with the legal sources noted at the top of each file. `deadlines.test.ts` checks the 2026 dates against the official calendars.

## Pricing

All prices live in `src/lib/pricing/config.ts`, in euros. `calculate.ts` holds the calculator logic and `currency.ts` converts to Swiss francs and rounds. A test fails if a price appears anywhere else in the code.

## Styling

Design tokens (colours, type scale, spacing, radii) are CSS custom properties in `src/styles/tokens.css`, exposed to Tailwind. Two tests enforce the brand rules:

- `no-hex.test.ts` fails if a hex colour appears outside the tokens file.
- `contrast.test.ts` checks the brand's text and background pairs against WCAG AA, and that the forbidden ones (white on the sage green) stay forbidden.

## Motion

GSAP and ScrollTrigger are loaded dynamically, and only when the user hasn't asked for reduced motion. Each section registers its own scene (`src/components/animations/`), and `init.ts` runs the ones present on the page.

The initial hidden states are set in CSS under `.js.motion`, so without JavaScript, or with reduced motion, everything is visible from the start. Text that is likely to be the LCP element uses a CSS-only entrance (`data-enter`) so it never waits for GSAP.

Page transitions use the browser's native cross-document View Transitions, so no client-side router is needed.

## Testing

- **Unit (Vitest):** pricing, tax deadlines for all five countries, office hours and reply times, formatting, i18n completeness, contrast and the no-hex rule.
- **End to end (Playwright):** key journeys in every page type, keyboard navigation, the no-JavaScript experience, reduced motion, the country and language detection, and axe accessibility checks.
