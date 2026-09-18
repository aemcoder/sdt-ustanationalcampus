/**
 * calendar — client-only event calendar over the events snapshot (stardust/dynamic-features.md #1).
 *
 * Authoring (key-value config, D14): `source` — the events JSON (default /data/events.json).
 * The source's Vue widget (search form · v-calendar month grid · selected-day list) is rebuilt with
 * local state; the visible words are widget chrome (labels, weekday/month names) or runtime values
 * from the feed. The page's authored fallback is the "Event Calendar at a Glance" event-cards rail.
 * @ew-exempt all but the section heading — client-only widget; every other displayed string is UI
 *   chrome (labels, weekday/month names) or feed data (EW5 c)
 */
const TYPES = ['All', 'Tennis', 'Pickleball', 'Padel'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

const utc = (d) => new Date(d);
const dayKey = (d) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;

function eventDays(ev) {
  const out = [];
  const s = utc(ev.eventStartDate);
  const e = utc(ev.eventEndDate || ev.eventStartDate);
  for (let d = new Date(s); d <= e && out.length < 62; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(dayKey(d));
  }
  return out;
}

function fmtDay(d) {
  return `${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function fmtRange(ev) {
  const s = utc(ev.eventStartDate);
  const e = utc(ev.eventEndDate || ev.eventStartDate);
  const m = MONTHS[s.getUTCMonth()].slice(0, 3);
  if (dayKey(s) === dayKey(e)) return `${m} ${s.getUTCDate()}`;
  if (s.getUTCMonth() === e.getUTCMonth()) return `${m} ${s.getUTCDate()} - ${e.getUTCDate()}`;
  return `${m} ${s.getUTCDate()} - ${MONTHS[e.getUTCMonth()].slice(0, 3)} ${e.getUTCDate()}`;
}

function select(labelText, id, options, value) {
  const wrap = el('div', 'calendar-field');
  const label = el('label', '', labelText);
  label.htmlFor = id;
  const sel = el('select');
  sel.id = id;
  options.forEach(([v, t]) => {
    const o = el('option', '', t);
    o.value = v;
    if (String(v) === String(value)) o.selected = true;
    sel.append(o);
  });
  wrap.append(label, sel);
  return { wrap, sel };
}

export default async function decorate(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const [k, v] = [...row.children].map((c) => c.textContent.trim());
    if (k) config[k.toLowerCase()] = v;
  });
  const source = config.source || '/data/events.json';
  let events = [];
  try {
    const resp = await fetch(source);
    if (resp.ok) ({ events = [] } = await resp.json());
  } catch (e) { /* offline — empty calendar */ }

  const today = new Date();
  const state = {
    type: 'All',
    year: today.getUTCFullYear(),
    month: today.getUTCMonth(),
    selected: dayKey(today),
  };
  const byDay = new Map();
  const index = () => {
    byDay.clear();
    events
      .filter((ev) => state.type === 'All' || (ev.eventType || '').toLowerCase() === state.type.toLowerCase())
      .forEach((ev) => eventDays(ev).forEach((k) => {
        if (!byDay.has(k)) byDay.set(k, []);
        byDay.get(k).push(ev);
      }));
  };

  // ---- search column — the authored section heading ("Search Events", default content BEFORE the
  // block) is MOVED in as the form title (EW8); the emptied wrapper goes
  const search = el('form', 'calendar-search');
  const headWrap = block.parentElement?.previousElementSibling;
  const authoredTitle = headWrap?.classList.contains('default-content-wrapper')
    ? headWrap.querySelector('h1, h2, h3') : null;
  if (authoredTitle) {
    const titleWrap = el('div', 'calendar-search-title');
    titleWrap.append(authoredTitle);
    search.append(titleWrap);
    if (!headWrap.children.length) headWrap.remove();
  }
  const years = [...new Set(events.map((ev) => utc(ev.eventStartDate).getUTCFullYear()))].sort();
  if (!years.includes(state.year)) years.push(state.year);
  const type = select('Select type of event', 'calendar-type', TYPES.map((t) => [t, t]), state.type);
  const month = select('Select month', 'calendar-month', MONTHS.map((m, i) => [i, m]), state.month);
  const year = select('Select year', 'calendar-year', years.sort().map((y) => [y, y]), state.year);
  const submit = el('button', 'calendar-submit', 'Search');
  submit.type = 'submit';
  search.append(type.wrap, month.wrap, year.wrap, submit);

  // ---- month grid
  const picker = el('div', 'calendar-picker');
  const header = el('div', 'calendar-header');
  const prev = el('button', 'calendar-prev');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous month');
  const next = el('button', 'calendar-next');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next month');
  const title = el('p', 'calendar-title');
  header.append(prev, title, next);
  const weekdays = el('div', 'calendar-weekdays');
  DAYS.forEach((d) => weekdays.append(el('span', '', d)));
  const grid = el('div', 'calendar-days');
  const footer = el('p', 'calendar-footer', 'USTA National Campus Calendar');
  picker.append(header, weekdays, grid, footer);

  // ---- day list
  const list = el('div', 'calendar-list');
  const listTitle = el('p', 'calendar-selected');
  const listItems = el('ul', 'calendar-events');
  list.append(listTitle, listItems);

  const renderList = () => {
    const [y, m, d] = state.selected.split('-').map(Number);
    const date = new Date(Date.UTC(y, m, d));
    listTitle.textContent = fmtDay(date);
    listItems.replaceChildren();
    (byDay.get(state.selected) || []).forEach((ev) => {
      const li = el('li');
      li.append(el('p', 'calendar-event-title', ev.eventTitle || ''));
      li.append(el('p', 'calendar-event-date', fmtRange(ev)));
      const desc = (ev.eventDescription || '').replace(/<[^>]+>/g, '').trim();
      if (desc) li.append(el('p', 'calendar-event-desc', desc));
      if (ev.eventLink) {
        const p = el('p', 'calendar-event-link');
        const a = el('a', '', 'Register for event');
        a.href = ev.eventLink;
        p.append(a);
        li.append(p);
      }
      listItems.append(li);
    });
    if (!listItems.childElementCount) listItems.append(el('li', 'calendar-empty', 'No events on this day'));
  };

  const renderGrid = () => {
    index();
    title.textContent = `${MONTHS[state.month]} ${state.year}`;
    grid.replaceChildren();
    const first = new Date(Date.UTC(state.year, state.month, 1));
    const offset = first.getUTCDay();
    const count = new Date(Date.UTC(state.year, state.month + 1, 0)).getUTCDate();
    for (let i = 0; i < offset; i += 1) grid.append(el('span', 'calendar-day empty'));
    for (let d = 1; d <= count; d += 1) {
      const key = `${state.year}-${state.month}-${d}`;
      const b = el('button', 'calendar-day', String(d));
      b.type = 'button';
      if (byDay.has(key)) b.classList.add('has-events');
      if (key === state.selected) b.classList.add('selected');
      b.addEventListener('click', () => { state.selected = key; renderGrid(); renderList(); });
      grid.append(b);
    }
    renderList();
  };

  prev.addEventListener('click', () => { state.month -= 1; if (state.month < 0) { state.month = 11; state.year -= 1; } month.sel.value = state.month; renderGrid(); });
  next.addEventListener('click', () => { state.month += 1; if (state.month > 11) { state.month = 0; state.year += 1; } month.sel.value = state.month; renderGrid(); });
  search.addEventListener('submit', (e) => {
    e.preventDefault();
    state.type = type.sel.value;
    state.month = Number(month.sel.value);
    state.year = Number(year.sel.value);
    index();
    const firstDay = [...byDay.keys()].map((k) => k.split('-').map(Number))
      .filter(([y, m]) => y === state.year && m === state.month).sort((a, b) => a[2] - b[2])[0];
    state.selected = firstDay ? firstDay.join('-') : `${state.year}-${state.month}-1`;
    renderGrid();
  });

  renderGrid();
  block.replaceChildren(search, picker, list);
}
