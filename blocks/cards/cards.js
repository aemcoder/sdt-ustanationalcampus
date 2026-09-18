/**
 * cards — Block Collection `cards` model (D11): one row per card (reconstructive).
 *
 * Schema: stardust/eds-schema/index.json §programs (2×4 units) · sibling hub/program pages
 * Authoring: one row per card — `<p><img></p>` · h3 (title) · p (copy) · `<p><a>` (text link).
 *   A card whose link is a CTA (`<em><a>`) renders as the solid-blue PROMO card
 *   (icon · title · copy · inverse button). A flattened single cell (DA) is segmented on the
 *   per-card heading boundary (#52).
 * Variants: `four` (4-up photo cards), `team`, `register`, `event` (sibling pages).
 * Every authored element is MOVED into its card wrapper (EW1/EW2); no text is copied.
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
const isCta = (node) => node.matches('p') && !!node.querySelector('a.button, em > a, strong > a');

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

function segment(rows) {
  let groups = rows.map((row) => [...row.children].flatMap(collectNodes));
  const headings = (g) => g.filter((n) => n.matches('h2, h3, h4, h5')).length;
  if (groups.length === 1 && headings(groups[0]) > 1) {
    const flat = groups[0];
    groups = [];
    flat.forEach((node) => {
      const opens = node.matches('h2, h3, h4, h5')
        || (isMedia(node) && groups.length && groups[groups.length - 1].some((n) => !isMedia(n)));
      if (opens || !groups.length) groups.push([]);
      groups[groups.length - 1].push(node);
    });
  }
  return groups.filter((g) => g.length);
}

export default function decorate(block) {
  const grid = document.createElement('ul');
  grid.className = 'cards-grid';
  segment([...block.children]).forEach((nodes) => {
    const li = document.createElement('li');
    const media = nodes.filter(isMedia);
    const ctas = nodes.filter(isCta);
    const texts = nodes.filter((n) => !isMedia(n) && !ctas.includes(n));
    if (ctas.length) {
      li.className = 'card promo';
      const promo = div('promo-box');
      if (media.length) promo.append(div('promo-icon', div('promo-icon-box', ...media)));
      promo.append(div('promo-text', ...texts));
      promo.append(div('promo-cta', ...ctas));
      li.append(promo);
    } else {
      li.className = 'card';
      if (media.length) li.append(div('card-image', ...media));
      li.append(div('card-text', ...texts));
    }
    grid.append(li);
  });
  block.replaceChildren(grid);
}
