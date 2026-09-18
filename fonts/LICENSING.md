# Font licensing — ⚠️ confirm before publishing to aem.live

| file | family | foundry | status |
|---|---|---|---|
| Graphik-Regular-App.woff2 | Graphik Regular | Commercial Type (licensed to USTA; self-hosted on ustanationalcampus.com) | **licence for the new host to be confirmed by USTA** |
| Graphik-Semibold-App.woff2 | Graphik Semibold | Commercial Type | same |
| GraphikXXCondensed-Bold-App.woff2 | Graphik XXCondensed Bold | Commercial Type | same |

These are the exact files the source site serves (harvested by stardust extract, same licensee).
They are shipped for brand fidelity in the replica migration. If the licence cannot be confirmed for
the new domain, delete the three `.woff2` files and their `@font-face` rules in `styles/fonts.css`;
every stack falls back to the metric-matched system faces declared in `styles/styles.css`
(`graphik-fallback`, `graphik-semibold-fallback`, `graphik-xxcond-fallback`).
