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
| `accordion` | reconstructive (Block Collection) | one row per Q/A: question cell · answer cell (EW7: title in a div, chevron-only button); variant `legacy` (Bootstrap panel-group look, two-column body — rules in styles.css `main .accordion.legacy`) | 10 pages + visit, play/tennis |
| `tabs` | reconstructive (Block Collection) | one row per tab: label · panel content | 8 pages |
| `carousel` | reconstructive (Block Collection) | one row per slide: picture · optional caption; variant `gallery` (news photo galleries) | 10 pages + archive |
| `table` | reconstructive (Block Collection) | data rows; variant `pricing` (davebailey, private-lessons) | 4 pages |
| `columns` | reconstructive (Block Collection) | variants `image-text` (text + photo band), `legacy-info` (navy LOCATION|HOURS band — rules in styles.css scoped `main .columns.legacy-info`, band painted on the section via `:has()`), plain 2-cell rows for the legacy one-row layout tables (heading | sponsor logo) | about, private-lessons, visit, play/events-and-leagues |
| `ad-slot` | template-slotted | one row: creative picture · link (+ generated skip link) | 5+ pages |
| `event-cards` | reconstructive, data-fed top-up | authored rows + `/data/events.json` top-up (§ dynamics #2) | events, calendar, about, play |
| `calendar` | client-only over snapshot | search form + month grid + day list from `/data/events.json` (§ dynamics #1) | /calendar |
| `news-listing` | index-backed, document-first | authored 8 rows + `/query-index.json` (news sheet) + snapshot top-up, load-more | /news |
| `service-tiles` | reconstructive (container) — ADDED by the legacy conversion | one row per tile: picture · (h3 title · p lede · `<p><a href="#tile-id">View More</a></p>`) · detail (optional `<p><picture>`, h4, h5, richtext) · detail right column; click toggles a row-spanning collapse panel (one open per grid) | visit, sustainability, health-and-wellness, play/tennis, events/collegiate — supersedes the planned CSS-only `cards.legacy`: the legacy boxTile grid is cards at rest but every tile opens a Bootstrap-collapse detail panel carrying the section's real copy/links, which needs block JS the cards owner cannot host |
| `article-hero` | **default content** section style (D1) — `<p><picture>` · kicker `<p>` · `<h1>` · date `<p>` styled in place (656px cover + navy scrim; date = `p:last-child`; a small line may also sit below the h1 for the video/gallery variant); every following section renders as the 800px 20/35 news body | news archive (429), program-policies, winter-wild-card, masteruhistory, campus-pro-shop |
| `embed` | auto-block (`buildAutoBlocks`) | YouTube / IonCourt URL alone in a paragraph | 4 pages + video articles |
| `icon-heading` | **default content** + section style `icon-heading` (`<p><img></p><h2>` styled in place) | home, about, program pages |
| contact band | **default content** section style `contact-grey` (h2 + accent CTA) | 16 program pages |
| app badges | **default content** (p + two image links) section style `app-badges` | 16 program pages |
| legacy section heading | **default content** section style `legacy-heading` (h1/h2 45px XXCond navy + red dash via ::after; uppercase only over `service-tiles`; the tagline is the heading/paragraph that FOLLOWS the title, sibling-scoped) · `legacy-canvas` (#f5f5f5 ground) · `center` (centred AEM richtext) · `rule` (section that followed an authored `<hr>`) · `photo-gallery` (navy gallery band) | visit, sustainability, health, tennis, collegiate, news, events-and-leagues |
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
- 2026-09-18T20:45Z **legacy family + content-page (legacy conversion agent).** Inventory: blocks `service-tiles` (new, see table), `news-listing` (new); styles.css appended section styles `legacy-heading`, `legacy-canvas`, `center`, `rule`, `photo-gallery`, `article-hero` (+ news body rules), `columns.legacy-info`, `accordion.legacy`, legacy richtext baseline (16px/1.3 #333, Bootstrap 1170/970/750 container, 21px paragraph pitch standing in for the source's `<p>&nbsp;</p>` spacers — #112), `body.content-page` prose (holiday hours). Pages: `stardust/scripts/legacy-author.mjs` authors 23 pages from the captured DOM (visit, sustainability, health-and-wellness, play/tennis, events/collegiate, news, 9 health-and-wellness articles, play/events-and-leagues, 4 news articles, 2 holiday-hours, collegiate/events). Gate numbers per page: `stardust/.work/deploy/legacy.log`.
  - Decisions: tiles tagline authored as the next heading level (source h4) — the classifier reads it as a heading; tiles "View More" authored as an in-page anchor `#<tile-slug>` (the source's `href="#boxN"`), the block toggles on it and clones it (instrumentation stripped) for the ≤991px inline line; accordion labels stay plain text (the source's `<a>` has no href — 4 ROLE SWAP flags on visit are this, justified; a hash link would break the shipped accordion's header toggle); one-row layout tables → `columns`, data tables → `table` block rows with spans duplicated (D3); `<hr>` → section split + `rule` style; centred AEM richtext → `center`; legacy bold links authored `<a><strong>` (never `<strong><a>` — that buttonises); `<u>`/`<span>`/inline styles dropped; empty headings/paragraphs dropped.
  - Article-video shape (60 archive records + campus-pro-shop): news-extract stores the visually BIG line as `kicker` and the small line as `title`; `news-author.mjs` now swaps them for that shape and keeps the source DOM order (small line above or below the h1) — 892 authored, news-accept 892/0.
  - Not faithful / needs the coordinator: (1) `ad-slot` (other agent) renders 164–172px vs the legacy 176px slot (creative 600 vs 728 wide) and its creative must be uploaded to DA: `stardust/prototypes/assets/ads/en-home-visit-html-728x90.png` → `content.da.live/aemcoder/sdt-ustanationalcampus/media/ads/728x90-free-30.png` (authored URL; harness maps it to /media-local); (2) `table` and `carousel` landed at 20:46 — the legacy conversion added styles.css variants `table.legacy` (compact bordered richtext table; rowspan/colspan duplicated into the spanned cells, D3), `carousel.hero` (the collegiate .ncCarouselWrap: 656px full-bleed cover slides, caption bottom-left, red ring dots) and `carousel.gallery` overrides for the `photo-gallery` band (1170×558, vertical dots, light-blue caption) and the news body (550px inline gallery — the source's teaser+modal is not migrated, so its "Launch Gallery" CTA is a justified round-trip flag); (3) the news share button/modal and the collegiate gallery's second tab ("College Combine") are not migrated (contentGap); (4) `/collegiate/events` is a usta.com proxy page — thin page with the intro + link out (contentGap, dynamics #21); (5) dropped `<p>&nbsp;</p>`/`<br><br>` spacers make legacy prose pages shorter than the source (hydration −? / program-policies −300px) — systematic #112 residual; the hotel-shuttle band on /visit is +21px for the same reason; (6) harness breadcrumbs derive from the h1 (no query index locally) — deployed-URL check needed; (7) `/query-index.json` needs a `news` sheet with `category`, `published-date`, `image`, `description` columns (news-listing falls back to `/data/newsfeed.json` until then).

### Modern template family — block inventory and decisions (stardust:deploy, modern conversion agent, 2026-09-18)

Blocks added/extended (all `blocks/<name>/<name>.{js,css}`, eslint 0 / stylelint 0, EW gate 0 dead / 0 dup on every authored page):

| block · variants | tier | authoring shape | notes / rationale |
|---|---|---|---|
| `hero` · `title-only` · `boxed` · `boxed light` | template-slotted | `<p><img></p>` · h1 · lede p · CTA p(s) | `light` added: program pages carry a translucent WHITE box (rgb 255 255 255 / 78%) with black title + lede, spacing 128/64 + 224 — distinct from the hub's black box |
| `tile-mosaic` · `collage` · `programs` · `programs compact` | reconstructive | row 1 = large tile, rows 2+ = side tiles (`programs`: photo-first = photo tile, heading-first = solid blue tile with h3/h4 + arrow footer) | `collage` = about events (feature tile · 6-image collage · photo); `programs` = hub tile grids (events, /play/programs) — 2 side tiles → full height, 4 → 2×2; `compact` = 22px uppercase captions (events) vs display captions (programs). Whole-tile click-through from the heading link (source: clickable containers) |
| `stat-band` | reconstructive | h2 number · h5 label per row | — |
| `cards` · `four` · promo (per card) · `team` · `register` | reconstructive | picture · h3 · p · link p; promo card = the card whose link is `<em><a>`; `team`/`register` = the live cmp-teaser card skin (1px rgba border, 4px radius, 0 2px 5px shadow, 30×3 dash) | `event` variant NOT used — `event-cards` covers it |
| `teaser` · `half` | reconstructive | picture cell · text cell | about's 2 half + 2 full teasers = two blocks in one section (the round-trip gate pairs sections 1:1, so the second block was verified by geometry) |
| `accordion` · `pricing` · `band sage|clay` | reconstructive | title cell (`<p>`, the collection's summary text — the classifier reads the source's h4>button>span as body) · panel cell; `pricing` panel = `<p><strong>Role</strong></p><p>$…</p>` pairs; `band` reabsorbs the h2 before and the CTAs/note/photo after it (EW8) | band = the only D2-compliant way to put an accordion inside the photo band |
| `tabs` · `large` | reconstructive (collection) | label cell · panel cell; label-only rows ADOPT the next N sections as panels (a panel holding a block is its own section; sections are moved whole so the runtime still loads them, EW9) | equal-width nowrap labels; `large` = 22px/48px hub labels |
| `carousel` | reconstructive (collection) | one `<p><img></p>` per slide | 588px square, arrows + 16px ring indicators (live cmp-carousel values) |
| `table` · `pricing` | reconstructive (collection) | header row (bold cells or `pricing`) + data rows | davebailey: five tables, each under a default-content `<h3>` title |
| `columns` · `image-text` · `image-text band sage|clay` | reconstructive (collection) | text cell + `<p><img></p>` cell in authored order | hub flavour (under `icon-heading-grid`) vs program intro (64px margins) vs full-bleed band |
| `event-cards` | reconstructive + data-fed top-up | picture · date p · h3 · p · plain link p; tops up to 4 from `/data/events.json` | link is a bold underlined text link (authored plain, styled), never a button |
| `calendar` | client-only over snapshot | key-value `source` row; reabsorbs the authored `<h1>Search Events</h1>` as the form title | all other strings are widget chrome/feed data (`@ew-exempt`) |
| `ad-slot` | template-slotted | `<h4>Advertisement</h4>` · `<p><a href="#…">Skip Advertisement</a></p>` (+ optional creative picture/link) | GPT wiring behind `site-config.gpt.enabled` (guarded dynamic import — the inline harness cannot resolve module imports) |
| `embed` | auto-block | URL alone in a paragraph (`buildEmbedAutoBlocks` in scripts.js: youtube / youtu.be / vimeo / ioncourt) | lazy iframe; authored link kept as the no-JS fallback |

Section styles appended to `styles/styles.css` (ONE token per section, #120): `icon-heading` (60px) · `icon-heading-large` (75px) · `icon-heading-grid` (hub 1/12 + 11/12) · `narrow` (8/12 offset 2/12; an opening image paragraph + h2 is detected as an icon row) · `separator` 57 · `separator-thin` 17 · `separator-hairline` 9 · `separator-sage` 34 · `contact-grey` (layout) · `app-badges` · `program-head` · `pad-medium` · `cta-band` · `clay-cta`. Full-bleed by variant: `main > .section > div:has(> .block.band)`. Accent (em+strong) pills: `min-width: max-content`, glyph only on external/tel/mailto hrefs (source `button-core_with-icon`); edit-mode repaint for the nested em>strong mark added.

Harness note: the vendored `decorateSections` does not apply section-metadata (the pipeline does it server-side, rendering version ≥ 2) — local QA runs `stardust/.work/deploy/apply-section-meta.mjs` over the built harness page to simulate it. Known probe artefacts: block-roundtrip / ew-probe harness buttonizes bare `<p><a>` (older convention) — "Learn More 40→24" drift lines and promo mis-detects come from the probe, not the runtime (verified: `p=24, a.class=''`).

Archetype fidelity (harness vs prototype, section geometry): about 1440 3495=3495 / 360 5209=5209; private-lessons 1440 4405=4405 / 360 5398 vs 5400 (app badges −2px, source inline-anchor strut); home 1440 3674=3674 / 360 6699=6699. Deliberate drops: the home mosaic's hidden live variants (`u-hidden` "Reserve a Court" / "Summer Camps", mobile-only plain "Book a Court" duplicate) are not authored — one linked h3, CSS drops the underline at mobile. The about "VIEW CALENDAR" tile label is bold text with no link (as captured). Hub CTAs are blue flat (`<strong><a>`), program-page CTAs are black pills (`<em><strong><a>`), per the live `.cmp-text a` / button-core rules.

Sibling pages (23, sibling tier — structural clones + verbatim captured content; harness: every block loaded at 1440/360, davids-model-lint 0 🔴, EW dead 0 / dup 0 on all): hubs `/play /events /connect /about/meet-our-team /play/tennis/summer-camps /calendar`; programs `/play/programs /play/book-a-court /play/court-booking /play/free30 /play/davebailey /play/pickleball /play/play-padel /play/programs/adult-tennis /play/programs/junior-tennis-programs /play/tennis/adult-camps /play/tennis/adult-red-ball /play/tennis/junior-programming-welcome-letter /watch /watch/save-my-play /about/sponsors-partners /about/usta-national-campus-scholarship /events/2026-bnp-paribas-world-team-cup`. Decisions: `/connect` = the About page verbatim (the source renders it so); captured desktop/mobile duplicates (accordion twins of tabs, duplicate h1/h4/h6, hidden 2025 season accordions) authored once; unmapped targets (`/en/home/play/high-performance(1)`, `/en/home/play/pickleball2/play-pickleball`) kept fully-qualified; event rails `event-cards feed` (top-up from `/data/events.json`) only on /events and /calendar — program-page social rails stay authored-only.
Known unfaithful spots handed to the coordinator (need a block/style, not content): free30's centred hero variant; watch's full-width scrim band with three white pills (authored `hero boxed`); gradient / #a4ee90 / #19462e / boxed-clay prose bands (authored `center` | `pad-medium`); prose-beside-video 6/6 layouts (embed cannot nest in columns — stacked); adult-tennis orange + red-ball terracotta bands (authored `band clay`); N-up centred icon/text grids (plain `columns`); team-variant square crop on book-a-court court photos; welcome-letter landscape infographics in the square carousel; tabs-panel h3 sizes on program pages.
- Published-origin finding (#buttonize): the pipeline hoists emphasis out of anchors (`<a><strong>` → `<strong><a>`), so a link alone in its paragraph becomes a `.button.primary`. Fixed by authoring link-only paragraphs as plain anchors; the footer's VIEW HOLIDAY HOURS keeps its 900 weight via footer.css. Residual: on 15 legacy/news pages standalone bold links now render regular weight (fidelity trade recorded here; source bolded them).
