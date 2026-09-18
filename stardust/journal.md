# Journal — USTA National Campus → Edge Delivery (replica)

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-09-18T17:03:51Z — Repo created, full-site extract, preserve-mode direction

**Prompt:** Migrate https://www.ustanationalcampus.com/ to Edge Delivery with stardust; create the EDS repo with the personal `eds-new-site` skill; full site including dynamic features; fully hands-off (user not monitoring).

**Decisions:**
- Flow: **replica** (keep the current design) → migrate → rollout. No prepare-migration. Hands-off stamped in state.json.
- Repo `aemcoder/sdt-ustanationalcampus` created from adobe/aem-boilerplate (private), fstab.yaml pushed. **Code Sync registration blocked**: `GH_PAT` in ~/.claude/.env is expired (401 on /user) and the gh OAuth token is refused by the installation API (403). Left for the user; da.live content authoring proceeds anyway.
- Discovery: no sitemap (robots.txt empty). Depth-4 same-origin BFS found 75 URLs; 50 live (all captured), 25 dead links logged. Under the hands-off caps → whole site in scope.
- Page types (site catalog): landing 1 · hub 7 (proxy-template section pages) · program 18 (landing-page-template) · static 2 · listing 6 (legacy) · article 14 (legacy) · unique 1 (/collegiate/events = usta.com proxy) · redirect 1 (/play/nemours-family-zone).
- Archetypes: home · about · play/private-lessons · news/holiday-hours · visit · visit/health-and-wellness/hydration-matters.
- Fonts: Graphik (licensed, self-hosted by USTA, no CORS) → self-host the same woff2 in the EDS repo under the same licensee; flagged for user confirmation.
- Brand surface built from a Playwright computed-style lift (8 pages × 1440/360) because crawl.mjs does not capture computed styles.
- Register: empty (pure replica).

