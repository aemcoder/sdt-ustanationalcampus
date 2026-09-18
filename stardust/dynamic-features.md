<!-- stardust:provenance
  writtenBy: stardust:dynamics (curated by stardust:replica Phase 2)
  writtenAt: 2026-09-18T17:10:18Z
  againstInput: https://www.ustanationalcampus.com/ --hands-off
  readArtifacts:
    - stardust/current/_dynamics.json
    - stardust/dynamics/dynamic-features.generated-plan.md
    - stardust/current/_crawl-log.json#dynamicSurface
    - stardust/.work/dynamics/feed-captures.json
    - stardust/dynamics/snapshots/*.json
  synthesizedInputs: []
  stardustVersion: 0.22.1
-->
# Dynamic features — USTA National Campus

Target host: `https://main--sdt-ustanationalcampus--aemcoder.aem.page` (EDS). Every first-party API path is **host-bound** (404 on the target). Hands-off: every non-`self` row ships its interim tier; the owner decisions are named below.

## Listings contract

| content type | `<meta>` fields each page emits | index / source |
|---|---|---|
| `article` (news) | `title`, `description`, `image`, `published-date` (`March 1, 2026` → ISO), `category` (feed `title`: Campus / News / Events), `template: article` | `/query-index.json` (helix-query `news` sheet: path, title, description, image, published-date, category) + snapshot `data/newsfeed.json` for items not yet migrated |
| `event` | none on pages — events live in the content-fragment feed, not as pages | snapshot `data/events.json` (353 events; 8 fields) |
| gallery | none | snapshot `data/photogallery-collegiate.json` (10 images) |

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | events-feed | Event calendar (Vue `v-calendar` month grid + search form + day list on /calendar) fed by GET `/usta/events?dataPagePath=…&source=contentFragments` | A+CR+F | /calendar | data-fed | needs-business-decision | interim | off-origin-data → snapshot in code bus (`data/events.json`), `calendar` block rebuilds month grid + search (client-only filter) | **owner:** keep the AEM content-fragment feed reachable cross-origin (CORS) or sync events to a DA sheet; interim = snapshot dated 2026-09-18T17:10:18Z | feed-captures.json (123 KB, 353 events) |
| 2 | event-cards | "Event Calendar at a Glance" 4-card rail (home? no — /events, /calendar, /about, /play) from the same feed | A | 4 pages | data-fed | needs-business-decision | interim | `event-cards` block: document-first (authored 4 rows) + top-up from `data/events.json` by date | same as #1 | dynamicSurface: /usta/events reach 1/50 (rail is server-rendered on 3 pages, hydrated on calendar) |
| 3 | newsfeed | News listing (/news) fed by GET `/usta/nc/newsfeed?newsType=headline&resultsPerPage=8&pageNo=1` (909 items, paginated) | A+L | /news | index-backed | self | in-progress | `news-listing` block: authored first 8 rows + `/query-index.json` (news sheet) top-up + "load more" pagination; snapshot `data/newsfeed.json` for the 892 archive pages until wave 2 publishes | none (self) | newsfeed.json 335 KB |
| 4 | photogallery | Photo gallery (/events/collegiate) fed by GET `/usta/nc/photogallery?galleryPath=…` (10 images, captions) | A+V | /events/collegiate | static-snapshot | self | in-progress | `gallery` block with authored image rows (10 images rehosted to DA); carousel client-only | none — gallery content is authored, unfreeze = author edits rows | photogallery-collegiate.json |
| 5 | ioncourt-embed | IonCourt live team-event scores iframe (`ioncourt.com/team-events/6aa44524…`) + its API hosts (api.ioncourt.com, firebase) | V+A | /events/2026-bnp-paribas-world-team-cup | embed-passthrough | self | in-progress | `embed` auto-block (D1: URL alone on its line → iframe, same src) | none | _dynamics.json (1 page) |
| 6 | youtube-embed | YouTube embed `youtube.com/embed/l8M_g1ATK2g` | V | /visit/health-and-wellness/strength-and-conditioning | embed-passthrough | self | in-progress | `embed` auto-block (boilerplate pattern) | none | pages json media.iframes |
| 7 | courtreserve-links | Booking / registration deep links to CourtReserve (app.courtreserve.com, usta.courtreserve.com) incl. header/footer BOOK NOW, alert banner, REGISTER NOW grids | X | 50/50 | decided-out (external system — migrate the links) | self | done | outbound links, `target=_blank` as captured | none | ctas inventory |
| 8 | newsletter-form | "Sign Up for our Newsletter" → Sendinblue hosted form (sibforms.com) | F | 49/49 (footer) | embed-passthrough | self | done | outbound link (source has no on-page form) | none | footer-raw.html |
| 9 | maps-link | "Show on map" → Google Maps place link | X | 49/49 | decided-out (link) | self | done | outbound link | none | footer |
| 10 | alert-banner | Dismissible alert banner (close button hides banner for the session) | M | 50/50 | rebuild-native | self | in-progress | header block: close → `sessionStorage` flag, banner text authored in `/nav` | none | motion-observe: no morph; close button present |
| 11 | nav-menu | Two-level nav: desktop hover/click dropdowns (toggle-button aria-expanded, 0.3s color transition to #2456b2), mobile off-canvas panel (hamburger ↔ cancel, body lock) with accordion sub-lists | M | 50/50 | rebuild-native | self | in-progress | header block JS (state machine cloned from _chrome-lift.json states) | none | _chrome-lift.json mobileOpenBody / dropdownOpenParent |
| 12 | accordion | FAQ / lesson-type / useful-information accordions (cmp-accordion) | M | 22 pages | rebuild-native | self | in-progress | `accordion` block (Block Collection model) | none | headings "Frequently Asked Questions" ×8 |
| 13 | tabs | cmp-tabs (team roster, program levels, camp seasons) | M | 7 pages | rebuild-native | self | in-progress | `tabs` block (Block Collection model; panels as sections combined client-side) | none | DESIGN.json modules |
| 14 | carousel | cmp-carousel image galleries with dot indicators | M | 6 pages | rebuild-native | self | in-progress | `carousel` block (Block Collection model) | none | DESIGN.json modules |
| 15 | gpt-ads | Google Publisher Tag ad slots (`googletagservices.com/tag/js/gpt.js`, doubleclick, adtrafficquality) rendering the 728×90 "Advertisement" creative | T | 38 pages | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | `ad-slot` block renders the captured creative as an authored image+link (static); GPT loader wired in `scripts/site-config.js` **disabled** | **owner:** run GPT on the new host? ad unit ids (`div-gpt-ad-1789745137559`) | _dynamics.json tags |
| 16 | onetrust-cmp | OneTrust consent (domain script `0559fedb-…`) | T | 50/50 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | `site-config.js` entry, disabled until the CMP domain is added for the new host | **owner:** add the aem.page/aem.live/prod domain to the OneTrust script | head.html source |
| 17 | adobe-launch | Adobe Launch (`launch-EN1e11bbf…`) → Adobe Analytics, Target (omtrdc), ECID (demdex), Audience Manager iframe | T | 50/50 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | `site-config.js` entry, disabled; `digitalData`/`adobeDataLayer` object names recorded | **owner:** property id for the new host, consent gating | _dynamics.json settings objects digitalData, dataLayer |
| 18 | google-tags | Google Analytics / Ads / GTM (dataLayer) | T | 50/50 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | `site-config.js`, disabled | **owner:** measurement ids | _dynamics.json |
| 19 | segmentation | USTA segmentation script (`segmentation.min.js`, `/en/home.segment.<section>.html` 404 variants, locale variant `us`) | I18N+CR | 50/50 | decided-out | needs-business-decision | decided-out | none — the segment pages 404 on the source; single locale `en` | **owner:** confirm no section-personalisation needed | discovered.json (17 × 404 segment URLs) |
| 20 | csrf-token | GET `/libs/granite/csrf/token.json` (AEM platform) | D | 50/50 | decided-out | self | decided-out | platform artefact, no consumer on EDS | none | reach 50/50 |
| 21 | usta-proxy-page | /collegiate/events renders usta.com College Tennis in usta.com chrome (newsLandingServlet, i18n dict, segments.seg.js from usta.com) | CR+A | 1 page | static-snapshot | needs-business-decision | interim | thin page: title + intro + link to `https://www.usta.com/en/home/play/college-tennis.html` | **owner:** keep the proxy (needs usta.com content API) or link out | pages/en-home-collegiate-events-html.json |
| 22 | skip-links | "Skip ad" anchors (`#skipAd-div-gpt-ad-…`) | M | 38 pages | rebuild-native | self | in-progress | ad-slot block emits the skip link when the slot is enabled | none | ctas |
| 23 | hover-motion | Nav link hover colour transition 0.3s ease-out → #2456b2; `a.cmp-button:hover` opacity .7; toggle-button border-top-color 0.3s | M | 50/50 | rebuild-native | self | in-progress | header/button CSS (observed) | none | replica/motion/en-home-html.json |
| 24 | runtime-iframe | `iframe` without src (Adobe Audience Manager destination publishing) | T | 50/50 | decided-out | self | decided-out | part of Adobe tags (#17) | none | _dynamics.json V row |

## Decision batch (one message to the owner)

1. **Events feed (#1, #2):** the calendar and event rails read an AEM content-fragment feed that is dead on the EDS host. Interim: a JSON snapshot (`data/events.json`, 353 events, captured 2026-09-18T17:10:18Z) shipped in the code bus and refreshed by `stardust/scripts/dynamics/snapshot-api.mjs`. Decide: enable CORS on `/usta/events` for the new host, or move events to a DA sheet (`/data/events.json` via sheet sync).
2. **Tags (#15–#18):** GPT ads, OneTrust, Adobe Launch (Analytics/Target/ECID/AAM) and Google tags are wired in `scripts/site-config.js` and **disabled**. Decide which run on the new host and provide the ids; OneTrust needs the new domain added.
3. **Segmentation (#19):** decided-out unless section personalisation is wanted.
4. **usta.com proxy page (#21):** link out (interim) or rebuild with a usta.com content feed.
5. **Fonts (see direction.md):** confirm the Graphik licence covers the new host.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| CourtReserve booking/registration | external SaaS; source only links out | Links preserved verbatim (`target=_blank` where captured); no booking UI is reproduced on the site. |
| Google Maps | link | Preserved as a link. |
| Granite CSRF token | AEM platform call with no EDS consumer | Not reproduced. |
| Segment variants (`/en/home.segment.*.html`) | 404 on the source itself (`skipped-source-broken`) | Not reproduced; single `en` tree. |
| Adobe Audience Manager destination iframe | belongs to the disabled Adobe tag stack | Ships only when Adobe Launch is enabled by the owner. |
