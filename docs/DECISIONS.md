# Decisions

The choices that shaped the project and why I made them. The full working log was kept in Spanish; this is the short version.

## Static first, React only where it earns its place

A fiduciary's website is mostly reading material, so Astro renders everything to HTML and React hydrates only the calculator, the contact form and the booking calendar. The pages are fast, work without JavaScript and are cheap to host. The cost is that anything dynamic (today's date, the visitor's country) has to be handled with small scripts on top of static HTML, which drove several of the decisions below.

## Language and country are two different things

Early on the site only knew about language. That broke quickly: a German speaker might be in Zurich or in Berlin, and they need different prices, legal forms and tax dates. So country became its own setting, with its own selector in the header, stored in the browser and independent of the URL.

To keep pages static, the HTML ships one variant per country wherever the text differs, and a CSS rule shows the active one. Switching is instant and there's no flash on load, because the country is set on `<html>` by an inline script before the first paint. Where that would mean too much hidden markup (five full tax calendars on one page), the inactive variants go into `<template>` elements and only the active one is mounted.

## No IP geolocation

Detecting the visitor's country by IP would mean a third-party service or a server, and the brief ruled out both for privacy. The browser's time zone is a good enough signal: `Europe/Zurich` means Switzerland, `Europe/Madrid` means Spain, and so on. For Switzerland, the language follows the browser's preference among German, French and Italian, with German as the fallback. Visitors from elsewhere get their browser language. A manual choice always wins.

## Tax deadlines as rules, not dates

Hard-coding dates would make the calendar wrong every January. Instead each deadline is a legal rule ("60 days after the quarter", "second working day after 1 May") resolved for the current year, with each country's holidays and weekend rule. A few things I learned along the way:

- Swiss VAT is due at the end of the second month after the period (31 May, 31 August, 30 November, end of February), which is what the federal tax administration publishes. That isn't exactly "60 days", and it isn't moved for weekends.
- In Italy, a deadline falling on a Saturday moves to Monday. In 2026 that puts the Q1 VAT payment on 18 May and the annual returns on 2 November, which matches the official calendar.
- Italy brought back 4 October as a national holiday from 2026, and France drops its simplified VAT regime from 2027. Both are handled by year.
- Where the law leaves the exact day to each company (French VAT is due "between the 15th and the 24th"), the calendar says so instead of inventing a date.

Every calendar was checked against official sources, noted in the data files, and the 2026 dates are pinned in unit tests.

## Honest about being a demo

The company is fictional, so nothing should pretend to be sent. The contact form and the booking calendar validate normally, then show a short notice ("this is a portfolio project, nothing was sent or stored") with a link to the confirmation page, so the whole journey can still be seen. The notice is a native `<dialog>`, so focus handling and Escape come for free.

I also didn't invent local phone numbers for the other countries, because a made-up number can belong to a real person. Every country shows the Zurich head office number, labelled as such.

## One source for prices

All prices live in one file, in euros, and are converted to Swiss francs where needed. A unit test fails if a price shows up anywhere else, which stopped several small inconsistencies from creeping in during content work.

## Brand rules enforced by tests

The brand guide is strict: a fixed palette, no white text on the sage green, sage at no more than about a tenth of any page. Instead of trusting reviews, two tests read the design tokens: one rejects hex colours outside the tokens file, the other checks contrast for every allowed pair.

## Performance: what actually made a difference

Lighthouse in the high 80s on a few pages turned out to have very specific causes:

- **Hidden content still costs.** The VAT page carried five tax calendars, four of them hidden, plus their scroll animations. Moving the inactive ones into `<template>` took the page from 82 to 95.
- **Don't hide the LCP behind JavaScript.** Page leads faded in with GSAP, so the largest text wasn't painted until the animation library loaded. A CSS-only entrance for above-the-fold text took those pages from about 90 to 100. Same for the contact page's arch photo, which used to start fully clipped.
- **One italic font file was 144 KB.** It was only used by a testimonial quote on the home page and a date on the VAT page. Setting both upright removed the download and brought the home page from 94 to 98.
- **Islands hydrate when visible**, not on load, so form scripts don't compete with the first paint.

## Page transitions without a router

Astro's client-side router would have meant rewriting every page script to survive navigation. Native cross-document View Transitions give a smooth fade between pages with a few lines of CSS and no JavaScript. Browsers without support just navigate normally.

## Hosting

The site is static, so it runs on Cloudflare Pages with a `_headers` file: long-lived caching for hashed assets and a few basic security headers. No server, no database, no cookies.
