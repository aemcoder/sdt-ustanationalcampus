#!/bin/bash
# Published-origin gate (source-fidelity-gate.md § The published-origin gate): live site vs the EDS preview origin,
# per archetype and breakpoint, using the cached live stitches. Writes gates/<slug>-<w>/published*.png + published.txt.
PUB=https://main--sdt-ustanationalcampus--aemcoder.aem.page
PAIRS="en-home-html:/ en-home-about-html:/about en-home-play-private-lessons-html:/play/private-lessons en-home-visit-html:/visit en-home-visit-health-and-wellness-hydration-matters-html:/visit/health-and-wellness/hydration-matters en-home-news-holiday-hours-html:/news/holiday-hours en-home-about-holiday-hours-html:/about/holiday-hours en-home-news-campus-pro-shop-html:/news/campus-pro-shop"
for pair in $PAIRS; do slug=${pair%%:*}; path=${pair#*:}; for W in 1440 360; do G=stardust/replica/gates/$slug-$W; [ -f "$G/live.png" ] || { echo "$slug $W: no live.png"; continue; }
  code=$(curl -s -o /dev/null -w '%{http_code}' "$PUB$path"); [ "$code" = "200" ] || { echo "$slug $W: $path not live ($code)"; continue; }
  node stardust/scripts/replica/stitch-shot.mjs "$PUB$path" "$G/published.png" --width $W --settle > /dev/null 2>&1 || { echo "$slug $W: stitch failed"; continue; }
  H=$([ $W = 1440 ] && echo 213 || echo 160); [ "$slug" = "en-home-news-holiday-hours-html" -o "$slug" = "en-home-about-holiday-hours-html" ] && H=$([ $W = 1440 ] && echo 229 || echo 176)
  FH=$([ $W = 1440 ] && echo 728 || echo 1142)
  res=$(node stardust/scripts/replica/pixel-compare.mjs "$G/live.png" "$G/published.png" --out "$G/diff-published.png" 2>&1)
  pct=$(echo "$res" | grep -oE 'differing pixels: [0-9]+ / [0-9]+ = [0-9.]+%' | grep -oE '[0-9.]+%$'); dh=$(echo "$res" | grep -oE 'height delta -?[0-9]+px' | head -1)
  hdr=$(node stardust/scripts/replica/crop-compare.mjs "$G/live.png" "$G/published.png" --y 0 --height $H --out "$G/published-header-diff.png" 2>&1 | grep -oE 'match [0-9.]+%')
  LH=$(node -e "const {PNG}=require('pngjs');console.log(PNG.sync.read(require('fs').readFileSync('$G/live.png')).height)"); PH=$(node -e "const {PNG}=require('pngjs');console.log(PNG.sync.read(require('fs').readFileSync('$G/published.png')).height)")
  ftr=$(node stardust/scripts/replica/crop-compare.mjs "$G/live.png" "$G/published.png" --y $((LH-FH)) --y-b $((PH-FH)) --height $FH --out "$G/published-footer-diff.png" 2>&1 | grep -oE 'match [0-9.]+%')
  hot=$(echo "$res" | grep -c '◄◄')
  line="$slug $W $path pixel=$pct $dh header=$hdr footer=$ftr hotBands=$hot liveH=$LH pubH=$PH"; echo "$line"; echo "$line" > "$G/published.txt"
done; done
