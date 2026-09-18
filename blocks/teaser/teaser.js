/**
 * teaser — photo + title + copy + text link rows (reconstructive).
 *
 * Schema: stardust/eds-schema/about.json §teasers (4 units, uniform: false — 2 half + 2 full)
 * Authoring: one row per teaser — media cell (`<p><img></p>`) · text cell (h3 · p… · p > a).
 *   A single flattened cell (DA) is segmented on the same content rules.
 * Variants: `half` (two-up: 1/3 photo + 2/3 text), default (full width: 1/6 photo band + 5/6 text).
 * The link is a plain underlined text link, not a button (anti-pattern 12).
 */
function collectNodes(cell) {
  let kids = [...cell.children];
  // #104 — expand the runtime's wrapTextNodes fold of a media-led cell
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
    && kids[0].querySelector('picture, img') && kids[0].textContent.trim()) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      if (n.textContent.trim()) { const p = document.createElement('p'); p.append(n); return p; } // harness-only
      return null;
    }).filter(Boolean);
  }
  return kids;
}

export default function decorate(block) {
  const rows = [...block.children];
  const items = rows.map((row) => {
    const nodes = [...row.children].flatMap(collectNodes);
    const item = document.createElement('div');
    item.className = 'teaser-item';
    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'teaser-media';
    const text = document.createElement('div');
    text.className = 'teaser-text';
    nodes.forEach((node) => {
      const isMedia = node.matches('picture, img')
        || (node.querySelector('picture, img') && !node.textContent.trim());
      if (isMedia) mediaWrap.append(node);
      else text.append(node);
    });
    if (mediaWrap.childElementCount) item.append(mediaWrap);
    item.append(text);
    return item;
  });
  block.replaceChildren(...items);
}
