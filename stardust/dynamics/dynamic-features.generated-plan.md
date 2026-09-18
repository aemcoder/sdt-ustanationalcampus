<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-09-18T17:00:37.636Z · input stardust/current/_dynamics.json (12 pages, 32 findings) · target probe https://main--sdt-ustanationalcampus--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 12/12 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-digitaldata | A | CMS / app settings object digitalData | 12/12 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 12/12 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | a-cms-app-settings-object-granite | A | CMS / app settings object Granite | 12/12 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | a-unknown-third-party-host-ep1-adtrafficquality-google | A | unknown third-party host ep1.adtrafficquality.google | 6/12 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-cms-app-settings-object-cq | A | CMS / app settings object CQ | 1/12 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 7 | a-first-party-api-get-usta-events | A | first-party API GET /usta/events | 1/12 (reach 1/50) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 8 | a-first-party-api-get-usta-nc-newsfeed | A | first-party API GET /usta/nc/newsfeed | 1/12 (reach 1/50) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 9 | a-unknown-third-party-host-ioncourt-com | A | unknown third-party host ioncourt.com | 1/12 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | a-unknown-third-party-host-firebase-googleapis-com | A | unknown third-party host firebase.googleapis.com | 1/12 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-unknown-third-party-host-firebaseinstallations-googleapis- | A | unknown third-party host firebaseinstallations.googleapis.com | 1/12 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 12 | a-unknown-third-party-host-api-ioncourt-com | A | unknown third-party host api.ioncourt.com | 1/12 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 13 | cr-client-framework-vue | CR | client framework vue | 1/12 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 14 | d-first-party-data-file-get-libs-granite-csrf-token-json | D | first-party data file GET /libs/granite/csrf/token.json | 12/12 (reach 50/50) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 15 | f-form-less-control-group-in-body-3-controls-submit-search | F | form-less control group in body (3 controls, submit "Search") | 1/12 | client-only | self | pending | client-compute | none |  |
| 16 | i18n-locale-variants-us | I18N | locale variants us | 1/12 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 17 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 12/12 (reach 2/50) | rebuild-native | self | pending | chrome-interaction | none (motion-observe evidence) |  |
| 18 | t-consent-onetrust | T | consent: OneTrust | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 19 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-www-googletagservices-com | T | unknown third-party host www.googletagservices.com | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-www-google-it | T | unknown third-party host www.google.it | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-sync-crwdcntrl-net | T | unknown third-party host sync.crwdcntrl.net | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-ep2-adtrafficquality-google | T | unknown third-party host ep2.adtrafficquality.google | 6/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-unknown-third-party-host-csi-gstatic-com | T | unknown third-party host csi.gstatic.com | 1/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-www-gstatic-com | T | unknown third-party host www.gstatic.com | 1/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-ioc-prod-secure-photos-s3-us-east | T | unknown third-party host ioc-prod-secure-photos.s3.us-east-1.amazonaws.com | 1/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 12/12 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 32 | x-sign-in-account-links | X | sign-in / account links | 12/12 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 8 row(s) — read-settings, settled-dom-snapshot, sheet-sync, client-compute, chrome-interaction.
- **One owner decision batch:** 23 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · scope of the locale trees · CMP domain script reuse on the new host · which tags run on the new host; property ids · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 3 of 3 probed API paths — the off-origin data work.

## Phases

- **tags** — 13
- **detect** — 10
- **off-origin data** — 2
- **capture** — 1
- **data** — 1
- **client tools** — 1
- **locale wave** — 1
- **interactive** — 1
- **embeds** — 1
- **register** — 1
