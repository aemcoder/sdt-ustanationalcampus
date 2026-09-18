# Archetype recreation brief (stardust:replica Phase 3–4) — read by pointer, work by instrument

You are recreating ONE archetype page of https://www.ustanationalcampus.com/ as a clean, standalone
prototype that must pass the measured source-fidelity gate. This is **recreation, not redesign**: no
taste decisions, no "improvements" (the inconsistency register is empty). Every string verbatim.

## Your inputs (read these, by section — never whole documents you don't need)
- Contracts: `/Users/paolo/.claude/plugins/cache/adobe-skills/stardust/0.22.1/skills/replica/reference/recreation-procedure.md`
  (§ Authoring order, § CSS lifting, § Granularity parity, § Role parity, § Fixed and sticky chrome, § Interaction parity) and
  `.../replica/reference/source-fidelity-gate.md` (§ Per-breakpoint procedure, § Pass bar, § Reading the band breakdown,
  § Iteration discipline, § Hardening rules).
- Captured page: `stardust/current/pages/<slug>.json` (verbatim content: headings, body, ctas, media) and
  `stardust/current/pages/<slug>.html` (settled live DOM — parse it offline for structure/text/attributes, never re-scrape)
  and `stardust/current/assets/screenshots/<slug>.png` (ground truth, 1440 wide).
- Lifted values: `stardust/current/_style-lift.json` (per-URL, per-width computed styles of headings, buttons, sections,
  paragraphs, containers, background images, palette) — when your page is not in it, run your own lift with Playwright
  (copy the pattern in `stardust/.work/extract/lift.mjs`) at 1440 AND 360 BEFORE authoring.
- Harvested source CSS: `stardust/current/assets/css/*.css` (grep component class names for exact values).
- Shared canon (ALREADY GATED — chrome-parity quiet at 1440 & 360): `stardust/prototypes/css/canon.css`,
  `stardust/prototypes/js/chrome.js`, `stardust/prototypes/partials/header.html` (replace `<!--BREADCRUMB-->` with the
  page's breadcrumb `<li>`s in the form `<li><a href="…">Home</a> <span class="divider">&gt;</span></li>…<li class="active">Title</li>`)
  and `stardust/prototypes/partials/footer.html`. **Do not edit canon files** — if the canon needs a change for your page,
  write it to `stardust/replica/canon-feedback/<slug>.md` and compensate in your page CSS.
- Dynamic inventory: `stardust/dynamic-features.md` (which widgets/feeds/embeds your page carries and their disposition).

## Your outputs
- `stardust/prototypes/<slug>-proposed.html` — standalone: `<link rel="stylesheet" href="css/canon.css">` +
  `<link rel="stylesheet" href="css/<slug>.css">`; header partial; `<main class="content" id="mainContent">` (adopt the
  live content-root id so `--main "#mainContent"` scopes both sides); footer partial; `<script src="js/chrome.js">` plus
  only the minimal JS the page's OBSERVED interactions need (accordion/tabs/carousel state — implement, don't justify away).
  Provenance comment as first child of `<head>` (see any stardust artifact). Viewport meta + `@media (max-width:767px)`
  rules are mandatory (mobile-adapt audit).
- `stardust/prototypes/css/<slug>.css` — this archetype's modules only. Use `[data-section="…"]` on each top-level
  section and clean BEM-ish classes. Images: reference the LIVE absolute URLs captured in the page HTML (`https://www.ustanationalcampus.com/…`);
  photo containers use `background-image` where the source does.
- `stardust/replica/gates/<slug>-1440/` and `<slug>-360/` — gate evidence (the scripts write them).
- `stardust/replica/motion/<slug>.json` — from `node stardust/scripts/replica/motion-observe.mjs <liveURL> <out.json> --width 1440 --hover <cardSel> --click <widgetControlSel>`
  (ONE run; implement only behaviours that fired).
