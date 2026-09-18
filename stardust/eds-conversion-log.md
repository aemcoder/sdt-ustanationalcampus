<!-- stardust:provenance
  writtenBy: stardust:deploy (coordinator, via stardust:replica Phase 5)
  writtenAt: 2026-09-18T17:45:49Z
  againstInput: https://www.ustanationalcampus.com/ --hands-off
  readArtifacts: [stardust/prototypes/*-proposed.html, stardust/current/pages/*.html, stardust/runtime-contract.json, stardust/dynamic-features.md]
  synthesizedInputs: []
  stardustVersion: 0.22.1
-->
# EDS conversion log — USTA National Campus (replica)

## Locked decisions (Step 2 — names + reuse, David's Model triage)

Runtime: vanilla aem-boilerplate 2026-09 (`stardust/runtime-contract.json`). Buttons: `<strong><a>` → blue flat 40px (primary),
`<em><a>` → white inverse 18px (secondary), `<em><strong><a>` → black pill with icon 56px (accent). Global tokens in `styles/styles.css`.

### Template metadata (body classes via `decorateTemplateAndTheme`)
| Template value | pages | effect |
|---|---|---|
| *(none)* | modern nc-usta-proxy / landing-page-template pages | header 213/160, body 16px/1.4286, content p 18/24 #000 |
| `content-page` | /news/holiday-hours, /about/holiday-hours | header 229/176 (8px padding above banner & below nav row) |
| `legacy` | visit/*, news/*, health-and-wellness/*, play/tennis, events/collegiate, play/events-and-leagues + the 892-page news archive | body 14px/21 #333; footer link pitch 43px |

### Chrome
- `header` / `footer` blocks — node-slotted, authored `/nav` (4 sections) + `/footer` (8 sections). Breadcrumb generated from path + `/query-index.json` titles (`@ew-exempt`).

### Blocks (one distinct pattern = one block; Block Collection names where the model matches — D11)
| block | tier | model / rows | used by |
|---|---|---|---|
| `hero` | template-slotted | picture · h1 · optional lede p · CTA p(s); variants: `boxed` (translucent black box: about, program pages), `title-only` (home), `wide-box` | landing, hub, program |
| `tile-mosaic` | reconstructive | one row per tile: picture (or none) · h3 title · optional CTA; variants `1-4` (home), `programs` (1 large + 4 with ledes) | home, programs, events, play |
| `stat-band` | reconstructive | one row per stat: h2 number · h5 label | home |
| `cards` | reconstructive | one row per card: picture · h3 · body p · link p; variants `four` (home/play), `promo` (solid blue CTA card = row whose first cell is a CTA), `legacy` (visit/sustainability/health 3-col white cards), `team` (meet-our-team tiles), `register` (adult-camps grid: title · dates · CTA), `event` (event cards: picture · date · h3 · body · link) | many |
| `teaser` | reconstructive | one row per teaser: picture · h3 · body · link; variant `half` | about, events |
| `accordion` | reconstructive (Block Collection) | one row per Q/A: question cell · answer cell (EW7: title in a div, chevron-only button) | 10 pages |
| `tabs` | reconstructive (Block Collection) | one row per tab: label · panel content | 8 pages |
| `carousel` | reconstructive (Block Collection) | one row per slide: picture · optional caption; variant `gallery` (news photo galleries) | 10 pages + archive |
| `table` | reconstructive (Block Collection) | data rows; variant `pricing` (davebailey, private-lessons) | 4 pages |
| `columns` | reconstructive (Block Collection) | variants `image-text` (text + photo band), `legacy-info` (navy LOCATION|HOURS band) | about, private-lessons, visit |
| `ad-slot` | template-slotted | one row: creative picture · link (+ generated skip link) | 5+ pages |
| `event-cards` | reconstructive, data-fed top-up | authored rows + `/data/events.json` top-up (§ dynamics #2) | events, calendar, about, play |
| `calendar` | client-only over snapshot | search form + month grid + day list from `/data/events.json` (§ dynamics #1) | /calendar |
| `news-listing` | index-backed, document-first | authored 8 rows + `/query-index.json` (news sheet) + snapshot top-up, load-more | /news |
| `article-hero` | template-slotted | picture · kicker p · h1 · date p (legacy article/news hero with scrim) | news archive, program-policies, campus-pro-shop |
| `embed` | auto-block (`buildAutoBlocks`) | YouTube / IonCourt URL alone in a paragraph | 4 pages + video articles |
| `icon-heading` | **default content** + section style `icon-heading` (`<p><img></p><h2>` styled in place) | home, about, program pages |
| contact band | **default content** section style `contact-grey` (h2 + accent CTA) | 16 program pages |
| app badges | **default content** (p + two image links) section style `app-badges` | 16 program pages |
| legacy section heading | **default content** section style `legacy-heading` (h2 uppercase navy + red dash via ::after) | visit, sustainability, health, tennis |
| sage strip / separators | **default content** empty section with style `sage` / `separator` | home, program pages |

D1 triage: any prose section (heading + paragraphs + CTAs, no repeat units) is default content with at most one `style` value.

### URL mapping
`/en/home/<path>.html` → `/<path>` (home → `/`); `---`/`--` collapse to `-`; trailing `-` dropped; 3 wave-2 collisions get a `-2` suffix. Full table: `stardust/redirects.tsv`.

### Images
Editorial images authored with their captured source URLs (`https://www.ustanationalcampus.com/content/dam/…` — resolve 200 without a bot wall; `media-reconcile` decides optimize/keep at delivery). Chrome/fixed assets: `/icons/*.svg` (code bus) and `content.da.live/…/media/chrome/*` (authored logos).

## Waves
1. Archetypes (6 + 2 variants) → block library + first pages. 2. Sibling pages by template cluster (hub 7, program 18, listing 6, article 14, static 2, unique 1). 3. News archive (892 articles) via `stardust/scripts/news-author.mjs` + `deploy-batch`.

## Running notes
- 2026-09-18T17:45:49Z canon feedback applied to the EDS foundation: `body.content-page` header padding/height; `body.legacy` footer link pitch + body type.
