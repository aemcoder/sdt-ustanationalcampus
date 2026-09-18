<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-18T16:58:55Z
  againstInput: https://www.ustanationalcampus.com/
  readArtifacts:
    - stardust/current/pages/*.json (50 pages)
    - stardust/current/_brand-extraction.json
    - stardust/current/_style-lift.json
  synthesizedInputs: []
  stardustVersion: 0.22.1
  mode: descriptive (current state)
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tennis, pickleball and padel players of every level in the Orlando / Lake Nona area and visitors to the campus: parents booking junior programs and summer camps; adults looking for clinics, drop-ins, private lessons and court time; tournament players and spectators following events (BNP Paribas World Team Cup, collegiate events); campus visitors needing hours, directions, dining, shuttle and health information. Secondary audiences: sponsors/partners, scholarship applicants, job seekers (careers link out to usta.com).

_provenance: inferred — from nav IA (PLAY / EVENTS / ABOUT / WATCH / VISIT), CTA inventory (BOOK NOW, BOOK A COURT, REGISTER NOW) and page copy._

## Product Purpose

The public website of the USTA National Campus, the United States Tennis Association's 100-court home in Orlando, Florida. It exists to drive bookings and registrations (courts, programs, camps, lessons, Free30 intro sessions, events) through CourtReserve, to publish the event calendar and live streams, and to serve practical visitor information (hours, holiday hours, address, guest services, program policies). Success is a booking or registration started, an event attended or watched, and a visitor who arrives informed.

## Positioning

"Welcome to the USTA National Campus" — the only site for the USTA's flagship campus: 100 fully lit courts, 84 livestreamed courts, 300+ events and 49 programs (home stat band). A neighbouring tennis club cannot truthfully claim the national-governing-body scale, the livestreamed courts, or the collegiate / national event slate.

## Capabilities and Constraints

- Server-rendered Adobe Experience Manager site (Core Components v2 on the modern template; an older USTA "page" template on visit / news / health pages), all content under `/en/home/…`.
- Booking, registration and payment happen off-site on CourtReserve (`app.courtreserve.com`, `usta.courtreserve.com`); the site links out and promotes the CourtReserve app (App Store / Google Play badges).
- Dynamic surfaces: event calendar (`/usta/events` JSON feed rendered client-side on /calendar and as "Event Calendar at a Glance" cards), news feed (`/usta/nc/newsfeed`), photo gallery (`/usta/nc/photogallery`), an IonCourt live-score iframe on the World Team Cup page, a YouTube embed on strength-and-conditioning, a Google Maps link, a Sendinblue newsletter form link, GPT advertisement slots, OneTrust consent, Adobe Launch / Analytics / Target tags.
- Interactive components: accordions (FAQ, lesson types, useful information), tabs (team roster, program levels, camp seasons), carousels (image galleries with dot indicators), off-canvas mobile navigation with two-level dropdowns, dismissible alert banner.
- Terminology: Free30 (free 30-minute intro session), Dave Bailey Program, Save My Play (court recording), Red Ball / Orange Ball / Green Ball (junior levels), Nemours Family Zone, Junior Pathway.
- One page (`/collegiate/events`) is a proxy of usta.com College Tennis content rendered in usta.com chrome; one URL (`/play/nemours-family-zone`) redirects to junior-tennis-programs.

## Brand Commitments

- Name: USTA National Campus. Logo: USTA wordmark with flame mark + "NATIONAL CAMPUS" (SVG in header, PNG in footer).
- Register: **brand** (marketing / landing site; conversion-first).
- Observed personality: energetic, confident, athletic, welcoming ("Serving up Something for Everyone!", "Get Started with a Free30", "Tennis Made Easy!"). Big condensed display type over full-bleed action photography; short imperative CTAs.
- Type: Graphik (Regular, Semibold, XXCondensed Bold) — a licensed Commercial Type family self-hosted by USTA.
- Palette: black on white with USTA blue (#0373f3) CTAs, sage green (#92bfb7) footer and bands, orange (#f0aa54) alert banner, warm grey (#dcdfcf) contact band; legacy pages add navy (#002649) and a red dash (#ce1126).
- Observed anti-references: no gradients, no rounded cards on the modern template, no decorative illustration (photography only), no serif type.
- Parent brand usta.com is linked, not imitated.

## Evidence on Hand

- 50 live Playwright captures: `stardust/current/pages/<slug>.json` + rendered DOM `<slug>.html` + full-page screenshots `stardust/current/assets/screenshots/<slug>.png`.
- Brand surface: `stardust/current/_brand-extraction.json`; computed-style lift at 1440 and 360 on 8 pages: `stardust/current/_style-lift.json`.
- Harvested clientlib CSS: `stardust/current/assets/css/`; fonts: `stardust/current/assets/fonts/` (3 woff2); logo `stardust/current/assets/logo.svg`; favicon set `stardust/current/assets/icons/`; footer imagery `stardust/current/assets/media/footer/`.
- Crawl audit trail: `stardust/current/_crawl-log.json` (discovery, dynamic surface, vision check).
- Absent (must not be fabricated): no sitemap; no meta descriptions / OG tags on any page; no testimonials text captured beyond teaser headings; live event/news feed contents are time-varying.

## Product Principles

1. Every page leads to a booking or registration — CTAs stay visible (header BOOK NOW, footer BOOK NOW, in-page blue buttons).
2. Photography of real play on campus carries the brand; type is big, condensed and black or white.
3. Practical information (hours, address, holiday hours, policies) is one click away from every page via the footer.
4. Programs are organised by sport and level (tennis / pickleball / padel; junior / adult; pathways) and explained with FAQs.
5. Events are surfaced everywhere through the calendar feed.

## Accessibility & Inclusion

Observed: skip links to ad slots, alt text on editorial images (several decorative images carry empty alt), aria-hidden decorative icons, "opens in a new tab" link annotation (`data-cmp-link-accessibility-text`). Tensions: several "Learn More" links without context; low-contrast 12px footer links; uppercase-only small text.
