# Learnings ledger — USTA National Campus replica (2026-09-18)

### Client-rendered listing hid 892 pages from discovery
- failure class: capture-gap
- evidence: no sitemap; depth-4 BFS found 50 pages; `/news` renders its list from `/usta/nc/newsfeed` (909 items) at runtime — the archive surfaced only when the dynamics reach roll-up was read against the crawl roster (892 live article URLs, `stardust/.work/extract/newsfeed-liveness.json`)
- proposed change: `skills/extract/reference/ia-extraction.md` § Discovery — after `--dynamics`, feed every same-site JSON feed that returns page links (`link`/`url`/`path` fields) back into discovery as a roster extension, with a HEAD liveness sweep; surface the count as a roster decision in hands-off mode
- status: pending

### Foreign http.server on the suggested prototype port
- failure class: silent-render (instrument measured a foreign site)
- evidence: `lsof -nP -iTCP:8791` showed a Python server from another project; the first chrome-test load returned 404 from it
- proposed change: `skills/replica/reference/source-fidelity-gate.md` § Per-breakpoint procedure — make the port check mandatory in the command block and suggest a hash-derived per-project port (already advised in prose; make it the default in gate.sh via `--port`)
- status: pending

### `--no-save` install pruned playwright mid-fan-out
- failure class: instrument-defect
- evidence: `npm i -D @babel/core --no-save` (for the project eslint parser) removed playwright/pixelmatch/pngjs while six archetype agents were gating; two agents logged ERR_MODULE_NOT_FOUND runs and excluded them from their caps
- proposed change: `skills/extract/SKILL.md` § Setup → `--no-save` installs are ephemeral — add the concrete rule "every later `--no-save` install must re-list playwright pixelmatch pngjs in the same command" and have deploy's lint step name `@babel/core` as a dependency to bundle
- status: pending

### Header height varies per template under one experience fragment
- failure class: capture-gap (canon lifted on one template)
- evidence: canon chrome measured on the proxy template (213/160) vs content-page-template 229/176 (8px transparent strips from the header grid column margin) and legacy family footer link pitch 43 vs 44.86 (`stardust/replica/canon-feedback/*.md`)
- proposed change: `skills/replica/reference/recreation-procedure.md` § Cumulative archetype prototypes — require the chrome lift on one page per template FAMILY before fanning out, and expose template modifiers in canon (body class) rather than per-page compensation
- status: pending

### Whitespace-only spacer paragraphs carry footer height
- failure class: silent-render
- evidence: the live footer's `<p>&nbsp;</p>` spacer (21px + 22px margin) never survives the pipeline; modelled as `margin-top: 65px` on the following paragraph — first attempt (43px) collapsed with the previous margin and lost 22px
- proposed change: `skills/deploy/SKILL.md` § The ENCODE contract (#112) — note that the compensating margin must include the collapsed neighbour margin (max(), not sum)
- status: pending

### AEM legacy component class carried a trailing space
- failure class: importer-bug
- evidence: `class="articleTextDetailImageComp "` on 60 video/gallery articles — an exact-class regex missed them (12 pages classified "other" until the pattern allowed `[^"]*`)
- proposed change: `skills/migrate/reference/template-and-module-rendering.md` § sibling importers — match component classes as tokens, never exact attribute strings
- status: pending

### OneTrust floating button is a permanent capture residual
- failure class: capture-state
- evidence: every live stitched capture repeats the fixed 50×50 consent badge at each chunk seam (0.15–0.75 % per page); the CMP is a decided-out tag on the target
- proposed change: `skills/replica/scripts/stitch-shot.mjs` — dismiss/hide known CMP floating buttons (`#ot-sdk-btn-floating`) in the live-side freeze pass, or document a `--mask` for it in gate.sh
- status: pending

### Legacy template renders in quirks mode (no doctype)
- failure class: capture-gap → delivery residual
- evidence: legacy USTA pages ship without `<!DOCTYPE>`; quirks mode changes line boxes (bold-only `<p>` 24px vs 35px, table line-height normal); standards mode measured main +48px on /news/campus-pro-shop. The article prototypes mirror quirks mode; EDS delivers standards mode, so the delivered legacy pages need explicit line-height/height rules for those cases (`body.legacy` CSS) and carry a documented residual otherwise.
- proposed change: `skills/replica/reference/recreation-procedure.md` § CSS lifting — lift `document.compatMode` per template family and record it as a capture fact; `skills/deploy/SKILL.md` § 3 Foundation — name quirks-mode sources as a class whose line-box deltas must be encoded explicitly
- status: pending

### Pipeline hoists emphasis out of anchors → link-only paragraphs become buttons
- failure class: silent-render (published-origin only; harness passed)
- evidence: `<p><a><strong>VIEW HOLIDAY HOURS</strong></a></p>` delivered as `<p><strong><a>…</a></strong></p>` → `decorateButtons` made it `a.button.primary` (footer +41px on every page; 6 content pages). The harness (no pipeline) rendered it as a bold link.
- proposed change: `skills/deploy/SKILL.md` § The ENCODE contract → Buttons: state that emphasis INSIDE an anchor is normalised to the outside by the pipeline, so a bold standalone link must be styled by the block/section CSS, never authored with `<a><strong>`; add the pattern to `davids-model-lint.mjs` as a 🟡
- status: pending

### `p > img` selectors silently break under the pipeline's `<picture>` wrapper
- failure class: silent-render (harness passed with bare `<img>`)
- evidence: section styles written as `:has(> p > img)` never matched the delivered `<p><picture><img>`; the FAQ icon rendered full-width (+949px on /play/private-lessons). Descendant selectors fixed it.
- proposed change: `skills/deploy/SKILL.md` § 3 Foundation / § 7 brief — forbid `> img` / `> picture` child combinators in block and section CSS; lint for them; make `build-harness.mjs` wrap authored images in `<picture>` so the harness reproduces the pipeline shape
- status: pending

### Zero-width-space paragraphs survive the pipeline — an exact spacer mechanism
- failure class: capture-gap → fix (#112)
- evidence: `<p>&#8203;</p>` delivered intact (`/drafts/zwsp-test`) while `<p>&nbsp;</p>` and trailing `<br>`s are dropped; one ZWSP paragraph per source blank line reproduced the quirks-mode richtext heights (visit 1440: 6.2% → 0.18%, Δh 0)
- proposed change: `skills/deploy/SKILL.md` § The ENCODE contract (#112) — replace "model spacer heights as CSS" with "author one `<p>&#8203;</p>` per source blank line (n−1 for a run of n `<br>`)" for legacy/richtext sources; `migrate/reference/content-preservation.md` § paragraph boundaries
- status: pending

### zsh drops PATH inside for-loops in this harness
- failure class: instrument-defect
- evidence: `tr`, `tail`, `grep` "command not found" inside `for … do` in a Bash-tool command; results silently empty
- proposed change: already in deploy SKILL.md § Deploy (write loops to a script file with absolute binary paths) — surface it in `stardust/SKILL.md` § Setup as a harness-wide rule
- status: pending
