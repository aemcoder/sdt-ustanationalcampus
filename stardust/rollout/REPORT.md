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

## Owner decisions — resolved 2026-09-18
1. Events → da.live sheet `/data/events` (content bus), blocks read it; the code-bus snapshot was removed.
2. All source tags ported (OneTrust, Adobe Launch, GA4/Ads, Facebook pixel, GPT live slots) — verified on the published home. Add the new domain in OneTrust for production.
3. Query index configured via `helix-query.yaml` (works on this site): default 940 rows, news 897 rows.
4. Redirects sheet `/redirects.json` (945 rows) published; 301s verified on aem.page and aem.live.
5. `GH_PAT` refreshed by the user.
Still open: Graphik licence confirmation; the three residual fidelity pages; production domain.

## Ledgers
`stardust/rollout/coverage/pages.json` · `stardust/rollout/dashboard/index.html` · `stardust/.work/delivery/deploy-ledger.json` (+ redrive ledgers) · `stardust/learnings.md` (12 pending entries) · `stardust/journal.md`


## Sibling published-origin pixel gate — 41 pages × 2 widths (2026-09-19)

Gate: stitched full-page pixel diff, live `www.ustanationalcampus.com` vs published `main--sdt-ustanationalcampus--aemcoder.aem.page`, at 1440 and 360; pass = < 10 % per run. Instruments: `stardust/scripts/published-gate-all.mjs` (5-way parallel, live captures cached and black-tail-trimmed), `sbs.mjs` montages, `.work/kids.mjs` geometry dumps. Nine coordinated rounds: 7 page-group agents authored content (verbatim structure, spacer lines, measured block/section tokens) and filed measured CSS requests; ~40 block/section tokens were added centrally (see the commit log `fix(fidelity): …`). Archetype pages re-checked after every global rule: home 0.81/2.39, about 0.89/1.18, connect 0.89/1.18, private-lessons 0.75/8.82, visit 3.12/7.47, holiday-hours 3.44/7.17 — all pass. Evidence per run: `stardust/replica/gates/<slug>-<w>/{live.png,published.png,diff-published.png,published.txt}`; merged ledger `stardust/replica/siblings-final.json`; agent reports `stardust/.work/agents/*-report.md`.

