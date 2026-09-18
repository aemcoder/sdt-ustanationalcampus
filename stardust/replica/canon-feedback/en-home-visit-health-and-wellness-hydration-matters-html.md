# Canon feedback — en-home-visit-health-and-wellness-hydration-matters-html (legacy "article" archetype)

**Footer link list pitch differs on the legacy template (body.page).**

- Instrument: `chrome-parity.mjs @360` iter1 → `REGION BOX Δh +19px (1124→1143)`, PAIR deltas growing +2px per link
  ("Careers" +3 … "PLAYER DEVELOPMENT" +19), copyright +18. Live legacy pitch: About y2396 → Careers y2439 = **43px**
  (li box 21px = the link's 12px/21px line box + 22px margin). Canon: `.site-footer__links li{line-height:22.8571px}` → 44.86px pitch.
- Cause: the legacy clientlib (`nationalcampus_clientlibs_usta-proxy.css`) restyles base elements (`li{display:inline-block}`,
  `p{margin:0}`, `body{line-height:1.42857}`), so the SAME footer XF renders with a 21px li on legacy pages. The modern
  template (canon reference `/en/home/play/programs.html`) renders 22.86px.
- At 1440 the footer height is unaffected (schedule column is the tallest), but the link rows still sit 2px/row higher on live.
- Compensation in `css/en-home-visit-health-and-wellness-hydration-matters-html.css`: `body.page .site-footer__links li{line-height:21px}`.
- Suggested canon change: `body.page .site-footer__links li{line-height:21px}` in canon.css (legacy-template variant), or
  drive the value from a `--footer-li-lh` custom property that legacy pages set.
