// stardust:deploy — legacy USTA template family importer (listing cluster · legacy richtext articles ·
// news-article siblings · content-page holiday hours · the /collegiate/events thin page).
// Reads the captured live DOM (stardust/current/pages/<slug>.html — never re-scrapes) with Playwright
// (JS disabled), classifies each legacy component and emits DA body fragments to content/<path>.html
// following stardust/eds-conversion-log.md (David's Model: prose = default content + section style,
// repeating units = one block row per unit, ≤4 cells, no spans, no layout <br>, no whitespace paragraphs).
//   node stardust/scripts/legacy-author.mjs [slug ...]      (default: every slug in SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ORIGIN = 'https://www.ustanationalcampus.com';
const pagemap = JSON.parse(fs.readFileSync('stardust/.work/pagemap.json', 'utf8'));
const bySource = new Map(Object.values(pagemap).map((p) => [p.source, p]));
const AD_CREATIVE = 'https://content.da.live/aemcoder/sdt-ustanationalcampus/media/ads/728x90-free-30.png';

const SCOPE = {
  listing: ['en-home-visit-html', 'en-home-visit-sustainability-html', 'en-home-visit-health-and-wellness-html',
    'en-home-play-tennis-html', 'en-home-events-collegiate-html', 'en-home-news-html'],
  richtext: ['en-home-visit-health-and-wellness-hydration-matters-html',
    'en-home-visit-health-and-wellness-breakfast-the-most-important-meal-of-the-day-html',
    'en-home-visit-health-and-wellness-fluid-loss-and-body-weight-html',
    'en-home-visit-health-and-wellness-macronutrient-breakdown-carbohydrates-html',
    'en-home-visit-health-and-wellness-macronutrient-breakdown-html',
    'en-home-visit-health-and-wellness-nutrition-for-recovery-html',
    'en-home-visit-health-and-wellness-nutrition-for-tennis-html',
    'en-home-visit-health-and-wellness-sleep-matters-html',
    'en-home-visit-health-and-wellness-strength-and-conditioning-html',
    'en-home-play-events-and-leagues-html'],
  news: ['en-home-news-national-campus-program-policies-html', 'en-home-news-2019-collegiate-winter-wild-card-html',
    'en-home-news-masteruhistory-html', 'en-home-news-campus-pro-shop-html'],
  static: ['en-home-news-holiday-hours-html', 'en-home-about-holiday-hours-html'],
  unique: ['en-home-collegiate-events-html'],
};

