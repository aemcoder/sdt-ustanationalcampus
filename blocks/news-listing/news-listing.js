/**
 * news-listing — the /news "News and Photos" feed (.newsMainWrap): 4-up floated white cards
 * (image · red category · title · date), whole card a link, "More" loads the next 8.
 * Tier: index-backed, document-first (stardust/dynamic-features.md — news feed). The section
 * head (h1 title + tagline) is default content before the block (style `legacy-heading`);
 * the "More" label is the default-content paragraph AFTER the block, reabsorbed as the
 * load-more control (EW8).
 *
 * Authoring rows (one row per card, the first 8 items — container shape):
 *   1. picture (optional — the source feed has image-less items)
 *   2. <p> category · <p> date
 *   3. <h3><a href="/news/…">title</a></h3>
 * Load more: GET /news/query-index.json (offset/limit) — rows {path, title, description,
 * image, category|kicker, published-date|date}; falls back to the snapshot /data/newsfeed.json
 * (feedData rows {link, title=category, description, date, imageLink}) when the index has no
 * news sheet.
 *
 * @ew-exempt all loaded items — index-driven top-up (authored rows are the document-first set)
 */

const PAGE = 8;
const SOURCE = 'https://www.ustanationalcampus.com';

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

// the migration URL rule (stardust/redirects.tsv): /en/home/<path>.html → /<path>,
// ---/-- → -, no trailing -
function localPath(link) {
  try {
    const u = new URL(link, SOURCE);
    if (u.origin !== SOURCE) return u.href;
    return u.pathname.replace(/^\/en\/home/, '').replace(/\.html$/, '')
      .replace(/-{2,}/g, '-').replace(/-+(\/|$)/g, '$1') || '/';
  } catch { return link; }
}

// authored row → card (moves every authored node; the inner anchor is unwrapped, EW6)
function decorateRow(row) {
  const cells = [...row.children];
  const mediaCell = cells.find((c) => c.querySelector('picture, img'));
  const linkCell = cells.find((c) => c !== mediaCell && c.querySelector('a[href]'));
  const metaCell = cells.find((c) => c !== mediaCell && c !== linkCell) || null;
  const link = linkCell ? linkCell.querySelector('a[href]') : null;
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'news-card';
  if (link) card.href = link.getAttribute('href');
  const media = div('news-card-media');
  if (mediaCell) media.append(mediaCell.querySelector('picture, img'));
  else media.classList.add('empty');
  card.append(media);
  const text = div('news-card-text');
  if (metaCell) {
    const ps = [...metaCell.querySelectorAll('p')];
    const [category, date] = ps;
    if (category) text.append(div('news-card-category', category));
    if (linkCell) {
      const heading = linkCell.querySelector('h2, h3, h4') || linkCell.firstElementChild;
      if (heading) text.append(div('news-card-title', heading));
    }
    if (date) text.append(div('news-card-date', date));
    ps.slice(2).forEach((p) => text.append(div('news-card-extra', p)));
  } else if (linkCell) {
    const heading = linkCell.querySelector('h2, h3, h4') || linkCell.firstElementChild;
    if (heading) text.append(div('news-card-title', heading));
  }
  if (link) link.replaceWith(...link.childNodes);
  card.append(text);
  return div('news-item', card);
}

// index / snapshot row → card (runtime values; not authored)
function buildCard(item) {
  const card = document.createElement('a');
  card.className = 'news-card';
  card.href = item.path;
  const media = div('news-card-media');
  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.category || '';
    img.loading = 'lazy';
    media.append(img);
  } else media.classList.add('empty');
  const text = div('news-card-text');
  const cat = document.createElement('p');
  cat.textContent = item.category || '';
  const title = document.createElement('h3');
  title.textContent = item.title || '';
  const date = document.createElement('p');
  date.textContent = item.date || '';
  text.append(div('news-card-category', cat), div('news-card-title', title), div('news-card-date', date));
  card.append(media, text);
  return div('news-item', card);
}

async function fetchIndexPage(offset) {
  try {
    const resp = await fetch(`/news/query-index.json?offset=${offset}&limit=${PAGE}`);
    if (!resp.ok) return null;
    const json = await resp.json();
    const sheet = json[':type'] === 'multi-sheet' ? json.news : json;
    if (!sheet || !Array.isArray(sheet.data)) return null;
    return {
      total: sheet.total ?? sheet.data.length,
      items: sheet.data.map((r) => ({
        path: r.path,
        title: r.description && r.title && r.description !== r.title ? r.title : (r.title || r.description || ''),
        category: r.category || r.kicker || '',
        date: r['published-date'] || r.publisheddate || r.date || '',
        image: r.image || '',
      })),
    };
  } catch { return null; }
}

let snapshot = null;
async function fetchSnapshotPage(offset) {
  try {
    if (!snapshot) {
      const resp = await fetch('/data/newsfeed.json');
      const json = await resp.json();
      const feed = Array.isArray(json) ? json.find((x) => Array.isArray(x.feedData)) : json;
      snapshot = (feed && feed.feedData) || [];
    }
    return {
      total: snapshot.length,
      items: snapshot.slice(offset, offset + PAGE).map((r) => ({
        path: localPath(r.link),
        title: r.description || '',
        category: r.title || '',
        date: r.date || '',
        image: r.imageLink ? new URL(r.imageLink, SOURCE).href : '',
      })),
    };
  } catch { return { total: 0, items: [] }; }
}

export default function decorate(block) {
  const rows = [...block.children];
  const grid = div('news-grid', ...rows.map(decorateRow));
  block.replaceChildren(grid);
  const authored = rows.length;

  // "More" — the default-content paragraph after the block becomes the load-more control (EW8)
  const wrapper = block.parentElement;
  const after = wrapper && wrapper.nextElementSibling;
  const moreP = after && after.classList.contains('default-content-wrapper')
    ? [...after.querySelectorAll('p')].find((p) => p.textContent.trim() && !p.querySelector('a, picture, img')) : null;
  if (!moreP) return;
  const more = div('news-more');
  more.setAttribute('role', 'button');
  more.tabIndex = 0;
  more.append(moreP);
  if (!after.textContent.trim()) after.remove();
  block.append(more);

  // xs shows 4 tiles first (source .newsMainWrap); the first "More" reveals the other authored rows
  const folded = window.matchMedia('(width <= 767px)').matches ? [...grid.children].slice(4) : [];
  folded.forEach((card) => { card.hidden = true; });

  let offset = authored;
  let busy = false;
  let useSnapshot = false;
  const load = async () => {
    if (busy) return;
    if (folded.length) {
      folded.splice(0).forEach((card) => { card.hidden = false; });
      return;
    }
    busy = true;
    more.classList.add('loading');
    let page = useSnapshot ? null : await fetchIndexPage(offset);
    if (!page) { useSnapshot = true; page = await fetchSnapshotPage(offset); }
    page.items.forEach((item) => grid.append(buildCard(item)));
    offset += page.items.length;
    if (!page.items.length || offset >= page.total) more.hidden = true;
    more.classList.remove('loading');
    busy = false;
  };
  more.addEventListener('click', load);
  more.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); } });
}
