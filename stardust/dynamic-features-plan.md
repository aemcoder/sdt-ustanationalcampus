<!-- stardust:provenance
  writtenBy: stardust:dynamics (curated by stardust:replica Phase 2)
  writtenAt: 2026-09-18T17:10:18Z
  againstInput: https://www.ustanationalcampus.com/ --hands-off
  readArtifacts: [stardust/dynamic-features.md]
  synthesizedInputs: []
  stardustVersion: 0.22.1
-->
# Dynamic features plan — USTA National Campus

All phases run inside rollout D2 after the static pages are published; every page works statically first.

## Phase D2-a — Interactive chrome and widgets (self, rebuild-native) — rows 10–14, 22, 23
- Deliverables: `blocks/header` (alert banner close, two-level nav with hover/click dropdowns, mobile off-canvas + accordion, observed transitions), `blocks/accordion`, `blocks/tabs`, `blocks/carousel`, `blocks/ad-slot` (static creative + skip link).
- Authoring contract: nav document `/nav` = alert banner paragraph + logo + 2-level list + BOOK NOW; accordion = one row per Q/A; tabs = one row per tab (label | panel content); carousel = one row per slide (image, optional caption).
- Verification: parity checks `nav-open`, `nav-dropdown`, `accordion-toggle`, `tabs-switch`, `carousel-next` at 1440 and 360 on the published origin.
- Effort: M.

## Phase D2-b — Data-fed content (interim snapshot tier) — rows 1, 2, 3, 4
- Deliverables: `data/events.json`, `data/newsfeed.json`, `data/photogallery-collegiate.json` + `_provenance.json` in the code bus; `blocks/calendar` (month grid, day list, search filter — client-only over the snapshot), `blocks/event-cards` (document-first + date top-up), `blocks/news-listing` (document-first rows + query-index top-up + load-more), `blocks/gallery` (authored rows); `helix-query.yaml` `news` sheet.
- Authoring contract: news article pages emit `published-date`, `category`, `image`, `description` metadata; event cards authored as rows (date | title | body | link).
- Verification: `events-grid-renders` (≥1 event cell for the current month from the snapshot), `news-listing-count` (8 rows + load-more), `gallery-slide-count` (10).
- Owner decision: events feed CORS / sheet sync.
- Effort: L.

## Phase D2-c — Embeds (self) — rows 5, 6
- `buildAutoBlocks` → `embed` for YouTube + IonCourt URLs; parity `iframe-src-present`.
- Effort: S.

## Phase D2-d — Tags scaffold (owner batch) — rows 15–18, 24
- `scripts/site-config.js` with GPT / OneTrust / Adobe Launch / Google entries **disabled**; `scripts/delayed.js` loads them only when enabled. Parity: `no-third-party-tags-when-disabled`.
- Effort: S.

## Phase D2-e — Register rows — 7, 8, 9, 19, 20, 21
- Links preserved; usta.com proxy page thin with outbound link; decided-out rows documented above.
