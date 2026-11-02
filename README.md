# Northbridge Advisory

Website for a fiduciary and accounting firm in Zurich: bookkeeping, VAT, payroll, company formation and startup advisory for small businesses.

**Live:** [northbridge-124.pages.dev](https://northbridge-124.pages.dev)

Northbridge is a fictional company. I built it as a portfolio project to show how I approach a real client website from start to finish: brand system, content, front-end, accessibility, performance and testing.

![Home page](docs/screenshots/home.jpg)

## What it does

- **Five languages, five countries.** The site runs in German, French, Italian, English and Spanish, and adapts to Switzerland, Germany, France, Italy and Spain. Language and country are separate settings, so a French speaker in Zurich sees Swiss prices, legal forms and tax deadlines in French.
- **Country-specific content.** Each country has its own currency, legal forms (GmbH, SL, SAS, SRL), service descriptions, office, tax calendar, guides and client quotes. Switching country in the header updates the page without reloading it.
- **Sensible defaults on first visit.** Country and language come from the browser's time zone and language settings. A visitor from Zurich lands on the Swiss site in German, and one from Geneva with a French browser gets French. There is no IP geolocation and no third-party service involved.
- **A real tax calendar.** The VAT and tax service page shows the year's deadlines for the selected country, calculated for the current year (see below).
- **Price calculator, contact form and booking flow.** All of them work end to end. Since the company isn't real, nothing is sent: a short notice explains that before the confirmation page.

## Things worth a closer look

### Tax deadline engine

`src/lib/fiscal/` turns legal rules into exact dates for any year. Rules look like "60 days after the end of the quarter", "last day of the month", "second working day after 1 May, plus 15 days if filed online" or "the 10th, moved to the next working day". The engine applies each country's public holidays (Zurich, the Spanish national calendar, Berlin, France, Italy) and its rule for weekends.

Each calendar in `src/data/fiscal-calendar/` was checked against the official sources (ESTV, AEAT, gesetze-im-internet.de, impots.gouv.fr, Agenzia delle Entrate), and the unit tests pin the published 2026 dates. Next year the page updates itself.

![Tax calendar](docs/screenshots/vat-calendar.jpg)

### Confirmation page

After you send the form, your message crosses the brand's arch from "You, today" to the person who reads it, and a live countdown shows how long until we reply: noon on the next working day of that country's office, holidays included. If you came from the booking page, it counts down to your appointment instead.

![Confirmation page](docs/screenshots/confirmation.jpg)

### Accessibility and performance

- WCAG 2.2 AA. Keyboard and screen reader tested, and every animation respects `prefers-reduced-motion`.
- The whole site works without JavaScript. React only hydrates where there's real interaction: the calculator, the forms and the booking calendar.
- Lighthouse on mobile scores 100 for accessibility, best practices and SEO on every page I measured, and 93 to 100 for performance.
- No tracking cookies and no third-party scripts. Fonts are self-hosted.

![Contact page in German](docs/screenshots/contact.jpg)

## Stack

- [Astro 7](https://astro.build) with static output (161 pages) and React 19 islands
- TypeScript, strict mode
- Tailwind CSS 4 on top of a small set of design tokens (`src/styles/tokens.css`)
- GSAP with ScrollTrigger and SplitText for the scroll scenes, Lenis for smooth scrolling, native View Transitions between pages
- Content collections in Markdown/MDX with Zod schemas; React Hook Form and Zod for the forms
- Vitest for unit tests, Playwright with axe-core for end-to-end and accessibility tests
- Cloudflare Pages, deployed on every push to `master`

## Project structure

```
src/
  components/   UI, layout, page sections, React islands and animation scenes
  content/      services, country variants, guides, team and testimonials (5 languages)
  data/         tax calendars per country and office details
  i18n/         UI strings per language and translated routes
  lib/          pricing, tax deadlines, country logic, contact and SEO helpers
  views/        one view per page type, shared by all languages
  pages/        a single catch-all route that maps every URL to its view
tests/          Playwright end-to-end tests
docs/           architecture notes and design decisions
```

More detail in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DECISIONS.md](docs/DECISIONS.md).

## Running it locally

You need Node 22.23 or later (24 recommended).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check      # type checking
npm run lint
npm run test       # unit tests
npm run test:e2e   # Playwright (starts the dev server)
```

Copy `.env.example` to `.env` if you want to set the site URL or a real Cal.com link.

## Notes

- The company, team, clients and prices are made up. The photos are AI-generated.
- The tax and legal facts are real and sourced. They were current when I checked them in late 2026, but this isn't tax advice.
- Code, comments and tests are in English. Spanish is the site's default language, so URLs and content keys use Spanish slugs (`/servicios`, `servicios-pais`).

## License

All rights reserved. The code is public so you can review it, not for reuse.