- `stardust/replica/progress/<slug>.json` — the ledger entry in the format of source-fidelity-gate.md § Residual logging
  (iterations per breakpoint, result, justified flags, residuals with cause, captureState, motion {observed, implemented, dead}).
- `stardust/replica/progress/<slug>.log` — append one line per step (start/end of each iteration with the verdict numbers)
  so the coordinator can follow without waiting.

## Procedure (in this order)
1. Structure + counts from the rendered HTML: list the top-level sections of `#mainContent` (the live page's `.aem-Grid > .container`
   children) with their components and counts (n cards, n accordion items, n slides). Paragraph boundaries come from the source's
   block-level nodes. AEM richtext byte patterns (`<p><br></p>` spacers, `&nbsp;` lines) are load-bearing — mirror them.
2. Lift exact values at 1440 AND 360 (fonts, sizes, line-heights, paddings, container widths, background layers incl. scrims,
   radii, hero heights). Fluid boxes: encode the RULE (%, vw, max-width), not the resolved px.
3. Author the page against the screenshot for composition. Mirror the live wrapping per string (role parity: `<a>` vs `<span>`,
   heading levels, uppercase small labels).
4. Serve: the prototype server is ALREADY running at `http://localhost:8793/` from `stardust/prototypes/` (do not start another;
   if `curl -s -o /dev/null -w '%{http_code}' http://localhost:8793/css/canon.css` is not 200, start
   `(cd stardust/prototypes && python3 -m http.server 8793 &)`). Never use port 8791 (a foreign server owns it).
5. Gate, per breakpoint 1440 then 360, hard cap 3 iterations each:
   ```
   PROTO="http://localhost:8793/<slug>-proposed.html"; LIVE="<live url>"; W=1440; G="stardust/replica/gates/<slug>-$W"; mkdir -p $G
   node stardust/scripts/diff/content-diff.mjs "$LIVE" "$PROTO" --profile generic --width $W --main "#mainContent" --dismiss | tee $G/content-diff-iter1.txt
   node stardust/scripts/diff/visual-diff.mjs  "$LIVE" "$PROTO" --profile generic --width $W --main "#mainContent" --dismiss --out $G/vdiff | tee $G/visual-diff-iter1.txt
   stardust/scripts/replica/gate.sh <slug> "$LIVE" "$PROTO" $W iter1 --marker "<a unique string from your page title>"
   node stardust/scripts/replica/anchor.mjs "$LIVE" --width $W --cache $G/anchor-live.json ; node stardust/scripts/replica/anchor.mjs "$PROTO" --width $W
   ```
   Fix the FIRST hot band / first mismatched anchor top-down; re-run `gate.sh … iter2`. Pixel every round; content/visual diff
   after markup changes and at final. Pass bar: 0 structural 🔴, pixel ≤10% with bands explained, |Δh| ≤ 8px, chrome bands ≤2%
   (run `node stardust/scripts/replica/crop-compare.mjs $G/live.png $G/build.png --y 0 --height 213` (160 at 360) and the footer
   band with `--y <liveDocH-footerH> --y-b <protoDocH-footerH> --height 728` (1142 at 360)). Instrument exit 124 = re-run, not FAIL.
   Do NOT wrap instruments in your own sleep/kill loops.
6. Interaction parity after the static gate: implement observed motion only; re-run gate.sh once — the pixel number must not move.
7. Write the ledger + log. Report back (≤ 40 lines): per breakpoint the final numbers (pixel %, Δh, structural red, chrome bands),
   residuals with causes, capture-state items, and any canon feedback. Never claim a pass you did not measure.

## Hard rules
- Never re-crawl or scrape the live page for content — the captured JSON/HTML is the content source; live hits are only for the
  gate instruments and the computed-style lift (budget them: one live stitch per breakpoint is cached by gate.sh).
- Never fabricate copy; never "fix" the source's typos, placeholders or hydration states.
- Never edit `stardust/prototypes/css/canon.css`, `js/chrome.js`, `partials/*` or any file outside your slug's outputs.
- Never use `--main body`.
