/**
 * service-tiles — the legacy USTA "guest services" tile grid (.guestServiceMainWrap / .boxTile):
 * 3-column white tiles (image · title · lede · "View More") where clicking a tile opens a
 * row-spanning white detail panel under its row (Bootstrap collapse, one open per grid),
 * the tile gets a red underline and a white pointer arrow. Used by /visit, /visit/sustainability,
 * /visit/health-and-wellness, /play/tennis, /events/collegiate. Tier: reconstructive
 * (container block). Schema: stardust/eds-schema/visit.json § guest-services.
 *
 * Authoring rows (one row per tile, 2–4 cells, David's Model container shape):
 *   1. picture (tile image)
 *   2. tile text: <h3> title · <p> lede (optional) · <p> toggle label ("View More")
 *   3. detail (optional): optional leading <p><picture> secondary image, <h4> heading,
 *      optional <h5> sub-heading, then rich text (paragraphs / lists / links) — left column
 *   4. detail right column (optional): rich text
 * The section head (heading + sub-heading) is DEFAULT CONTENT before the block
 * (section style `legacy-heading legacy-canvas`), styled in place — nothing to reabsorb.
 *
 * EW: every authored element is MOVED into generated wrappers (EW1–EW3); the close control is
 * a generated icon-only <button aria-label> (no words added, #100); the toggle label paragraph
 * is authored ("View More") and moved into the tile's hover overlay + mobile link slot.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

const SLUG = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const grid = document.createElement('div');
  grid.className = 'service-tiles-grid';
  const tiles = [];
  const panels = [];
  const base = SLUG(block.closest('.section')?.querySelector('h1, h2')?.textContent || 'tile');

  rows.forEach((row, i) => {
    const cells = [...row.children];
    // classify cells: media = picture-only cell; text = the cell holding the h3
    // (or the first non-media cell)
    const mediaCell = cells.find((c) => c.querySelector('picture, img')
      && !c.querySelector('h1, h2, h3, h4, h5, h6, ul, ol') && c.textContent.trim() === '');
    const textCell = cells.find((c) => c !== mediaCell && c.querySelector('h3, h2, h4')) || cells.find((c) => c !== mediaCell);
    const detailCells = cells.filter((c) => c !== mediaCell && c !== textCell && c.textContent.trim() !== '');

    // ---- tile (always visible) ----
    const tile = document.createElement('div');
    tile.className = 'service-tile';
    const content = document.createElement('div');
    content.className = 'service-tile-content';
    if (mediaCell) {
      const pic = mediaCell.querySelector('picture, img');
      content.append(wrapNode(pic, 'service-tile-media'));
    }
    const text = document.createElement('div');
    text.className = 'service-tile-text';
    let label = null;
    if (textCell) {
      const heading = textCell.querySelector('h1, h2, h3, h4');
      const ps = [...textCell.querySelectorAll('p')];
      // the toggle label is the LAST paragraph holding an in-page anchor (authored
      // `<p><a href="#tile-id">View More</a></p>`) or, as a fallback, a short bare paragraph
      const last = ps[ps.length - 1];
      const lastLink = last && last.querySelector('a[href^="#"]');
      if (lastLink && last.textContent.trim() === lastLink.textContent.trim()) label = last;
      else if (last && !last.querySelector('a, picture, img') && last.textContent.trim().length <= 24
        && (heading || ps.length > 1)) label = last;
      if (heading) text.append(wrapNode(heading, 'service-tile-title'));
      ps.filter((p) => p !== label).forEach((p) => text.append(wrapNode(p, 'service-tile-lede')));
      // anything else authored in the text cell (lists, extra nodes) rides along
      [...textCell.children].filter((n) => n !== heading && !ps.includes(n))
        .forEach((n) => text.append(n));
    }
    if (label) {
      // the authored label moves into the hover overlay (desktop, the visible copy for editors);
      // the source's second copy — the inline "View More" line shown ≤991px — is a presentational
      // clone with its instrumentation stripped (EW4)
      const more = document.createElement('div');
      more.className = 'service-tile-more';
      more.setAttribute('aria-hidden', 'true');
      more.append(stripInstrumentation(label.cloneNode(true)));
      text.append(more);
    }
    content.append(text);
    if (label) {
      const hover = document.createElement('div');
      hover.className = 'service-tile-hover';
      hover.append(label);
      content.append(hover);
    }
    tile.append(content);
    grid.append(tile);
    tiles.push(tile);

    // ---- detail panel (collapsed) ----
    if (detailCells.length) {
      const panel = document.createElement('div');
      panel.className = 'service-tile-panel';
      const authoredId = label && label.querySelector('a[href^="#"]')
        ? label.querySelector('a[href^="#"]').getAttribute('href').slice(1) : '';
      panel.id = authoredId || `${base}-${i + 1}`;
      panel.hidden = true;
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'service-tile-close';
      close.setAttribute('aria-label', 'Close');
      panel.append(close);
      const detail = document.createElement('div');
      detail.className = 'service-tile-detail';
      const [left, right] = detailCells;
      const firstP = left.firstElementChild;
      if (firstP && firstP.matches('p') && firstP.querySelector('picture, img')
        && firstP.textContent.trim() === '') {
        detail.append(wrapNode(firstP.querySelector('picture, img'), 'service-tile-detail-media'));
        firstP.remove();
        detail.classList.add('has-media');
      }
      const desc = document.createElement('div');
      desc.className = 'service-tile-detail-desc';
      const dh = left.querySelector('h2, h3, h4');
      if (dh) desc.append(wrapNode(dh, 'service-tile-detail-heading'));
      const sub = left.querySelector('h5, h6');
      if (sub) desc.append(wrapNode(sub, 'service-tile-detail-sub'));
      const cols = document.createElement('div');
      cols.className = 'service-tile-detail-cols';
      const colL = document.createElement('div');
      colL.className = 'service-tile-detail-col';
      colL.append(...left.childNodes);
      cols.append(colL);
      if (right) {
        const colR = document.createElement('div');
        colR.className = 'service-tile-detail-col';
        colR.append(...right.childNodes);
        cols.append(colR);
      }
      desc.append(cols);
      detail.append(desc);
      panel.append(detail);
      grid.append(panel);
      panels.push(panel);
      tile.dataset.panel = panel.id;
      content.setAttribute('role', 'button');
      content.tabIndex = 0;
      content.setAttribute('aria-expanded', 'false');
      content.setAttribute('aria-controls', panel.id);
    }
  });

  // grid order: tiles of visual row r take order 2r, their panels 2r+1 (3 columns ≥992,
  // 2 at 768–991, natural order ≤767) — CSS custom properties, so the breakpoint switch is
  // pure CSS
  tiles.forEach((tile, i) => {
    tile.style.setProperty('--r3', Math.floor(i / 3));
    tile.style.setProperty('--r2', Math.floor(i / 2));
    tile.style.setProperty('--c3', i % 3);
    tile.style.setProperty('--c2', i % 2);
    const panel = tile.dataset.panel ? grid.querySelector(`#${tile.dataset.panel}`) : null;
    if (panel) {
      panel.style.setProperty('--r3', Math.floor(i / 3));
      panel.style.setProperty('--r2', Math.floor(i / 2));
    }
  });

  block.replaceChildren(grid);

  const setOpen = (tile, open) => {
    const panel = grid.querySelector(`#${tile.dataset.panel}`);
    if (!panel) return;
    tile.classList.toggle('is-open', open);
    tile.querySelector('.service-tile-content').setAttribute('aria-expanded', String(open));
    if (open) {
      panel.hidden = false;
      panel.style.height = '0px';
      const h = panel.scrollHeight;
      requestAnimationFrame(() => { panel.style.height = `${h}px`; });
      setTimeout(() => { panel.style.height = ''; }, 360);
    } else {
      panel.style.height = `${panel.getBoundingClientRect().height}px`;
      requestAnimationFrame(() => { panel.style.height = '0px'; });
      setTimeout(() => { panel.hidden = true; panel.style.height = ''; }, 360);
    }
  };
  const toggle = (tile) => {
    const open = !tile.classList.contains('is-open');
    tiles.filter((t) => t !== tile && t.classList.contains('is-open')).forEach((t) => setOpen(t, false));
    setOpen(tile, open);
  };
  grid.addEventListener('click', (e) => {
    const close = e.target.closest('.service-tile-close');
    if (close) {
      const panel = close.closest('.service-tile-panel');
      const tile = tiles.find((t) => t.dataset.panel === panel.id);
      if (tile) setOpen(tile, false);
      return;
    }
    const content = e.target.closest('.service-tile-content[role="button"]');
    if (!content) return;
    const link = e.target.closest('a[href]');
    // authored links inside the tile text keep navigating; the in-page "View More" anchor toggles
    if (link && !link.closest('.service-tile-hover')) return;
    e.preventDefault();
    toggle(content.closest('.service-tile'));
  });
  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const content = e.target.closest('.service-tile-content[role="button"]');
    if (!content) return;
    e.preventDefault();
    toggle(content.closest('.service-tile'));
  });
}