**Artifacts touched:**
- stardust/current/{pages/*, assets/*, _crawl-log.json, _brand-extraction.json, _style-lift.json, PRODUCT.md, DESIGN.md, DESIGN.json, brand-review.html} — created
- PRODUCT.md, DESIGN.md, DESIGN.json (root) — promoted verbatim
- stardust/direction.md, stardust/replica/inconsistency-register.md, stardust/state.json, stardust/status.jsonl — created
- stardust/current/_dynamics.json, stardust/dynamics/dynamic-features.generated-plan.md — created (12 archetype URLs, 32 findings)
- fstab.yaml — committed

**Findings worth flagging:**
- The site is two template families under one chrome: modern AEM Core Components (black/white/#0373f3, no shadows) and a legacy USTA template (navy #002649, #f5f5f5 canvas, shadowed cards).
- The fixed header is 213px at 1440 (alert 55 + nav 129 + breadcrumb 28) and 160px at 360; the breadcrumb lives inside the fixed header.
- First-party feeds (/usta/events, /usta/nc/newsfeed, /usta/nc/photogallery) return empty without their query parameters; exact parameterised URLs are being recovered from the dynamics capture.
- crawl.mjs slugs are path-derived (`en-home-play-programs-html`); the delivered URL space drops `/en/home` and `.html`.

**Open questions:**
- Does USTA's Graphik licence cover the new host? (assumed yes — same licensee)
- Refresh GH_PAT and run the Code Sync registration (command in the final report).

**Next:** Phase 2 dynamics curation → Phase 3 canon chrome + archetype prototypes → Phase 4 gates.

---
## 2026-09-18T17:38:48Z — Dynamics curated, canon chrome gated, EDS foundation authored, archetypes fanned out

**Prompt:** *(continuation of the hands-off replica run)*

**Decisions:**
- Dynamic surface: 24 curated rows in stardust/dynamic-features.md; all first-party feeds are host-bound → snapshot tier in `data/`; tags scaffolded disabled in `scripts/site-config.js` + `scripts/delayed.js`.
- News archive: 892 live article pages discovered via the newsfeed (BFS could not see the client-rendered listing) → wave 2 of the roster; crawl running with `--wait fast`. Rendered-DOM sidecars of the archive are gitignored (project-owned line) — JSON records stay tracked.
- Canon chrome recreated from the computed-style lift; chrome-parity quiet at 1440 and 360; crop gate: header 100% / 99.45%, footer 99.73% / ~97.6% (the 360 residual is the live OneTrust floating button — decided-out tag).
- EDS foundation written directly from the gated canon: styles.css tokens + metric-matched fallbacks (measured width ratios), fonts.css + self-hosted Graphik (LICENSING.md alert), header/footer blocks (node-slotted), content/nav.html + content/footer.html, chrome media uploaded to da.live /media/chrome. Runtime harness (port 3001) renders the chrome through scripts.js: header crops 99.86% / 98.66% vs live.
- Six archetype agents dispatched with stardust/replica/ARCHETYPE-BRIEF.md (file-pointer brief; own gate dirs, progress logs).
- A `npm i --no-save` for @babel/core pruned playwright mid-run (the documented trap) — reinstalled within a minute; one agent logged the instrument defect and excluded the run from its cap.

**Artifacts touched:** stardust/dynamic-features.md, -plan.md, stardust/dynamics/snapshots/*, stardust/prototypes/{css/canon.css,js/chrome.js,partials/*,_chrome-test.html}, stardust/replica/{ARCHETYPE-BRIEF.md,progress.json,gates/chrome-*}, stardust/runtime-contract.json, styles/*, fonts/*, blocks/header/*, blocks/footer/*, content/{nav,footer}.html, scripts/{site-config,delayed}.js, data/*, icons/*, favicon.ico

**Open questions:** Graphik licence on the new host; owner decisions in dynamic-features.md § Decision batch; Code Sync registration (GH_PAT expired).

**Next:** collect archetype gate results → migrate siblings → deploy/rollout.

---
## 2026-09-18T17:52:14Z — Archetypes gated and approved (hands-off); Path A migrate; conversion agents running

**Prompt:** *(continuation of the hands-off replica run)*

**Decisions:**
- Six archetype families recreated by parallel agents and gated per breakpoint (1440 / 360, ≤3 iterations, live captures cached): home 0.51 / 1.07 %, about 0.12 / 0.63 %, private-lessons 0.13 / 0.81 %, visit 0.14 / 0.53 %, hydration-matters 0.16 / 0.55 %, holiday-hours ×2 0.15 / 0.70 %; every page 0 structural red, |Δh| ≤ 1 px, chrome bands ≤ 2 % (header 0.00 % on every 1440 run). Approved with `approvedBy: hands-off`.
- Residual class shared by all pages: the live OneTrust floating consent button repeats at every stitch seam (decided-out tag) — capture-state → delivery.
- Template-family findings applied to the EDS chrome: content-page header 229 / 176 px with transparent 8 px strips (margin, not padding); legacy family footer link pitch 43 px (12 px / 21 px li), legacy alert-banner line-height 1.3 at 360, breadcrumb `ol{vertical-align:top}`.
- migrate: Path A only — the gated prototypes copied to `stardust/migrated/` with `_meta.json` (archetypes-only mode); siblings are authored directly as EDS content by two conversion agents (modern family / legacy family), author-only, delivery deferred until Code Sync is registered.
- rollout inventory built from a delivered-path roster (`stardust/rollout/roster-state.json`, 49 wave-1 pages + 892 wave-2 news articles, representative = archetype slug).
- Wave-2 pipeline: `news-extract.mjs` → `news-author.mjs` (article-hero as default content + section style, body verbatim, gallery rows, embed URL) → `news-accept.mjs` content-count gate: 429 / 429 pass on the pages crawled so far.

**Artifacts touched:** stardust/prototypes/* (8 prototypes + css/js), stardust/replica/{progress.json, progress/*, gates/*, motion/*, canon-feedback/*}, stardust/migrated/*, stardust/rollout/*, stardust/eds-conversion-log.md, stardust/scripts/{news-extract,news-author,news-accept,replica-merge,migrate-archetypes}.mjs, content/news/* (429), blocks/header/header.css, styles/styles.css, stardust/state.json

**Open questions:** as before (Graphik licence, owner decision batch, Code Sync registration).

**Next:** conversion agents → local QA → commit → deliver to DA once Code Sync is registered (or deliver content to DA regardless and publish when the site config exists).

---
## 2026-09-18T19:23:30Z — EDS conversion complete (author-only), main pushed, DA staging

**Prompt:** *(continuation of the hands-off replica run; user note: another session made unintentional changes)*

**Decisions:**
- Two conversion agents converted the site: modern family (hero, tile-mosaic, stat-band, cards, teaser, accordion, tabs, carousel, table, columns, event-cards, calendar, ad-slot, embed auto-block; 26 pages) and legacy/content-page family (service-tiles, news-listing, legacy + article-hero section styles; 23 pages + the 892-page archive via `news-author.mjs`). All pages: davids-model-lint 0 🔴, one h1, EW probe 0 dead, eslint/stylelint 0, localize-links check 0.
- Runtime harness evidence: converted home page vs live capture 1.04 % pixel / Δh −1 at 1440; about/private-lessons section geometry equals the prototypes at both widths.
- Another session (not this run) committed the agents' in-progress work as branch `first-pages` (20:46) and uploaded /nav, /footer, /about, /play/private-lessons to da.live; audited — consistent with the agents' output, nothing destructive. Committed the finished work on that branch, fast-forwarded `main`, pushed both.
- `service-tiles` added (legacy card grids hide real copy behind collapse panels → needs JS; supersedes the planned CSS-only cards.legacy). `article-hero` became a default-content section style after the D1 lint advisory.
- Known residual classes (recorded in stardust/eds-conversion-log.md § Running notes): legacy pages render standards-mode vs the source's quirks mode and lose `<p>&nbsp;</p>` spacers (#112) → shorter prose bands; ad creatives frozen as static images; a handful of sibling-tier bespoke bands authored with the nearest section style (listed by the modern agent); news share modal / collegiate gallery 2nd tab / usta.com proxy content not migrated.
- Delivery: DA source PUTs proceed now; preview/publish blocked until Code Sync is registered (GH_PAT).

**Artifacts touched:** blocks/*, styles/styles.css, scripts/scripts.js (embed auto-block), icons/*, content/** (943), stardust/eds-conversion-log.md, stardust/.work/deploy/*.log, stardust/rollout/{site,dashboard}, stardust/learnings.md

**Open questions:** Code Sync registration; query-index `news` sheet (stardust/rollout/INDEX-CONFIG.md); owner decision batch; Graphik licence.

**Next:** stage all documents to DA; once Code Sync is registered → preview/publish (deploy-batch re-run), published-origin gate, rollout verify/optimize/report, dynamics parity replay.

---
## 2026-09-18T20:22:30Z — Delivered to EDS preview/live, published-origin reconcile, rollout gates

**Prompt:** *(continuation; user note about unintentional changes from another session)*

**Decisions:**
- Code Sync was registered outside this session (PAT refreshed by the user at ~20:55 local); code + content preview at `main--sdt-ustanationalcampus--aemcoder.aem.page`. All 943 documents delivered with `deploy-batch` (PUT → preview → live), 938 verified by `verify.mjs`; 5 archive pages needed dead-image omission (source 404s) — 118 dead images omitted across the archive via `news-media-check.mjs`; body h1s demoted to h2 (one h1 per page).
- Published-origin reconcile round (one budgeted round, anchors-driven): (1) pipeline hoists emphasis out of anchors → link-only paragraphs buttonised (footer +41px) — authored as plain links, footer weight via CSS; (2) `p > img` selectors vs the `<picture>` wrapper — descendant selectors (private-lessons 29.96% → 0.88%); (3) legacy ad-slot geometry variant; (4) spacer restoration: zero-width-space paragraphs (survive the pipeline) replace margin/padding stand-ins in legacy richtext (visit 1440: 6.16% → 0.18%, Δh 0).
- Published-origin gate: home 0.97 / 3.00 %, about 1.01 / 1.71 %, private-lessons 0.88 / 3.17 %, visit 0.18 % (1440) — all Δh ≤ 2, chrome header 100 %. Residuals for a follow-up round: visit 360 (16.3 %, service-tiles mobile rows), hydration-matters (13.3 % / 18.3 %, +43/+63 px legacy title/table spacing), holiday-hours 360 (11.1 %).
- Dynamics parity replay 16/16 after aligning checks to the delivered DOM; rollout optimize gate: no P1 (P3 duplicate descriptions are source-faithful duplicates: connect = about, court-booking = book-a-court, both holiday-hours URLs).
- Query index (`news` sheet) still to be configured by an org admin (stardust/rollout/INDEX-CONFIG.md); news-listing and breadcrumb fall back correctly meanwhile.

**Artifacts touched:** content/** (re-drives), blocks/{header,footer,ad-slot,table}, styles/styles.css, stardust/scripts/{news-media-check,rollout-reconcile,published-gate.sh,legacy-author,news-author,news-accept}.mjs, stardust/rollout/{coverage,dashboard,optimize,site,REPORT.md}, stardust/qa/dynamics-report.md, stardust/dynamics/parity.json, stardust/replica/progress.json (publishedOrigin), stardust/learnings.md, stardust/state.json

**Open questions:** owner decision batch (events feed CORS/sheet, tags + ids, OneTrust domain, Graphik licence); query-index config; follow-up fidelity round on the three residual pages; publish to a production domain.

**Next:** hand-off report.

---
## 2026-09-18T20:55:59Z — Owner decisions applied

**Prompt:** decisions: events → DA sheet; port all tags; configure the index directly; load the redirects; GH_PAT refreshed.

**Decisions:**
- Events: DA sheet `/data/events` (353 rows, flat columns) published to preview + live; calendar and event-cards read the sheet shape (`data[]`, legacy `events[]` fallback); code-bus snapshot removed. Calendar renders 19 sheet events on the published origin.
- Tags: OneTrust (auto-block + stub), Adobe Launch (+ digitalData skeleton), GA4 ×2 + Ads, Facebook pixel, GPT (`/5681/National_Campus`, source size mapping, live slots replacing the frozen creatives) — all enabled in `scripts/site-config.js`, loaded by `scripts/delayed.js` in the source's order. Verified on the published home: banner visible, `_satellite`, `gtag`, `fbq`, GPT slot 728×90, the source's third-party host set, 0 console errors.
- Index: config-service API still 403 for the DA token, but `helix-query.yaml` is honoured — bulk reindex 946/946; news index moved to `/news/query-index.json` after a same-target collision.
- Redirects: `/redirects.json` sheet (945 rows) live; 301 verified.
- Sheets need `.json` in the preview/publish path (learning recorded).

**Artifacts touched:** helix-query.yaml, scripts/{site-config,delayed}.js, blocks/{ad-slot,calendar,event-cards,news-listing,header}, data/_provenance.json (events.json removed), DA: /redirects.json, /data/events.json; stardust/{dynamics/parity.json, dynamic-features.md, rollout/REPORT.md, rollout/INDEX-CONFIG.md, learnings.md, qa/dynamics-report.md}

**Open questions:** Graphik licence; OneTrust domain allow-list for production; residual fidelity round (visit@360, hydration, holiday@360); production domain.

**Next:** none pending — hand-off.

---
