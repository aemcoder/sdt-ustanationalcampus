<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-18T17:00:35Z
  againstInput: https://www.ustanationalcampus.com/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_style-lift.json
    - stardust/current/assets/css/*.css
  synthesizedInputs: []
  stardustVersion: 0.22.1
  mode: descriptive (current state)
-->
---
name: USTA National Campus
description: Big condensed display type over full-bleed campus photography; black on white with USTA blue calls to action and a sage-green footer.
colors:
  white: "#ffffff"
  black: "#000000"
  usta-blue: "#0373f3"
  link-blue: "#0357b8"
  sage: "#92bfb7"
  alert-orange: "#f0aa54"
  contact-grey: "#dcdfcf"
  breadcrumb-grey: "#f4f4f4"
  text-grey: "#333333"
  legacy-navy: "#002649"
  legacy-canvas: "#f5f5f5"
  legacy-card-text: "#444444"
  legacy-red: "#ce1126"
  legacy-blue-link: "#2456b2"
  legacy-teal: "#01675a"
  scrim-50: "rgba(0, 0, 0, 0.5)"
  scrim-75: "rgba(0, 0, 0, 0.75)"
typography:
  display:
    fontFamily: "'Graphik XXCond Bold', 'Graphik Semibold', Arial, sans-serif"
    fontSize: "100px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "'Graphik XXCond Bold', 'Graphik Semibold', Arial, sans-serif"
    fontSize: "76px"
    fontWeight: 500
    lineHeight: 1.1
  title:
    fontFamily: "'Graphik XXCond Bold', 'Graphik Semibold', Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 1.1
  subtitle:
    fontFamily: "'Graphik Semibold', Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.1
  body:
    fontFamily: "'Graphik Regular', Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.333
  body-small:
    fontFamily: "'Graphik Regular', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Graphik Semibold', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "normal"
  button:
    fontFamily: "'Graphik Semibold', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "1px"
  footer-link:
    fontFamily: "'Graphik Regular', Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.083
rounded:
  none: "0px"
  sm: "3px"
  legacy: "4px"
  tile: "10px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  base: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.usta-blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "14px"
    height: "40px"
  button-inverse:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "14px"
    height: "40px"
  button-pill-icon:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "14px 34px 14px 14px"
    height: "56px"
  button-header:
    backgroundColor: "{colors.usta-blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    width: "110px"
    height: "40px"
  button-footer:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    height: "40px"
  nav-link:
    textColor: "{colors.black}"
    typography: "{typography.label}"
  card-legacy:
    backgroundColor: "{colors.white}"
    textColor: "{colors.legacy-card-text}"
    rounded: "{rounded.legacy}"
---

# Design System: USTA National Campus

## Overview

**Creative North Star: "Game Day Poster"** — the site reads like a sports-venue poster: an extra-condensed black or white headline set very large over a full-bleed photograph of real play, a single flat blue button, and nothing decorative in between. Density is low on the modern template (one idea per band, generous white gaps) and higher on the legacy template (three-up cards, info bands, accordions).

The system is two-toned by construction: the modern AEM Core Components template (home, hubs, program landing pages) uses black/white/USTA blue with the sage footer; the legacy USTA template (visit, news, health articles) keeps an older navy/red/grey vocabulary. Both share the same fixed header (orange alert banner + white nav + grey breadcrumb) and sage footer.

**Key Characteristics:**
- Extra-condensed display type (Graphik XXCond Bold) at 100 / 76 / 56 px, never letter-spaced.
- Photography only; images are cover-cropped into fixed-height containers with translucent black scrims behind text.
- Flat buttons, 3 px radius or full pill; no shadows on the modern template.
- Sage-green footer and bands as the only large colour field besides photos.
- Uppercase Semibold small labels (nav, footer headings, stat labels, buttons).

## Colors

Black text on white, one saturated blue for action, one muted green for grounding bands.

### Primary
- **USTA Blue** (#0373f3): every primary call to action (header BOOK NOW, in-page buttons, the "Book a Court" tile). Never used for text.
- **Link Blue** (#0357b8): inline text links ("Learn More"), underlined.

### Secondary
- **Sage** (#92bfb7): footer background and full-bleed content bands; also the tab background border.
- **Alert Orange** (#f0aa54): the alert banner at the top of the fixed header.
- **Contact Grey** (#dcdfcf): the "Questions? Contact us." pre-footer band and separators.

### Neutral
- **Black** (#000000): headings, body copy, nav, footer text, pill buttons, footer buttons.
- **White** (#ffffff): page canvas, hero text over photos, button text.
- **Text Grey** (#333333): body text on the legacy template and inside calendar widgets.
- **Breadcrumb Grey** (#f4f4f4): breadcrumb strip.
- **Scrims** rgba(0,0,0,.5) and rgba(0,0,0,.75): translucent boxes behind hero titles and tile captions.

### Legacy accents (visit / news / health pages only)
- **Legacy Navy** (#002649): info band background and section headings.
- **Legacy Canvas** (#f5f5f5): page background behind white cards.
- **Legacy Red** (#ce1126): the short red rectangle after section headings.
- **Legacy Card Text** (#444444), **Legacy Blue Link** (#2456b2), **Legacy Teal** (#01675a, breadcrumb dividers).

### Named Rules
**The One Blue Rule.** #0373f3 appears only on buttons and the single blue tile; text links use the darker #0357b8.
**The Sage Ground Rule.** Sage is the only colour field that touches the page edges besides photography.

## Typography

**Display Font:** Graphik XXCondensed Bold (fallback Graphik Semibold, Arial)
**Body Font:** Graphik Regular (fallback Arial)
**Label Font:** Graphik Semibold

**Character:** Poster-condensed headlines against a neutral grotesque body — sporty, loud at the top of the page, quiet in the copy. Weights are baked into the family files (each face is loaded as its own family name at weight 400/500; CSS weights are nominal).

### Hierarchy
- **Display** (h1, 100px / 110px line, 54px on mobile): hero titles, white on photo or black on white.
- **Headline** (h2, 76px / 83.6px, 44px mobile): section titles and stat numbers.
- **Title** (h3 tiles, 56px / 61.6px, 36px mobile): photo-tile captions, white.
- **Subtitle** (h4/h5, 22px Semibold / 24.2px, 20px mobile): card titles and stat labels (uppercase for stats).
- **Label** (h3 footer, 16px Semibold 700 / 24px, uppercase): footer column headings, nav items.
- **Body** (18px Regular / 24px; 16px / 24px on mobile): paragraphs, card text, Learn More links.
- **Body small** (16px / 24px, 14px / 21px): legacy body, breadcrumbs (12px uppercase), footer links (12px bold uppercase).
- **Legacy headings**: 45px XXCond navy uppercase with 1.4px tracking + red dash; card titles 30px Semibold #444.

### Named Rules
**The No-Tracking Rule.** Display type is never letter-spaced; only 14–18px uppercase buttons carry 1px tracking.
**The Nominal-Weight Rule.** Never synthesize bold: switch family (Regular → Semibold → XXCond Bold).

## Layout

Fixed header (213px at 1440: 55px alert banner + 129px nav bar + 28px breadcrumb; 160px at 360 with an off-canvas menu behind a hamburger). Content root is a 1200px max-width container with 40px side gutters (120px margins at 1440), except full-bleed containers (hero, tile mosaic, sage/grey bands) that span the viewport. Mosaic tiles sit on an 8px gap grid (large tile 720×505, small tiles 352×247). Card grids are 4-up (modern) or 3-up (legacy) with 24px gutters, collapsing to one column at 360 where the container becomes 336px wide with 12px margins. Section padding is set per container (`padding-top-none/small/large` = 0 / 8 / 8+120px). The footer is a 5-column flex row (logo+newsletter, hours+address, USTA info, USTA links, BOOK NOW) at 1440 and stacks at 360.

## Elevation & Depth

Flat by default. The modern template uses no box shadows; depth comes from photography and translucent black scrims (50% / 75%) behind text. The legacy template lifts white cards with `0 4px 8px rgba(0,0,0,.2)` and uses `0 2px 5px rgba(0,0,0,.5)` on hover.

### Shadow Vocabulary
- **Legacy card** (`box-shadow: 0 4px 8px rgba(0,0,0,.2)`): guest-service and sustainability cards.
- **Legacy hover** (`box-shadow: 0 2px 5px rgba(0,0,0,.5)`): tile hover.

## Shapes

Rectangles. Photo tiles, heroes, bands and cards are square-cornered. Flat buttons carry a 3px radius; icon buttons are full pills (56px tall); legacy cards use 4px; calendar tiles 10px. No circles except social icons.

## Components

- **Alert banner**: 55px orange band, tennis-ball icon, 16px text with an underlined bold link, black × at right; dismissible.
- **Header**: white bar, 300×78 logo left, uppercase 16px Semibold nav (PLAY, EVENTS, ABOUT, WATCH, VISIT) with chevron toggles and two-level dropdowns, blue 110×40 BOOK NOW button right; grey breadcrumb below; position fixed.
- **Hero**: full-bleed photo container 658px tall (cover), 100px display title white bottom-left, or a translucent black box with title + 18px lede + button.
- **Photo tile (clickable container)**: cover photo, 56px white condensed caption bottom-left; used in 1+4 mosaics.
- **Stat band**: four columns, 76px number + 22px uppercase Semibold label.
- **Icon heading**: 75px PNG icon inline before a 76px headline.
- **Card**: 16:9 image, 22px Semibold title, 18px body, underlined "Learn More".
- **Buttons**: primary blue flat 40px; inverse white; black pill with icon 56px; header/footer black or blue 40px squares.
- **Contact band**: grey #dcdfcf band with 76px "Questions? Contact us." and a black pill EMAIL button; app badges centred below.
- **Accordion**: 16px Semibold question rows with chevron, 1px dividers.
- **Tabs**: uppercase labels with an underline indicator on a sage border.
- **Footer**: sage band; logo PNG + black "SIGN UP FOR OUR NEWSLETTER" button; CAMPUS HOURS table; ADDRESS; USTA INFO / USTA LINKS 12px bold uppercase link columns; black BOOK NOW; social icons; "©2026 USTA ALL RIGHTS RESERVED".
- **Legacy card**: white, 4px radius, shadow, image, centred 30px title, 14px #444 text.
- **Legacy info band**: navy band with LOCATION | HOURS columns divided by a 1px rule.
- **Ad slot**: "Advertisement" label + 728×90 creative centred before the footer.

## Do's and Don'ts

- Do set headlines in Graphik XXCond Bold at the captured sizes; don't track or weight-synthesize them.
- Do use USTA blue only on buttons; don't use it for text.
- Do keep the sage footer and grey contact band full-bleed; don't add gradients or rounded cards to the modern template.
- Do keep translucent black scrims behind text on photos; don't add drop shadows.
- Do keep the fixed header including alert banner and breadcrumb; don't collapse it into a static header.