const esc = (s) => String(s).replace(/&(?!(amp|lt|gt|quot|#\d+|nbsp);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const descOf = (t) => { const s = strip(t); return s.length > 157 ? `${s.slice(0, 157).replace(/\s\S*$/, '')}…` : s; };
const localHref = (href) => {
  try {
    const u = new URL(href, ORIGIN);
    if (u.origin === ORIGIN) {
      const p = u.pathname;
      const t = bySource.get(p) || bySource.get(p.replace(/\/$/, ''));
      if (t) return t.path + (u.hash || '');
      return u.href;
    }
    return u.href;
  } catch { return href; }
};
const slugify = (t) => strip(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const absSrc = (src) => { try { return new URL(src.replace(/ /g, '%20'), ORIGIN).href; } catch { return src; } };

// ---- in-page extraction (runs inside Chromium over the captured DOM) --------------------------------------
// Returns an ordered list of section models for #mainContent. The rich-text cleaner works on live DOM nodes.
const EXTRACT = `(() => {
  const ORIGIN = ${JSON.stringify(ORIGIN)};
  const norm = (s) => (s || '').replace(/\\u00a0/g, ' ').replace(/\\s+/g, ' ').trim();
  const isBlank = (el) => norm(el.textContent) === '' && !el.querySelector('img, iframe, table');
  // clean an AEM richtext root in place; returns HTML with only p/h1-6/ul/ol/li/strong/em/a/img/table cells
  function cleanRich(root, opts = {}) {
    const box = document.createElement('div'); box.innerHTML = root.innerHTML;
    box.querySelectorAll('script, style, button, noscript').forEach((n) => n.remove());
    box.querySelectorAll('iframe').forEach((f) => { const src = f.getAttribute('src') || ''; const p = document.createElement('p'); const a = document.createElement('a'); a.href = src; a.textContent = src; p.append(a); p.setAttribute('data-embed', '1'); f.replaceWith(p); });
    // unwrap presentational / layout wrappers
    let changed = true;
    while (changed) { changed = false; box.querySelectorAll('span, div, u, font, sup, sub, center, section, article, small, tbody, thead').forEach((n) => { if (n.tagName === 'TBODY' || n.tagName === 'THEAD') return; n.replaceWith(...n.childNodes); changed = true; }); }
    box.querySelectorAll('b').forEach((n) => { const s = document.createElement('strong'); s.append(...n.childNodes); n.replaceWith(s); });
    box.querySelectorAll('i').forEach((n) => { const s = document.createElement('em'); s.append(...n.childNodes); n.replaceWith(s); });
    // heading demotion (inside tiles / accordion bodies)
    if (opts.demoteTo) box.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => { const n = document.createElement(opts.demoteTo); n.append(...h.childNodes); h.replaceWith(n); });
    // attributes: keep href / src / alt only
    box.querySelectorAll('*').forEach((el) => { [...el.attributes].forEach((a) => { if (!['href', 'src', 'alt', 'data-embed', 'rowspan', 'colspan'].includes(a.name)) el.removeAttribute(a.name); }); });
    box.querySelectorAll('img').forEach((img) => { const src = img.getAttribute('src') || img.getAttribute('data-src') || ''; img.setAttribute('src', new URL(src.replace(/ /g, '%20'), ORIGIN).href); if (!img.getAttribute('alt')) img.setAttribute('alt', ''); img.closest('a') || (img.parentElement && img.parentElement.tagName === 'P') || (() => { const p = document.createElement('p'); img.replaceWith(p); p.append(img); })(); });
    box.querySelectorAll('a').forEach((a) => { const h = a.getAttribute('href') || ''; if (!h || h.startsWith('#') || h.startsWith('javascript')) { a.replaceWith(...a.childNodes); return; } try { a.setAttribute('href', new URL(h, ORIGIN).href); } catch { a.replaceWith(...a.childNodes); } });
    // a lone anchor inside <strong>/<em> would be buttonised by decorateButtons — legacy richtext links are
    // bold LINKS, not buttons: move the emphasis inside the anchor (<a><strong>…</strong></a>)
    box.querySelectorAll('strong > a, em > a').forEach((a) => { const w = a.parentElement; if (norm(w.textContent) !== norm(a.textContent)) return; const inner = document.createElement(w.tagName.toLowerCase()); inner.append(...a.childNodes); a.append(inner); w.replaceWith(a); });
    // empty inline wrappers
    box.querySelectorAll('strong, em, a').forEach((n) => { if (norm(n.textContent) === '' && !n.querySelector('img')) { if (n.textContent.length) n.replaceWith(document.createTextNode(' ')); else n.remove(); } });
    // <br> at block edges (layout brs) and <br><br> paragraph breaks
    const blocks = 'p, h1, h2, h3, h4, h5, h6, li, td, th';
    box.querySelectorAll(blocks).forEach((b) => {
      const trimEdge = (dirFirst) => { let guard = 0; while (guard++ < 20) { let n = dirFirst ? b.firstChild : b.lastChild; while (n && ((n.nodeType === 3 && norm(n.textContent) === '') || (n.nodeType === 1 && ['STRONG', 'EM', 'A'].includes(n.tagName) && norm(n.textContent) === '' && !n.querySelector('br, img')))) { const nx = dirFirst ? n.nextSibling : n.previousSibling; n.remove(); n = nx; } if (!n) return; if (n.nodeType === 1 && n.tagName === 'BR') { n.remove(); continue; } if (n.nodeType === 1 && ['STRONG', 'EM', 'A'].includes(n.tagName)) { const inner = dirFirst ? n.firstChild : n.lastChild; if (inner && inner.nodeType === 1 && inner.tagName === 'BR') { inner.remove(); continue; } if (inner && inner.nodeType === 3 && norm(inner.textContent) === '') { inner.remove(); continue; } } return; } };
      trimEdge(true);
      // trailing <br> run: the quirks-mode source renders n-1 blank lines after the block — restore them as zero-width-space
      // paragraphs (they survive the pipeline; verified on /drafts/zwsp-test); then trim the brs
      if (b.tagName === 'P') { let k = 0; let n = b.lastChild; while (n && ((n.nodeType === 3 && norm(n.textContent) === '') || (n.nodeType === 1 && n.tagName === 'BR'))) { if (n.nodeType === 1) k += 1; n = n.previousSibling; } for (let i = 1; i < k; i += 1) { const sp = document.createElement('p'); sp.innerHTML = '&#8203;'; b.after(sp); } }
      trimEdge(false);
    });
    // split paragraphs on consecutive <br>s
    box.querySelectorAll('p').forEach((p) => {
      const html = p.innerHTML; if (!/<br\\s*\\/?>(\\s|&nbsp;)*<br\\s*\\/?>/i.test(html)) return;
      const tokens = html.split(/((?:<br\\s*\\/?>(?:\\s|&nbsp;)*){2,})/i);
      const frag = document.createDocumentFragment();
      tokens.forEach((t, i) => { if (i % 2 === 1) { const k = (t.match(/<br/gi) || []).length; for (let j = 1; j < k; j += 1) { const sp = document.createElement('p'); sp.innerHTML = '&#8203;'; frag.append(sp); } return; } const x = t.replace(/^(\\s|&nbsp;|<br\\s*\\/?>)+|(\\s|&nbsp;|<br\\s*\\/?>)+$/gi, ''); if (norm(x.replace(/<[^>]+>/g, '')) !== '' || /<img/.test(x)) { const q = document.createElement('p'); q.innerHTML = x; frag.append(q); } });
      p.replaceWith(frag);
    });
    // drop whitespace-only blocks
    box.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li').forEach((b) => { if (!isBlank(b)) return; if (b.tagName === 'P' && b.innerHTML !== '&#8203;' && b.innerHTML !== '\u200b') { b.innerHTML = '&#8203;'; return; } if (b.tagName !== 'P') b.remove(); });
    box.querySelectorAll('ul, ol').forEach((l) => { if (!l.querySelector('li')) l.remove(); });
    // stray text nodes / inline nodes directly under the root → wrap in <p>
    [...box.childNodes].forEach((n) => { if ((n.nodeType === 3 && norm(n.textContent) !== '') || (n.nodeType === 1 && ['STRONG', 'EM', 'A', 'BR'].includes(n.tagName))) { if (n.nodeType === 1 && n.tagName === 'BR') { n.remove(); return; } const p = document.createElement('p'); n.replaceWith(p); p.append(n); } else if (n.nodeType === 3) n.remove(); });
    // tables → \`table\` block rows (spans duplicated into the spanned cells — D3)
    box.querySelectorAll('table').forEach((t) => {
      const rows = [...t.querySelectorAll('tr')]; const grid = []; const spans = {};
      rows.forEach((tr, r) => { grid[r] = grid[r] || []; let c = 0; [...tr.children].forEach((td) => { while (grid[r][c] !== undefined) c += 1; const rs = parseInt(td.getAttribute('rowspan') || '1', 10); const cs = parseInt(td.getAttribute('colspan') || '1', 10); const html = td.innerHTML; for (let i = 0; i < rs; i += 1) { grid[r + i] = grid[r + i] || []; for (let j = 0; j < cs; j += 1) grid[r + i][c + j] = html; } c += cs; }); });
      // a one-row table is a LAYOUT table (heading | sponsor logo) → columns; real data tables → table
      const blk = document.createElement('div'); blk.className = grid.length === 1 ? 'columns' : 'table legacy';
      grid.forEach((cells) => { const row = document.createElement('div'); cells.forEach((h) => { const cell = document.createElement('div'); cell.innerHTML = h; cell.querySelectorAll('*').forEach((el) => { [...el.attributes].forEach((a) => { if (!['href', 'src', 'alt'].includes(a.name)) el.removeAttribute(a.name); }); }); cell.querySelectorAll('br').forEach((b) => b.remove()); if (norm(cell.textContent) === '' && !cell.querySelector('img')) cell.innerHTML = ''; row.append(cell); }); blk.append(row); });
      t.replaceWith(blk);
    });
    return box.innerHTML.trim();
  }
  const centerAligned = (root) => { const bs = [...root.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].filter((b) => !isBlank(b)); return bs.length > 0 && bs.every((b) => /text-align:\\s*center/i.test(b.getAttribute('style') || '')); };
  const main = document.querySelector('#mainContent') || document.body;
  const out = [];
  const secs = [...main.querySelectorAll(':scope > div > .section, :scope > .section')];
  const list = secs.length ? secs : [...main.children];
  list.forEach((sec) => {
    const cls = sec.className || '';
    if (sec.querySelector('.guestServiceMainWrap')) {
      const w = sec.querySelector('.guestServiceMainWrap');
      const tiles = [...w.querySelectorAll('.boxTile')].map((t) => {
        const img = t.querySelector('.boxImage img'); const det = t.querySelector('.boxDetails');
        const dimg = det && det.querySelector('.boxDetailsImage:not(.hideSecondaryImage) img');
        const hours = det && det.querySelector('.boxDetailsHours'); const phone = det && det.querySelector('.boxDetailsPhone');
        return {
          img: img ? new URL((img.getAttribute('src') || img.getAttribute('data-src') || ''), ORIGIN).href : null,
          alt: img ? (img.getAttribute('alt') || '') : '',
          title: norm(t.querySelector('.boxTileHeading')?.textContent),
          desc: norm(t.querySelector('.boxTileDescription')?.textContent),
          more: norm(t.querySelector('.boxTileSmall')?.textContent) || 'View More',
          detail: det ? {
            img: dimg && (dimg.getAttribute('src') || dimg.getAttribute('data-src')) ? new URL(dimg.getAttribute('src') || dimg.getAttribute('data-src'), ORIGIN).href : null,
            imgAlt: dimg ? (dimg.getAttribute('alt') || '') : '',
            heading: norm(det.querySelector('.boxDetailsDescriptionHeading')?.textContent),
            sub: norm(det.querySelector('.boxDetailsDescriptionSubHeading')?.textContent),
            hours: hours ? cleanRich(hours, { demoteTo: 'h5' }) : '',
            phone: phone ? cleanRich(phone, { demoteTo: 'h5' }) : '',
          } : null,
        };
      });
      out.push({ type: 'tiles', heading: norm(w.querySelector('.headingMain')?.textContent), sub: norm(w.querySelector('.subheading')?.textContent), tiles });
    } else if (sec.querySelector('.campusInformationMainWrap')) {
      const cols = [...sec.querySelectorAll('.campusLocation, .campusHours')].map((c) => ({ heading: norm(c.querySelector('h3, h2, h4')?.textContent), ps: [...c.querySelectorAll('p')].map((p) => norm(p.textContent)).filter(Boolean) }));
      out.push({ type: 'info', cols });
    } else if (sec.querySelector('.usefulInformationMainWrap')) {
      const w = sec.querySelector('.usefulInformationMainWrap');
      const items = [...w.querySelectorAll('.info-panel')].map((p) => ({ label: norm(p.querySelector('.panel-title')?.textContent), cols: [...p.querySelectorAll('.infoWrap > .info, .infoWrap > div')].map((c) => cleanRich(c, { demoteTo: 'h4' })).filter(Boolean) }));
      out.push({ type: 'accordion', heading: norm(w.querySelector('.headTitle')?.textContent), items });
    } else if (sec.querySelector('.adComponentWrapper')) {
      out.push({ type: 'ad' });
    } else if (sec.querySelector('.ncCarouselWrap')) {
      const slides = [...sec.querySelectorAll('.carousel-inner .item')].map((it) => { const a = it.querySelector('.carousel-caption a'); const img = it.querySelector('img'); return { img: img ? new URL(img.getAttribute('src') || img.getAttribute('data-src'), ORIGIN).href : null, alt: img ? (img.getAttribute('alt') || '') : '', h2: norm(it.querySelector('.carousel-caption h2')?.textContent), h3: norm(it.querySelector('.carousel-caption h3')?.textContent), cta: a ? { text: norm(a.textContent), href: a.getAttribute('href') } : null }; });
      out.push({ type: 'hero-carousel', slides });
    } else if (sec.querySelector('.photogallery-carousel')) {
      const w = sec.querySelector('.photogallery-carousel');
      out.push({ type: 'gallery', title: norm(w.querySelector('.pg-title')?.textContent), sub: norm(w.querySelector('.pg-subtext')?.textContent), tabs: [...w.querySelectorAll('.pg-tab')].map((t) => norm(t.textContent)), images: [...w.querySelectorAll('.pg-inner img')].map((i) => ({ src: new URL(i.getAttribute('src') || i.getAttribute('data-src') || '', ORIGIN).href, alt: i.getAttribute('alt') || '' })) });
    } else if (sec.querySelector('.newsMainWrap')) {
      const w = sec.querySelector('.newsMainWrap');
      const items = [...w.querySelectorAll('.news-item')].map((it) => { const a = it.querySelector('a.newsPane'); const img = it.querySelector('img.newsImg'); return { href: a ? a.getAttribute('href') : '', img: img && img.getAttribute('src') ? new URL(img.getAttribute('src'), ORIGIN).href : null, alt: img ? (img.getAttribute('alt') || '') : '', category: norm(it.querySelector('.tilehead')?.childNodes[0]?.textContent), date: norm(it.querySelector('.tileDate')?.textContent), text: norm(it.querySelector('.tilePara')?.textContent) }; });
      out.push({ type: 'news', heading: norm(w.querySelector('.tileTitle')?.textContent), sub: norm(w.querySelector('.tileDescription')?.textContent), items, more: norm(w.querySelector('.moreNews')?.childNodes[0]?.textContent) || 'More' });
    } else if (sec.querySelector('.nc-cmp-container') && /\\btext\\b/.test(cls)) {
      const root = sec.querySelector('.nc-cmp-container');
      const html = cleanRich(root);
      if (html) out.push({ type: 'richtext', html, center: centerAligned(root) });
    } else if (sec.querySelector('.cmp-text')) {
      [...sec.querySelectorAll('.cmp-text')].forEach((root) => { const html = cleanRich(root); if (html) out.push({ type: 'richtext', html, center: false }); });
    } else if (/\\btext\\b/.test(cls)) {
      const html = cleanRich(sec); if (html) out.push({ type: 'richtext', html, center: centerAligned(sec) });
    }
  });
  if (!out.length) { // content-page template (no .section wrappers)
    [...main.querySelectorAll('.cmp-text')].forEach((root) => { const html = cleanRich(root); if (html) out.push({ type: 'richtext', html, center: false }); });
  }
  return out;
})()`;

// ---- Node-side assembly -----------------------------------------------------------------------------------
function fixLinks(html) {
  return html
    .replace(/<a href="([^"]+)"/g, (m, h) => `<a href="${esc(localHref(h))}"`)
    .replace(/<img src="([^"]+)"/g, (m, s) => `<img src="${esc(absSrc(s))}"`);
}
const metaBlock = (rows) => `    <div>\n      <div class="metadata">\n${rows.filter((r) => r[1]).map(([k, v]) => `        <div><div>${k}</div><div>${esc(v)}</div></div>`).join('\n')}\n      </div>\n    </div>\n`;
const sectionMeta = (style) => (style ? `<div class="section-metadata"><div><div>style</div><div>${style}</div></div></div>\n` : '');
const section = (inner, style) => `    <div>\n${inner}${sectionMeta(style)}    </div>\n`;
const page = (meta, sections) => `<body>\n  <header></header>\n  <main>\n${metaBlock(meta)}${sections.join('')}  </main>\n  <footer></footer>\n</body>\n`;
function write(slugPath, html) {
  const file = path.join('content', `${slugPath.replace(/^\//, '')}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return file;
}
// richtext: split into sections around embed paragraphs (an embed URL sits alone in its own section, like news-author)
function richtextSections(html, style) {
  const parts = html.split(/(<p data-embed="1">[\s\S]*?<\/p>|<hr>)/);
  let rule = false;
  return parts.map((part) => {
    if (!part.trim()) return '';
    if (part === '<hr>') { rule = true; return ''; }
    const styles = [style, rule ? 'rule' : null].filter(Boolean).join(', ') || null;
    rule = false;
    if (part.startsWith('<p data-embed="1">')) {
      const src = (part.match(/href="([^"]+)"/) || [])[1] || '';
      const url = src.replace(/^https?:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/([^?"]+).*$/, 'https://www.youtube.com/watch?v=$3');
      return section(`<p><a href="${esc(url)}">${esc(url)}</a></p>\n`);
    }
    return section(`${fixLinks(part).trim()}\n`, styles);
  }).join('');
}
function firstParagraph(sections) {
  for (const s of sections) {
    if (s.type === 'richtext') { const m = s.html.match(/<p>([\s\S]*?)<\/p>/g); if (m) { const t = m.map((x) => strip(x)).find((x) => x.length > 40); if (t) return t; } }
    if (s.type === 'tiles' && s.sub) return s.sub;
    if (s.type === 'news' && s.sub) return s.sub;
  }
  return '';
}
function promoteFirstHeading(html) {
  // no <h1> in the page yet → the first heading becomes the h1; the rest keep their tags
  if (/<h1[\s>]/.test(html)) return html;
  let done = false;
  return html.replace(/<h([2-6])>([\s\S]*?)<\/h\1>/, (m, l, inner) => { if (done) return m; done = true; return `<h1>${inner}</h1>`; });
}

function emitTiles(s, level) {
  const rows = s.tiles.map((t) => {
    const cells = [];
    if (t.img) cells.push(`<div><img src="${esc(t.img)}" alt="${esc(t.alt || t.title)}"></div>`);
    const d = t.detail;
    const hasDetail = d && (d.heading || d.sub || d.hours || d.phone || d.img);
    const anchor = `#${slugify(t.title) || 'tile'}`;
    cells.push(`<div><h3>${esc(t.title)}</h3>${t.desc ? `<p>${esc(t.desc)}</p>` : ''}${hasDetail ? `<p><a href="${anchor}">${esc(t.more)}</a></p>` : ''}</div>`);
    if (hasDetail) {
      let left = '';
      if (d.img) left += `<p><img src="${esc(d.img)}" alt="${esc(d.imgAlt || d.heading || t.title)}"></p>`;
      if (d.heading) left += `<h4>${esc(d.heading)}</h4>`;
      if (d.sub) left += `<h5>${esc(d.sub)}</h5>`;
      left += fixLinks(d.hours || '');
      cells.push(`<div>${left}</div>`);
      if (d.phone && strip(d.phone)) cells.push(`<div>${fixLinks(d.phone)}</div>`);
    }
    return `<div>${cells.join('')}</div>`;
  });
  // the tagline under the title is a heading in the source (h4.subheading) — authored as the next level down
  const sub = level + 1;
  const head = `<h${level}>${esc(s.heading)}</h${level}>\n${s.sub ? `<h${sub}>${esc(s.sub)}</h${sub}>\n` : ''}`;
  return section(`${head}<div class="service-tiles">\n${rows.join('\n')}\n</div>\n`, 'legacy-heading');
}
function emitInfo(s) {
  const cells = s.cols.map((c) => `<div><h2>${esc(c.heading)}</h2>${c.ps.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`);
  return section(`<div class="columns legacy-info">\n<div>${cells.join('')}</div>\n</div>\n`);
}
function emitAccordion(s, level) {
  const rows = s.items.map((it) => `<div><div>${esc(it.label)}</div><div>${it.cols.map(fixLinks).join('')}</div></div>`);
  return section(`<h${level}>${esc(s.heading)}</h${level}>\n<div class="accordion legacy">\n${rows.join('\n')}\n</div>\n`, 'legacy-heading');
}
const emitAd = () => section(`<div class="ad-slot">\n<div><div><img src="${AD_CREATIVE}" alt="Advertisement"></div></div>\n</div>\n`);
function emitHeroCarousel(s) {
  const rows = s.slides.map((sl) => `<div><div><img src="${esc(sl.img)}" alt="${esc(sl.alt || sl.h2)}"></div><div>${sl.h2 ? `<h2>${esc(sl.h2)}</h2>` : ''}${sl.h3 ? `<p>${esc(sl.h3)}</p>` : ''}${sl.cta ? `<p><em><a href="${esc(localHref(sl.cta.href))}">${esc(sl.cta.text)}</a></em></p>` : ''}</div></div>`);
  return section(`<div class="carousel hero">\n${rows.join('\n')}\n</div>\n`);
}
function emitGallery(s, level) {
  const data = JSON.parse(fs.readFileSync('data/photogallery-collegiate.json', 'utf8'));
  const rows = data.map((g) => `<div><div><img src="${esc(absSrc(g.image))}" alt="${esc(g.caption || '')}"></div><div>${g.caption ? `<p>${esc(g.caption)}</p>` : ''}</div></div>`);
  return section(`<h${level}>${esc(s.title)}</h${level}>\n${s.sub ? `<p>${esc(s.sub)}</p>\n` : ''}<div class="carousel gallery">\n${rows.join('\n')}\n</div>\n`, 'photo-gallery');
}
function emitNews(s, level) {
  const rows = s.items.slice(0, 8).map((it) => {
    const href = localHref(it.href);
    return `<div><div>${it.img ? `<img src="${esc(it.img)}" alt="${esc(it.alt || it.category)}">` : ''}</div><div><p>${esc(it.category)}</p><p>${esc(it.date)}</p></div><div><h3><a href="${esc(href)}">${esc(it.text)}</a></h3></div></div>`;
  });
  return section(`<h${level}>${esc(s.heading)}</h${level}>\n${s.sub ? `<p>${esc(s.sub)}</p>\n` : ''}<div class="news-listing">\n${rows.join('\n')}\n</div>\n<p>${esc(s.more)}</p>\n`, 'legacy-heading');
}

async function extract(browser, slug) {
  const html = fs.readFileSync(path.join('stardust/current/pages', `${slug}.html`), 'utf8');
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const pg = await ctx.newPage();
  await pg.route('**/*', (r) => (r.request().resourceType() === 'document' ? r.continue() : r.abort()));
  await pg.setContent(html, { waitUntil: 'domcontentloaded' });
  const model = await pg.evaluate(EXTRACT);
  await ctx.close();
  return model;
}

const report = [];
async function authorListing(browser, slug) {
  const map = pagemap[slug]; const json = JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`, 'utf8'));
  const model = await extract(browser, slug);
  let h1Used = false; const sections = [];
  const nextLevel = () => { if (h1Used) return 2; h1Used = true; return 1; };
  // a richtext with an authored <h1> claims the h1 first
  if (model.some((s) => s.type === 'richtext' && /<h1[\s>]/.test(s.html))) h1Used = true;
  model.forEach((s) => {
    if (s.type === 'tiles') sections.push(emitTiles(s, nextLevel()));
    else if (s.type === 'richtext') sections.push(richtextSections(s.html, s.center ? 'center' : null));
    else if (s.type === 'info') sections.push(emitInfo(s));
    else if (s.type === 'accordion') sections.push(emitAccordion(s, nextLevel()));
    else if (s.type === 'ad') sections.push(emitAd());
    else if (s.type === 'hero-carousel') sections.push(emitHeroCarousel(s));
    else if (s.type === 'gallery') sections.push(emitGallery(s, nextLevel()));
    else if (s.type === 'news') sections.push(emitNews(s, nextLevel()));
  });
  const meta = [['Title', json.title || map.title], ['Description', descOf(firstParagraph(model))], ['Template', 'legacy']];
  const file = write(map.path, page(meta, sections));
  report.push({ slug, file, sections: model.map((s) => s.type), h1: h1Used });
}
async function authorRichtext(browser, slug) {
  const map = pagemap[slug]; const json = JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`, 'utf8'));
  const model = await extract(browser, slug);
  let body = model.filter((s) => s.type === 'richtext').map((s) => s.html).join('\n');
  body = promoteFirstHeading(body);
  const center = model.some((s) => s.type === 'richtext' && s.center);
  const sections = [richtextSections(body, center ? 'center' : null)];
  model.filter((s) => s.type === 'ad').forEach(() => sections.push(emitAd()));
  const meta = [['Title', json.title || map.title], ['Description', descOf(firstParagraph(model))], ['Template', 'legacy']];
  const file = write(map.path, page(meta, sections));
  report.push({ slug, file, sections: model.map((s) => s.type), h1: /<h1[\s>]/.test(body) });
}
async function authorStatic(browser, slug) {
  const map = pagemap[slug]; const json = JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`, 'utf8'));
  const model = await extract(browser, slug);
  const body = promoteFirstHeading(model.filter((s) => s.type === 'richtext').map((s) => s.html).join('\n'));
  const meta = [['Title', json.title || map.title], ['Description', descOf(firstParagraph(model) || strip(body).slice(0, 160))], ['Template', 'content-page']];
  const file = write(map.path, page(meta, [section(`${fixLinks(body)}\n`)]));
  report.push({ slug, file, sections: model.map((s) => s.type), h1: /<h1[\s>]/.test(body) });
}
// news-article siblings: same authored shape as stardust/scripts/news-author.mjs (article-hero default content + body),
// from the news-extract records; tables become `table` block rows here too.
function cleanNewsBody(html) {
  let h = html;
  h = h.replace(/<!--[\s\S]*?-->/g, '').replace(/<button[\s\S]*?<\/button>/g, '');
  h = h.replace(/<\/?(div|span|section|article|font|center|u|sup)[^>]*>/g, '');
  h = h.replace(/\s(style|class|id|dir|lang|align|width|height|border|cellpadding|cellspacing|valign|bgcolor|onclick|target|rel|title|data-[a-z-]+)="[^"]*"/g, '');
  h = h.replace(/<b>/g, '<strong>').replace(/<\/b>/g, '</strong>').replace(/<i>/g, '<em>').replace(/<\/i>/g, '</em>');
  h = h.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/g, '<p>&#8203;</p>').replace(/<h([1-6])>(\s|&nbsp;|<br\s*\/?>)*<\/h\1>/g, '');
  h = h.replace(/((?:<br\s*\/?>\s*)+)<\/p>/g, (m, brs) => '</p>' + '<p>&#8203;</p>'.repeat((brs.match(/<br/g) || []).length)).replace(/<br\s*\/?>\s*(?=<\/(h[1-6]|li)>)/g, '').replace(/(<(p|h[1-6]|li)>)\s*<br\s*\/?>/g, '$1');
  h = h.replace(/<h1[\s>]/g, '<h2>').replace(/<\/h1>/g, '</h2>');
  h = fixLinks(h);
  return h.replace(/\n{3,}/g, '\n\n').trim();
}
function authorNews(slug) {
  const map = pagemap[slug]; const r = JSON.parse(fs.readFileSync(`stardust/.work/news/en-home-news-${slug.replace(/^en-home-news-/, '')}.json`.replace('en-home-news-en-home-news-', 'en-home-news-'), 'utf8'));
  const json = JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`, 'utf8'));
  // the video/gallery variant of news-extract carries the visually SMALL line (h3, 20px) in `title` and the
  // BIG line (h2, 60px uppercase) in `kicker` — the hero shows kicker small / title big, so swap for that shape
  let { title, kicker } = r; let kickerBelow = false;
  if (/^article-video/.test(r.shape) && r.kicker) {
    [title, kicker] = [r.kicker, r.title];
    // DOM order of the two hero lines (h2 big / h3 small) decides whether the small line sits above or below
    const src = fs.readFileSync(`stardust/current/pages/${slug}.html`, 'utf8');
    const tt = (src.match(/<div class="textTitle">([\s\S]*?)<\/div>/) || [])[1] || '';
    const i2 = tt.search(/<h2[\s>]/); const i3 = tt.search(/<h3[\s>]/);
    kickerBelow = i2 >= 0 && i3 >= 0 && i2 < i3;
  }
  const desc = descOf((r.bodyText || strip(r.bodyHtml || '')));
  const dateOnly = (r.date || '').split('|').pop().trim();
  const meta = [['Title', json.title || r.pageTitle || title], ['Description', desc], ['Template', 'legacy'], ['Category', map.category || 'News'], ['Published Date', dateOnly], ['Author', /\|/.test(r.date || '') ? r.date.split('|')[0].trim() : null], ['Image', r.image || null], ['Kicker', kicker || null]];
  const kickerP = kicker ? `<p>${esc(kicker)}</p>\n` : '';
  const hero = `${r.image ? `<p><img src="${esc(r.image)}" alt="${esc(r.imageAlt || title)}"></p>\n` : ''}${kickerBelow ? '' : kickerP}<h1>${esc(title)}</h1>\n${kickerBelow ? kickerP : ''}${r.date ? `<p>${esc(r.date)}</p>\n` : ''}`;
  const sections = [section(hero, 'article-hero'), section(`${cleanNewsBody(r.bodyHtml || '')}\n`)];
  if (r.video) { const v = r.video.replace('/embed/', '/watch?v='); sections.push(section(`<p><a href="${esc(v)}">${esc(v)}</a></p>\n`)); }
  if (r.gallery && r.gallery.length) sections.push(section(`${r.galleryTitle ? `<h2>${esc(r.galleryTitle)}</h2>\n` : ''}<div class="carousel gallery">\n${r.gallery.map((g) => `<div><div><img src="${esc(g.src)}" alt="${esc(g.caption || '')}"></div><div>${g.caption ? `<p>${esc(g.caption)}</p>` : ''}</div></div>`).join('\n')}\n</div>\n`));
  const file = write(map.path, page(meta, sections));
  report.push({ slug, file, shape: r.shape, gallery: (r.gallery || []).length });
}
function authorUnique(slug) {
  // /collegiate/events is a usta.com proxy page (dynamics #21): thin page — title, intro paragraphs verbatim, link out
  const map = pagemap[slug]; const json = JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`, 'utf8'));
  const body = `<h1>College Tennis</h1>\n<p><strong>GET OUT AND PLAY.</strong></p>\n<p>The USTA is committed to providing all aspiring collegiate tennis players the knowledge and resources they need to help find the right college tennis program and reach the next level.</p>\n<p>Student-athletes interested in a less rigorous, but still competitive, collegiate tennis experience should learn more about the <a href="https://www.usta.com/en/home/play/college-tennis/programs/national/tennis-on-campus.html">Tennis on Campus</a> program.</p>\n<p><strong><a href="https://www.usta.com/en/home/play/college-tennis.html">Explore College Tennis on USTA.com</a></strong></p>\n`;
  const meta = [['Title', json.title || map.title], ['Description', 'The USTA is committed to providing all aspiring collegiate tennis players the knowledge and resources they need to find the right college tennis program.'], ['Template', 'legacy']];
  const file = write(map.path, page(meta, [section(body)]));
  report.push({ slug, file, contentGap: 'usta.com proxy page — only the intro is authored; the College Resources / logos / links live on usta.com' });
}

const only = process.argv.slice(2);
const want = (s) => !only.length || only.includes(s);
const browser = await chromium.launch();
for (const slug of SCOPE.listing) if (want(slug)) await authorListing(browser, slug);
for (const slug of SCOPE.richtext) if (want(slug)) await authorRichtext(browser, slug);
for (const slug of SCOPE.static) if (want(slug)) await authorStatic(browser, slug);
await browser.close();
for (const slug of SCOPE.news) if (want(slug)) authorNews(slug);
for (const slug of SCOPE.unique) if (want(slug)) authorUnique(slug);
fs.mkdirSync('stardust/.work/deploy', { recursive: true });
fs.writeFileSync('stardust/.work/deploy/legacy-author-report.json', JSON.stringify(report, null, 1));
report.forEach((r) => console.log(r.slug, '→', r.file, r.sections ? r.sections.join(',') : r.shape || '', r.h1 === false ? 'NO H1' : ''));
