/**
 * tile-mosaic — photo tile compositions (reconstructive).
 *
 * Schema: stardust/eds-schema/index.json §mosaic · stardust/eds-schema/about.json §events
 * Authoring — default (home): one row per tile; the FIRST row is the large tile
 *   (`<p><img></p>` · h2 · `<p><strong><a>` CTA), every other row a side tile
 *   (optional `<p><img></p>` · h3, optionally linked). A tile with no photo renders on solid blue.
 * Variant `collage` (hub events): three rows — feature tile (h3 · `<p><img>` icon · `<p><strong>`
 *   label · `<p><img>` arrow), a collage row of N `<p><img></p>`, and a single photo row.
 * Variant `programs` (hub pages events/programs): first row = the large tile (photo · h2/h3 ·
 *   optional h5 date · p · CTA), the remaining rows = side tiles (photo · h3/h5/h6 · p) laid out
 *   2-up (two side tiles: full height; four: 2×2). A side tile without a photo is the solid blue
 *   tile (heading centred, trailing h5 + arrow picture as its footer).
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
  const programs = block.classList.contains('programs');
  rest.forEach((nodes) => {
    const media = nodes.filter(isMedia);
    const texts = nodes.filter((n) => !isMedia(n));
    const heading = texts.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
    // programs: a tile authored PHOTO-FIRST is a photo tile; one that opens with its heading is the
    // solid blue tile, whose trailing sub-heading + arrow picture form its footer
    const photoFirst = !!nodes.length && isMedia(nodes[0]);
    const solid = programs ? !photoFirst : !media.length;
    const footerHead = programs && solid
      ? texts.filter((n) => n.matches('h3, h4, h5, h6') && n !== heading).pop() || null : null;
    const tile = div(solid ? 'tile solid' : 'tile photo');
    if (!solid) tile.append(div('tile-media', ...media));
    const captionTexts = texts.filter((n) => n !== footerHead);
    tile.append(div('tile-caption', div('tile-caption-text', ...captionTexts)));
    if (footerHead) tile.append(div('tile-footer', footerHead, ...media));
    else if (solid && media.length) tile.append(div('tile-footer', ...media));
    side.append(tile);
  });
  block.replaceChildren(main, side);
}

// the source tiles are whole-tile clickable (cmp-container--clickable data-redirect-url):
// a tile whose heading is a link navigates on click anywhere in the tile (the authored
// anchor stays the real link)
function clickThrough(block) {
  block.querySelectorAll('.tile, .tile-mosaic-main').forEach((tile) => {
    const link = tile.querySelector(':is(h1, h2, h3, h4, h5, h6) a[href]');
    if (!link) return;
    tile.classList.add('linked');
    tile.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (link.target === '_blank') window.open(link.href, '_blank', 'noopener');
      else window.location.assign(link.href);
    });
  });
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children].flatMap(collectNodes));
  block.classList.add(`side-${block.querySelectorAll('.tile-mosaic-side > .tile').length}`);
  if (block.classList.contains('collage')) decorateCollage(block, rows);
  else decorateMosaic(block, rows);
  clickThrough(block);
}
