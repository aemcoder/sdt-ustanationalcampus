<!-- stardust:provenance
  writtenBy: stardust:replica
  writtenAt: 2026-09-18T17:02:45Z
  againstInput: https://www.ustanationalcampus.com/ --hands-off
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
    - stardust/state.json
  synthesizedInputs: []
  stardustVersion: 0.22.1
-->
---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-18T17:02:45Z
  againstInput: https://www.ustanationalcampus.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of
https://www.ustanationalcampus.com/, promoted verbatim (no direct invocation,
no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-09-18T17:02:45Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation

Activated 2026-09-18T17:02:45Z by the user phrase "never stop for my input as I will not be
monitoring this session" on `stardust:replica https://www.ustanationalcampus.com/`.
`state.json.handsOff: true`. Every interactive gate auto-resolves per the master
skill § Hands-off mode; quality gates run at full strength.

## Named assumptions (hands-off)

1. **Flow: replica** (keep the current design). The user said "migrate", not
   "redesign"; the request is a re-platform to Edge Delivery Services.
2. **Scope: the whole site** — 49 renderable pages (50 crawled; one URL is a
   server redirect). No sitemap exists; the inventory is a depth-4 same-origin
   BFS. Volume cap 100 / 20 per template is not reached, so nothing is cut.
3. **Archetypes (one per page type, cumulative prototypes):**
   landing → `en-home-html` · hub → `en-home-about-html` · program →
   `en-home-play-private-lessons-html` · static → `en-home-news-holiday-hours-html`
   · listing (legacy) → `en-home-visit-html` · article (legacy) →
   `en-home-visit-health-and-wellness-hydration-matters-html`. `unique`
   (`/collegiate/events`, a usta.com proxy in usta.com chrome) is rendered as a
   one-off thin page linking to the usta.com source; `redirect`
   (`/play/nemours-family-zone`) becomes a redirect row.
4. **Fonts:** Graphik (Commercial Type, licensed to USTA) is self-hosted on the
   source and served without CORS, so it cannot be loaded cross-origin. The
   replica self-hosts the same three woff2 files in the EDS repo under the same
   licensee, family names first in every stack. **Surfaced for user
   confirmation** — swap to a metric-matched substitute if USTA's licence does
   not cover the new host.
5. **URL mapping:** `/en/home/<path>.html` → `/<path>` (home → `/`);
   `---` segments collapse to `-` (path-safety), originals recorded in
   `stardust/redirects.tsv`.
6. **Chrome:** the fixed header (alert banner + nav + breadcrumb) and sage
   footer are replicated as fixed/static exactly as observed, including the
   mobile off-canvas menu; the alert banner text is authored content.
7. **Dynamics:** first-party feeds (`/usta/events`, `/usta/nc/newsfeed`,
   `/usta/nc/photogallery`) are dead on the EDS host → snapshot tier
   (data-fed from a JSON snapshot in the code bus) with the owner decision
   recorded; tags/CMP/ads ship disabled behind a site-config switch; embeds
   (IonCourt, YouTube) pass through same-src; CourtReserve, Sendinblue and
   Google Maps stay outbound links.
8. **Code Sync:** the GitHub App registration for the new repo is blocked
   (expired `GH_PAT`); content is authored to da.live regardless and the
   registration command is left for the user.

## Volume caps

Default hands-off caps (100 pages, 20 per template) — inventory is 49 pages,
max template size 18 (program). All pages in scope.

## Roster extension — news archive (2026-09-18T17:08:58Z)

The news listing (`/news`) is client-rendered from `/usta/nc/newsfeed` (909 items);
the BFS could not see its links. A HEAD sweep found **892 live article pages**
(2016–2024; 9 dead, 3 redirects) outside the crawl. The user asked for "all pages",
so the hands-off 100-page cap is treated as a **wave boundary, not a cut**:
wave 1 = the 49 navigable pages (archetypes + siblings); wave 2 = the 892-page
news archive, type `article` (legacy template), delivered sibling-tier through
the scripted article importer with the `news` listing fed document-first from the
newsfeed snapshot. Recorded as a named hands-off decision; the user can drop wave 2.
