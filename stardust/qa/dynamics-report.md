# Dynamics parity check — https://main--sdt-ustanationalcampus--aemcoder.aem.page — 2026-09-18T20:11:13.481Z

Replayed 16 checks over 14 features · pass 16 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| two-level navigation (desktop dropdowns, mobile off-canvas) | M | done | dom-count | PASS | 5 × header .main-nav-item (min 5) |  |
| two-level navigation (desktop dropdowns, mobile off-canvas) | M | done | dom-count | PASS | 19 × header .main-nav-sub li (min 19) |  |
| dismissible alert banner | M | done | dom-count | PASS | 1 × header .alert-banner (min 1) |  |
| FAQ / lesson-type / useful-information accordions | M | pending D2-a | dom-count | PASS | 9 × .accordion .accordion-item (min 9) |  |
| tabbed panels | M | pending D2-a | dom-count | PASS | 6 × .tabs [role=tab], .tabs button (min 2) |  |
| image carousels / photo galleries | M | done | dom-count | PASS | 11 × .carousel img (min 10) |  |
| event calendar (month grid + search) over the events snapshot | A | interim (snapshot tier) | fetch-json | PASS | 200 · 2 rows · keys size,events |  |
| event calendar (month grid + search) over the events snapshot | A | interim (snapshot tier) | dom-count | PASS | 1 × .calendar form.calendar-search (min 1) |  |
| Event Calendar at a Glance rails | A | interim (authored rows + snapshot top-up) | dom-count | PASS | 4 × .event-cards .event-card (min 4) |  |
| news listing (document-first + query index + snapshot top-up) | L | done (index sheet pending — falls back to the snapshot) | dom-count | PASS | 8 × .news-listing .news-item (min 8) |  |
| news listing (document-first + query index + snapshot top-up) | L | done (index sheet pending — falls back to the snapshot) | fetch-json | PASS | 200 · 1 rows |  |
| collegiate photo gallery | V | done | dom-count | PASS | 11 × .carousel img (min 10) |  |
| IonCourt live team-event scores iframe | V | done | dom-count | PASS | 1 × .embed.embed-ioncourt (min 1) |  |
| YouTube embeds (strength-and-conditioning + 13 video news articles) | V | done (click-to-play placeholder → iframe on interaction) | dom-count | PASS | 1 × .embed, a[href*="youtu"] (min 1) |  |
| GPT ads / OneTrust / Adobe Launch / Google tags | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |
| /collegiate/events (usta.com proxy) | CR | interim (thin page + outbound link) | dom-count | PASS | 2 × main a[href*='usta.com/en/home/play/college-tennis'] (min 1) |  |

## Features without checks

- booking / registration deep links (X) — decided-out
