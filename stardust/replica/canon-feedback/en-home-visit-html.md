# canon feedback — en-home-visit-html (legacy USTA template family)

Measured 2026-09-18, `chrome-parity.mjs … --width 360 --region footer=footer` (evidence:
`stardust/replica/gates/en-home-visit-html-360/chrome-parity-footer-iter1.json`) — 25/25 footer texts paired, no MISSING/EXTRA,
one systematic delta: the "Usta info" / "Usta links" rows drift +2px per row (Careers +3, Terms of Use +5, … PLAYER DEVELOPMENT +19),
footer box Δh +19px (live 1124 → build 1143 at 360).

Cause: `canon.css` `.site-footer__links li{margin-bottom:22px;line-height:22.8571px}` was lifted on the modern template
(programs.html, body line-height 1.42857 → li line box 22.857px, pitch 44.86). On the legacy family (`body.page`,
`#mainContent.mainContainerWrap`) the live body line-height is 1.2 (19.2px), so the li line box is governed by the link's own
`line-height:21px` → pitch 43px. Live footer height therefore differs per template family: 1142 (programs.html) vs 1124 (visit.html) at 360.
At 1440 the column layout hides the height effect but the link rows still shift 2px each (visible as doubled link text in the
1440 footer diff, footer band 0.73%).

Suggested canon change (not applied — canon is frozen for this pass): make the li line-height family-aware, e.g.
`body.page .site-footer__links li{line-height:21px}`, or lift the footer once per template family.
Compensation applied in `css/en-home-visit-html.css` (last rule, scoped to `body.page`).

Addendum (iteration 2 at 360): `line-height:21px` alone left 1px per row (Δh −10): the 16px li strut baseline-aligned with the
12px link still produces a 22px line box. Matching the strut to the link (`font-size:12px;line-height:21px` on the li) yields the
measured live pitch of 43px exactly (build link tops 3763/3806/3849/… at 360 == chrome-parity live values; footer 1124, doc 4332).

## Header (chrome-parity header@360, `#headerContainer|header`, 6/6 paired) — evidence
`stardust/replica/gates/en-home-visit-html-360/chrome-parity-header-iter3.json`
- Alert banner text: live `b` line-height 18.2px / `a` 18.2px (the text is a `<p>` and the legacy family's p line-height is 1.3)
  vs canon 20px / 19.984px → Δh +3 / +2. Compensated: `body.page .alert-banner__text,body.page .alert-banner__text a{line-height:1.3}`.
  At 1440 the header parity is quiet with the rule in place (16/16 paired; only sr-only "submenu" UA-button font and
  BOOK NOW line-height "normal" — non-rendering).
- Breadcrumb: live crumbs at li y 121 / a y 135 (@360) vs canon 123 / 137 — the `nav` line box measures 42px and the
  inline-flex `ol` rides its baseline 2px down. Compensated: `body.page .breadcrumb ol{vertical-align:top}` (li 121 @360,
  184 @1440 build-side). Suggest adding `vertical-align:top` (or `display:flex` on the nav) to canon for every family —
  the same 2px shift shows as doubled crumb glyphs in the 1440 diff on this page.
Result after compensation: header band @360 2.89% → 0.01%; @1440 0.11% → 0.00%; footer @360 0.96% → 0.55%; @1440 0.73% → 0.21%.