| page | type | 1440 (round 0 → final) | 360 (round 0 → final) | status |
|---|---|---|---|---|
| /news/2019-collegiate-winter-wild-card | article | 10.1% → 0.3% Δh0 | 22.2% → 8.2% Δh30 | PASS |
| /news/masteruhistory | article | 4.5% → 2.0% Δh-66 | 12.7% → 4.7% Δh58 | PASS |
| /news/national-campus-program-policies | article | 9.5% → 5.2% Δh-154 | 17.2% → 9.1% Δh36 | PASS |
| /play/events-and-leagues | article | 25.3% → 0.2% Δh0 | 10.4% → 4.4% Δh3 | PASS |
| /visit/health-and-wellness/breakfast-the-most-important-meal-of-the-day | article | 22.1% → 2.9% Δh4 | 26.9% → 4.8% Δh3 | PASS |
| /visit/health-and-wellness/fluid-loss-and-body-weight | article | 5.1% → 0.5% Δh0 | 5.5% → 0.9% Δh0 | PASS |
| /visit/health-and-wellness/macronutrient-breakdown | article | 21.6% → 1.3% Δh2 | 24.6% → 1.7% Δh1 | PASS |
| /visit/health-and-wellness/macronutrient-breakdown-carbohydrates | article | 22.7% → 1.4% Δh2 | 23.4% → 1.7% Δh1 | PASS |
| /visit/health-and-wellness/nutrition-for-recovery | article | 19.6% → 1.3% Δh2 | 17.8% → 2.1% Δh2 | PASS |
| /visit/health-and-wellness/nutrition-for-tennis | article | 16.3% → 2.8% Δh2 | 21.6% → 4.5% Δh1 | PASS |
| /visit/health-and-wellness/sleep-matters | article | 17.2% → 1.2% Δh2 | 19.8% → 2.4% Δh2 | PASS |
| /visit/health-and-wellness/strength-and-conditioning | article | 37.0% → 0.4% Δh0 | 39.2% → 1.4% Δh0 | PASS |
| /about/meet-our-team | hub | 18.4% → 8.0% Δh-6 | 49.8% → 25.6% Δh73 ✗ | open |
| /calendar | hub | 15.8% → 5.0% Δh-11 | 37.8% → 37.9% Δh2491 ✗ | open |
| /connect | hub | 0.9% → 0.9% Δh0 | 1.2% → 1.2% Δh0 | PASS |
| /events | hub | 24.8% → 10.9% Δh27 ✗ | 50.0% → 28.2% Δh-23 ✗ | open |
| /play | hub | 24.4% → 2.9% Δh-3 | 38.7% → 8.9% Δh-18 | PASS |
| /play/tennis/summer-camps | hub | 23.1% → 18.5% Δh40 ✗ | 29.3% → 20.1% Δh-38 ✗ | open |
| /events/collegiate | listing | 20.6% → 3.5% Δh-5 | 35.9% → 6.8% Δh-10 | PASS |
| /news | listing | 18.5% → 7.0% Δh2 | 42.4% → 6.0% Δh-4 | PASS |
| /play/tennis | listing | 16.8% → 4.8% Δh5 | 15.2% → 8.2% Δh2 | PASS |
| /visit/health-and-wellness | listing | 0.0% → 0.0% Δh0 | 33.7% → 0.4% Δh0 | PASS |
| /visit/sustainability | listing | 0.0% → 0.0% Δh0 | 33.6% → 4.0% Δh1 | PASS |
| /about/sponsors-partners | program | 31.6% → 10.4% Δh16 ✗ | 46.3% → 23.6% Δh37 ✗ | open |
| /about/usta-national-campus-scholarship | program | 26.9% → 8.0% Δh2 | 36.9% → 19.0% Δh67 ✗ | open |
| /events/2026-bnp-paribas-world-team-cup | program | blocked → 18.5% Δh140 ✗ | 49.4% → 37.5% Δh466 ✗ | open |
| /play/book-a-court | program | 35.2% → 8.6% Δh6 | 43.1% → 10.0% Δh-1 | PASS |
| /play/court-booking | program | 35.2% → 8.6% Δh6 | 43.1% → 10.0% Δh-1 | PASS |
| /play/davebailey | program | 34.9% → 15.3% Δh0 ✗ | 37.4% → 37.5% Δh217 ✗ | open |
| /play/free30 | program | 32.8% → 14.2% Δh59 ✗ | 44.0% → 23.9% Δh68 ✗ | open |
| /play/pickleball | program | 25.0% → 12.1% Δh-104 ✗ | 28.6% → 19.8% Δh76 ✗ | open |
| /play/play-padel | program | blocked → stitch-blocked | blocked → stitch-blocked | open |
| /play/programs | program | 41.1% → 12.7% Δh0 ✗ | 55.8% → 32.7% Δh19 ✗ | open |
| /play/programs/adult-tennis | program | blocked → stitch-blocked | 29.2% → 26.7% Δh602 ✗ | open |
| /play/programs/junior-tennis-programs | program | 25.0% → 14.7% Δh95 ✗ | 36.7% → 30.3% Δh340 ✗ | open |
| /play/tennis/adult-camps | program | 30.7% → 11.2% Δh-70 ✗ | 28.4% → 23.3% Δh-139 ✗ | open |
| /play/tennis/adult-red-ball | program | 50.8% → 16.3% Δh-56 ✗ | 44.7% → 24.4% Δh10 ✗ | open |
| /play/tennis/junior-programming-welcome-letter | program | 31.2% → 15.0% Δh76 ✗ | 45.5% → 34.8% Δh449 ✗ | open |
| /watch | program | 46.6% → 8.2% Δh-6 | 53.5% → 16.6% Δh-5 ✗ | open |
| /watch/save-my-play | program | 34.4% → 5.8% Δh6 | 34.8% → 15.3% Δh24 ✗ | open |
| /collegiate/events | unique | 77.1% → 0.0% Δh-48 | 80.7% → 0.0% Δh0 | PASS |

**22 / 41 pages pass at both widths; 49 / 82 runs < 10%.**

### Where the open runs still lose pixels (measured, per agent reports)
- **Program pages @360** (12 open): the published tab component collapses to a 54px select (`tabs select`) or a closed accordion (`tabs`) while several live pages keep the active panel open under the select (adult-tennis, pickleball, padel) → 1–3k px of panel; welcome-letter / jtp band and Pathway blocks at xs (photo halves, 300px text column, live cell-width quirks); adult-camps schedule text sits beside its accordion on live (a nested block, not expressible); consent-blocked video placeholders on live vs the real embed on published (adult-red-ball, save-my-play); live-only mobile photo under the davebailey hero.
- **Program pages @1440** (10 open, 10.4–18.5 %): in-section pixel causes rather than heights — carousel autoplay slide mismatch, consent placeholder vs video, live content drift (adult-camps 2027 pricing rows), font-metric wraps (Graphik licence), main-tile photo renditions, accordion item heights 62 vs 54, stepper rail look (summer-camps).
- **Hubs**: /calendar @360 — live renders a 16-item events search-results list (3769 px) instead of the picker (JS mode decision; spec in `E-hubs-css-requests.md` R8-6); /events — mosaic photo renditions and caption geometry; /play/programs — main-tile copy wraps.
- **Unmeasurable by the stitch**: /play/play-padel (both) and /play/programs/adult-tennis @1440 — the live page stalls the window scroll (inner scroller); section heights recorded with kids.mjs in `B-programs1-report.md`.
- `/collegiate/events` now mirrors the source 301 to usta.com/college (both sides redirect → 0 %).

### Archive-wide fixes that fell out of the gate
news-author hero line order read from the captured DOM for every shape (78 pages re-authored); article hero full-bleed; 45 px xs paragraph pitch; `indent-40/80`; gallery template (title hidden, 550 px box, 17 px xs pitch); legacy richtext div→paragraph + blank-line spacers + iframe sections; columns rows share width equally; embed links inside columns cells.
