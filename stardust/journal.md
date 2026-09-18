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
