# Canon feedback — en-home-news-holiday-hours-html (static / content-page-template)

**Header height differs per template.** On this page the live fixed header measures **229px at 1440 / 176px at 360**
(lift: `div#headerContainer.cmp-container.top-fixed` rect h=229 / 176; gate 1440 iter1 stitched capture: alert banner
at y 8–63, rule 63–71, nav row 71–191, 8px white 191–199, breadcrumb 199–229). Canon (`canon.css`) carries
213 / 160 — measured on the proxy-template page (/en/home/play/programs.html) where the header column has no padding.

Cause: the header's `.aem-GridColumn` on content-page-template pages carries the foundation `padding: 8px 0`
(8px above the alert banner, 8px below the nav row, above the breadcrumb).

Measured in gate iter1 (1440): live BOOK NOW button rows 111–150 vs build 103–142 (+8), breadcrumb text 212–220 vs
196–204 (+16); header crop 13.30% diff, texture thick (pure 8px/16px misalignment).

Compensation applied in `css/en-home-news-holiday-hours-html.css` (page CSS, canon untouched):
```css
:root{--header-height:229px}
.top-nav{padding:8px 0}
@media (max-width:767px){ :root{--header-height:176px} }
```
Suggestion for canon: expose the padded variant as a body/page modifier (e.g. `body.tpl-content .top-nav{padding:8px 0}`
with `--header-height` 229/176) so every content-page-template archetype (programs/legacy pages excluded) can opt in
without duplicating the rule.
