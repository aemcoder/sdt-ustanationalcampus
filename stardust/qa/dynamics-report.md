# Dynamics parity check — https://main--sdt-ustanationalcampus--aemcoder.aem.page — 2026-09-18T20:06:41.090Z

Replayed 17 checks over 14 features · pass 9 · fail 8. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| two-level navigation (desktop dropdowns, mobile off-canvas) | M | pending D2-a | dom-count | PASS | 5 × header .main-nav-item (min 5) |  |
| two-level navigation (desktop dropdowns, mobile off-canvas) | M | pending D2-a | dom-count | PASS | 19 × header .main-nav-sub li (min 19) |  |
| two-level navigation (desktop dropdowns, mobile off-canvas) | M | pending D2-a | no-page-errors | FAIL | error: c.paths is not iterable |  |
| dismissible alert banner | M | pending D2-a | dom-count | PASS | 1 × header .alert-banner (min 1) |  |
| FAQ / lesson-type / useful-information accordions | M | pending D2-a | dom-count | PASS | 9 × .accordion details, .accordion .accordion-item (min 9) |  |
| tabbed panels | M | pending D2-a | dom-count | PASS | 6 × .tabs [role=tab] (min 2) |  |
| image carousels / photo galleries | M | pending D2-a | dom-count | PASS | 22 × .carousel .carousel-slide, .carousel img (min 10) |  |
| event calendar (month grid + search) over the events snapshot | A | pending D2-b (interim: snapshot) | fetch-json | FAIL | error: Cannot read properties of undefined (reading 'startsWith') |  |
| event calendar (month grid + search) over the events snapshot | A | pending D2-b (interim: snapshot) | dom-count | PASS | 1 × .calendar (min 1) |  |
| Event Calendar at a Glance rails | A | pending D2-b (interim: authored rows + snapshot top-up) | dom-count | FAIL | 0 × .event-cards .card, .cards.event > div (min 4) |  |
| news listing (document-first + query index + snapshot top-up) | L | pending D2-b | dom-count | FAIL | 0 × .news-listing article, .news-listing li (min 8) |  |
| news listing (document-first + query index + snapshot top-up) | L | pending D2-b | fetch-json | FAIL | error: Cannot read properties of undefined (reading 'startsWith') |  |
| collegiate photo gallery | V | pending D2-b | dom-count | PASS | 11 × .carousel img (min 10) |  |
| IonCourt live team-event scores iframe | V | pending D2-c | dom-count | FAIL | 0 × .embed iframe[src*='ioncourt'] (min 1) |  |
| YouTube embeds (strength-and-conditioning + 13 video news articles) | V | pending D2-c | video-plays | FAIL | iframe/video: false · playback requests 0 (none ok) |  |
| GPT ads / OneTrust / Adobe Launch / Google tags | T | scaffolded-awaiting-owner | consent-gate | FAIL | error: Cannot read properties of undefined (reading 'length') |  |
| /collegiate/events (usta.com proxy) | CR | interim (thin page + outbound link) | dom-count | PASS | 2 × main a[href*='usta.com/en/home/play/college-tennis'] (min 1) |  |

## Features without checks

- booking / registration deep links (X) — decided-out
