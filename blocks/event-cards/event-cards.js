/**
 * event-cards — "Event Calendar at a Glance" rail (reconstructive, data-fed top-up).
 *
 * Authoring: one row per event — `<p><img></p>` · `<p>DATE LINE</p>` · h3 title · p body ·
 *   `<p><a>LEARN MORE</a></p>` (a bold underlined text link in the source, NOT a button — left as a
 *   plain anchor and styled by the block). The section heading above ("Event Calendar at a Glance")
 *   is default content styled in place.
 * Top-up (stardust/dynamic-features.md #2, variant `feed`): when fewer than 4 rows are authored,
 *   the next upcoming
 *   events from `/data/events.json` (snapshot of the AEM content-fragment feed) fill the rail.
 *   @ew-exempt all top-up cards — data-fed runtime values (EW5 c); authored rows stay editable.
 * Every authored element is MOVED into its card wrapper (EW1/EW2).
 */
function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

const isMedia = (node) => node.matches('picture, img')
  || (!!node.querySelector('picture, img') && !node.textContent.trim());

function buildCard(nodes) {
  const card = div('event-card');
  const media = nodes.filter(isMedia);
  const heading = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
  const rest = nodes.filter((n) => !isMedia(n) && n !== heading);
  const links = rest.filter((n) => n.querySelector('a'));
  const texts = rest.filter((n) => !links.includes(n));
  // the date line is the text paragraph authored BEFORE the title
  const date = heading && texts.length && nodes.indexOf(texts[0]) < nodes.indexOf(heading)
    ? texts.shift() : null;
  if (media.length) card.append(div('event-media', ...media));
  const body = div('event-body');
  if (date) body.append(div('event-date', date));
  if (heading) body.append(div('event-title', heading));
  if (texts.length) body.append(div('event-text', ...texts));
  if (links.length) body.append(div('event-link', ...links));
  card.append(body);
  return card;
}

function fmtRange(start, end) {
  const s = new Date(start);
  const e = new Date(end || start);
  const opts = { month: 'long', timeZone: 'UTC' };
  const month = s.toLocaleDateString('en-US', opts).toUpperCase();
  const sameDay = s.getUTCDate() === e.getUTCDate() && s.getUTCMonth() === e.getUTCMonth();
  const days = sameDay ? `${s.getUTCDate()}` : `${s.getUTCDate()}-${e.getUTCDate()}`;
  return `${month} ${days}, ${s.getUTCFullYear()}`;
}

function dataCard(ev) {
  const card = div('event-card data');
  const body = div('event-body');
  const date = document.createElement('p');
  date.textContent = fmtRange(ev.eventStartDate, ev.eventEndDate);
  const h = document.createElement('h3');
  h.textContent = ev.eventTitle || '';
  body.append(div('event-date', date), div('event-title', h));
  if (ev.eventDescription) {
    const p = document.createElement('p');
    p.textContent = ev.eventDescription.replace(/<[^>]+>/g, '').trim();
    body.append(div('event-text', p));
  }
  if (ev.eventLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ev.eventLink;
    a.textContent = 'LEARN MORE';
    p.append(a);
    body.append(div('event-link', p));
  }
  card.append(body);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const grid = div('event-grid');
  rows.forEach((row) => {
    const nodes = [...row.children].flatMap((c) => [...c.children]);
    if (nodes.length) grid.append(buildCard(nodes));
  });
  block.replaceChildren(grid);

  // top-up is opt-in: the `feed` variant (the site-wide "Event Calendar at a Glance" rail)
  if (!block.classList.contains('feed')) return;
  const want = Number(block.dataset.limit || 4);
  if (grid.childElementCount >= want) return;
  try {
    const resp = await fetch('/data/events.json');
    if (!resp.ok) return;
    const { events = [] } = await resp.json();
    const now = Date.now();
    const titles = new Set([...grid.querySelectorAll('.event-title')].map((t) => t.textContent.trim().toLowerCase()));
    events
      .filter((e) => e.eventTitle && new Date(e.eventEndDate || e.eventStartDate).getTime() >= now)
      .filter((e) => !titles.has(e.eventTitle.trim().toLowerCase()))
      .sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate))
      .slice(0, want - grid.childElementCount)
      .forEach((e) => grid.append(dataCard(e)));
  } catch (e) {
    // snapshot unavailable — the authored rows stand
  }
}
