/**
 * tile-mosaic — photo tile compositions (reconstructive).
 *
 * Schema: stardust/eds-schema/index.json §mosaic · stardust/eds-schema/about.json §events
 * Authoring — default (home): one row per tile; the FIRST row is the large tile
 *   (`<p><img></p>` · h2 · `<p><strong><a>` CTA), every other row a side tile
 *   (optional `<p><img></p>` · h3, optionally linked). A tile with no photo renders on solid blue.
 * Variant `collage` (hub events): three rows — feature tile (h3 · `<p><img>` icon · `<p><strong>`
 *   label · `<p><img>` arrow), a collage row of N `<p><img></p>`, and a single photo row.
 * Every authored element is MOVED into a generated wrapper (EW1/EW2); no text is copied.
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

const isMedia = (node) => node.matches('picture, img')
  || (!!node.querySelector('picture, img') && !node.textContent.trim());

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

function decorateCollage(block, rows) {
  const tiles = rows.map((nodes) => {
    const heading = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
    const media = nodes.filter(isMedia);
    if (heading) {
      const tile = div('tile feature');
      const texts = nodes.filter((n) => n !== heading && !isMedia(n));
      tile.append(div('tile-title', heading));
      if (media[0]) tile.append(div('tile-icon', media[0]));
      const row = div('tile-row');
      if (texts.length) row.append(div('tile-label', ...texts));
      if (media[1]) row.append(div('tile-arrow', media[1]));
      tile.append(row);
      return div('tile-wrap feature', tile);
    }
    if (media.length > 1) {
      const collage = div('tile collage', ...media.map((m) => div('collage-item', m)));
      return div('tile-wrap collage', collage);
    }
    return div('tile-wrap photo', div('tile photo', ...nodes));
  });
  block.replaceChildren(...tiles);
}

function decorateMosaic(block, rows) {
  const [first, ...rest] = rows;
  const main = div('tile-mosaic-main');
  if (first) {
    const media = first.filter(isMedia);
    const heading = first.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
    const ctas = first.filter((n) => n.matches('p') && n.querySelector('a') && !isMedia(n));
    const others = first.filter((n) => !isMedia(n) && n !== heading && !ctas.includes(n));
    main.append(div('tile-media', ...media));
    const panel = div('tile-panel');
    if (heading) panel.append(div('tile-panel-text', heading));
    if (others.length) panel.append(div('tile-panel-copy', ...others));
    if (ctas.length) panel.append(div('tile-panel-cta', ...ctas));
    main.append(panel);
  }
  const side = div('tile-mosaic-side');
  rest.forEach((nodes) => {
    const media = nodes.filter(isMedia);
    const texts = nodes.filter((n) => !isMedia(n));
    const tile = div(media.length ? 'tile photo' : 'tile solid');
    if (media.length) tile.append(div('tile-media', ...media));
    tile.append(div('tile-caption', div('tile-caption-text', ...texts)));
    side.append(tile);
  });
  block.replaceChildren(main, side);
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children].flatMap(collectNodes));
  if (block.classList.contains('collage')) decorateCollage(block, rows);
  else decorateMosaic(block, rows);
}
