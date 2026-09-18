/**
 * accordion — Block Collection `accordion` model (D11), one row per item (reconstructive).
 *
 * Schema: stardust/eds-schema/play-private-lessons.json §lesson-types (3 items) · §faq (6 items)
 * Authoring: one row per item — title cell (p, the collection's summary text) · panel cell
 *   (paragraphs, lists, links).
 * Variant `pricing`: the panel is a price grid authored as bold-led pairs —
 *   `<p><strong>Role</strong></p><p>$110.00/hour</p>` … — rendered as a header row + value row.
 * Variant `band sage|clay`: the block reabsorbs its section's default content into a full-bleed
 *   colour band (photo half + content half): the heading BEFORE the block, and the CTA
 *   paragraphs, note and photo AFTER it are MOVED into the band (EW8); the emptied wrappers go.
 * EW7: the title lives in a div (the whole header row toggles), the button is chevron-only.
 * Single expansion, as the source (data-cmp-single-expansion).
 */
function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

const isMedia = (node) => node.matches('picture, img')
  || (!!node.querySelector('picture, img') && !node.textContent.trim());

let counter = 0;

function buildPriceGrid(nodes) {
  const isHead = (p) => {
    const strong = p.querySelector(':scope > strong, :scope > b');
    return !!strong && strong.textContent.trim() === p.textContent.trim();
  };
  const head = div('price-row head');
  const body = div('price-row body');
  const rest = [];
  nodes.forEach((n) => {
    if (n.matches('p') && isHead(n)) head.append(div('price-cell', n));
    else if (n.matches('p') && n.textContent.trim()) body.append(div('price-cell', n));
    else rest.push(n);
  });
  const table = div('price-table', head, body);
  table.setAttribute('role', 'table');
  head.setAttribute('role', 'row');
  body.setAttribute('role', 'row');
  table.querySelectorAll('.price-cell').forEach((c) => c.setAttribute('role', 'cell'));
  return [table, ...rest];
}

function toggle(item, block) {
  const open = !item.classList.contains('expanded');
  if (open) {
    block.querySelectorAll(':scope .accordion-item.expanded').forEach((other) => {
      other.classList.remove('expanded');
      other.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
      other.querySelector('.accordion-panel').setAttribute('aria-hidden', 'true');
    });
  }
  item.classList.toggle('expanded', open);
  item.querySelector('.accordion-toggle').setAttribute('aria-expanded', String(open));
  item.querySelector('.accordion-panel').setAttribute('aria-hidden', String(!open));
}

function buildItem(row, block, pricing) {
  counter += 1;
  const id = `accordion-${counter}`;
  const cells = [...row.children];
  let titleNodes;
  let panelNodes;
  if (cells.length >= 2) {
    titleNodes = [...cells[0].children];
    panelNodes = cells.slice(1).flatMap((c) => [...c.children]);
  } else {
    const nodes = [...(cells[0] ? cells[0].children : [])];
    const heading = nodes.find((n) => n.matches('h2, h3, h4, h5, h6'));
    titleNodes = heading ? [heading] : nodes.slice(0, 1);
    panelNodes = nodes.filter((n) => !titleNodes.includes(n));
  }
  const title = div('accordion-title', ...titleNodes);
  title.id = `${id}-title`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'accordion-toggle';
  button.id = `${id}-button`;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', `${id}-panel`);
  button.setAttribute('aria-label', 'Toggle');
  const header = div('accordion-header', title, button);
  const inner = div('accordion-panel-inner', ...(pricing ? buildPriceGrid(panelNodes) : panelNodes));
  const panel = div('accordion-panel', inner);
  panel.id = `${id}-panel`;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', `${id}-title`);
  panel.setAttribute('aria-hidden', 'true');
  const item = div('accordion-item', header, panel);
  header.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    toggle(item, block);
  });
  return item;
}

function buildBand(block, items) {
  const wrapper = block.parentElement;
  const section = wrapper?.parentElement;
  const prev = wrapper?.previousElementSibling;
  const next = wrapper?.nextElementSibling;
  const grid = div('band-grid');
  if (prev && prev.classList.contains('default-content-wrapper')) {
    grid.append(div('band-head', ...prev.children));
    prev.remove();
  }
  grid.append(items);
  const photo = div('band-photo');
  if (next && next.classList.contains('default-content-wrapper')) {
    const nodes = [...next.children];
    const media = nodes.filter(isMedia);
    const ctas = nodes.filter((n) => !isMedia(n) && n.querySelector('a.button, em > a, strong > a'));
    const notes = nodes.filter((n) => !isMedia(n) && !ctas.includes(n));
    if (ctas.length) grid.append(div('band-actions', ...ctas));
    if (notes.length) grid.append(div('band-note', ...notes));
    photo.append(...media);
    next.remove();
  }
  block.replaceChildren(div('band-content', grid), photo);
  if (section) section.classList.add('band-container');
}

export default function decorate(block) {
  const pricing = block.classList.contains('pricing');
  const items = div('accordion-items', ...[...block.children].map((row) => buildItem(row, block, pricing)));
  if (block.classList.contains('band')) buildBand(block, items);
  else block.replaceChildren(items);
}
