<!-- stardust:provenance
  writtenBy: stardust:rollout (Phase H)
  writtenAt: 2026-09-18T20:23:25Z
  againstInput: https://www.ustanationalcampus.com/ --hands-off (replica → migrate → rollout)
  readArtifacts: [stardust/rollout/coverage/pages.json, stardust/rollout/optimize/scorecard.json, stardust/qa/dynamics-report.md, stardust/replica/progress.json, stardust/.work/delivery/*.json]
  synthesizedInputs: []
  stardustVersion: 0.22.1
-->
# rollout — USTA National Campus → aem-eds

Preview: https://main--sdt-ustanationalcampus--aemcoder.aem.page · Live: https://main--sdt-ustanationalcampus--aemcoder.aem.live · Repo: https://github.com/aemcoder/sdt-ustanationalcampus · Author: https://da.live/#/aemcoder/sdt-ustanationalcampus

| | |
|---|---|
| Pages | 940 rostered · **938 deployed + verified** · 1 pending (`/news/usta-national-campus-in-focus-alt`, path-collision variant) · 1 redirect (`/play/nemours-family-zone` → `/play/programs/junior-tennis-programs`) |
| Waves | 1: 49 navigable pages (8 archetypes + 41 siblings) · 2: 891 news-archive articles (`news-author.mjs`) |
| Templates | 8 archetypes (landing, hub, program, listing, article ×2, static ×2) |
| Blocks | 17: hero, tile-mosaic, stat-band, cards, teaser, accordion, tabs, carousel, table, columns, event-cards, calendar, ad-slot, embed (auto-block), service-tiles, news-listing + header/footer chrome · 20 section styles |
| Quality | optimize gate: **0 open P1** · P2 930 `ai-search/jsonld` + 6 duplicate titles + 1 meta description · P3 328 title-length + 6 duplicate descriptions — all **source-faithful** (the source ships no JSON-LD; titles/descriptions are the source's verbatim; duplicates are duplicated source pages) → accepted, not autofixed |
| Dynamics | parity replay **16/16 pass** (`stardust/qa/dynamics-report.md`); feeds on the interim snapshot tier; tags scaffolded and disabled |

## Fidelity — published-origin gate (live site vs preview origin, stitched captures, chrome crops)

| archetype | 1440 | 360 |
|---|---|---|
| home `/` | 0.97 % Δh −1 · header 100 % · footer 99.2 % | 3.00 % Δh 0 |
| about `/about` | 1.01 % Δh 0 · header 100 % · footer 99.8 % | 1.71 % Δh 0 |
| program `/play/private-lessons` | 0.88 % Δh 0 · header 100 % · footer 99.8 % | 3.17 % Δh +2 |
| listing `/visit` | 0.18 % Δh 0 | **16.3 %** Δh −6 — service-tiles mobile rows (residual) |
| article `/visit/health-and-wellness/hydration-matters` | **13.3 %** Δh +43 — legacy title/table spacing (residual) | **18.3 %** Δh +63 |
| static `/news/holiday-hours` | 4.47 % Δh +16 | **11.1 %** Δh −6 (residual) |

Prototype regime (before conversion): every archetype ≤ 1.07 % at both widths, 0 structural red, |Δh| ≤ 1 (`stardust/replica/progress.json`).

## Reconcile round applied at the published origin
1. Pipeline hoists emphasis out of anchors → link-only paragraphs buttonised (footer +41 px sitewide): plain links + CSS weight.
2. `<picture>` wrapper broke `p > img` section-style selectors (FAQ icon full-size, +949 px): descendant selectors.
3. Legacy ad-slot geometry (176 / 98 px) as a template variant.
4. #112 spacer lines: zero-width-space paragraphs (survive the pipeline) replace margin/padding stand-ins → visit 1440 6.16 % → 0.18 %.

## Residual classes (documented, not hidden)
- Legacy template pages render in standards mode vs the source's quirks mode; three pages above still carry 40–60 px height deltas (title/table spacing) — one more anchors round per page.
- News share modal, collegiate gallery second tab, usta.com proxy content (`/collegiate/events`) not migrated (thin page + outbound link).
- 118 dead source images (404 on the source) omitted from the archive; 15 legacy/news standalone bold links render regular weight.
- Ad creatives frozen as static images (GPT disabled).
- OneTrust floating consent button repeats in every live stitched capture (decided-out tag) — 0.2–0.7 % per page.

## Owner decisions (stardust/dynamic-features.md § Decision batch)
1. Events feed: enable CORS on `/usta/events` for the new host or move events to a DA sheet (interim: `/data/events.json` snapshot, 353 events).
2. Tags: GPT ads, OneTrust (add the new domain), Adobe Launch, Google — ids in `scripts/site-config.js`, all disabled.
3. Segmentation: decided-out unless section personalisation is wanted.
4. Graphik font licence on the new host (`fonts/LICENSING.md`).
5. Query index `news` sheet at tools.aem.live (`stardust/rollout/INDEX-CONFIG.md`) — news-listing and breadcrumbs fall back meanwhile.
6. Redirects: `stardust/redirects.tsv` (source URL space `/en/home/*.html` → `/*`) to be loaded into the site's redirects sheet.

## Ledgers
`stardust/rollout/coverage/pages.json` · `stardust/rollout/dashboard/index.html` · `stardust/.work/delivery/deploy-ledger.json` (+ redrive ledgers) · `stardust/learnings.md` (12 pending entries) · `stardust/journal.md`
