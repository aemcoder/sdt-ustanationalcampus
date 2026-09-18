/**
 * tabs — Block Collection `tabs` model (D11), reconstructive.
 *
 * Authoring, two shapes:
 *   1. one row per tab: label cell · panel cell (simple prose panels);
 *   2. one row per tab with ONLY a label cell — the block then ADOPTS the next N sections of the
 *      page as its panels, in order (EDS allows one nesting level, so a panel that holds a block —
 *      a `cards team` grid — is authored as its own section and combined client-side, D2).
 * Variants: `large` (hub pages: 22px/48px tab labels; default 18px/38px on program pages).
 * EW7: labels are moved into `<div class="tabs-tab">` buttons' SIBLING slot? No — a tab label
 * must be clickable and the source renders it as a plain list item: the authored label
 * paragraph is MOVED into a div[role=tab] that carries the click handler (a div can host the
 * editor; a <button> cannot). Adopted sections are moved whole (EW9) — the runtime still loads
 * their blocks because the sections stay in the DOM.
 */
function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

let counter = 0;

export default function decorate(block) {
  counter += 1;
  const base = `tabs-${counter}`;
  const rows = [...block.children];
  const adopt = rows.every((r) => r.children.length === 1);
  const section = block.closest('.section');
  let adopted = [];
  if (adopt && section) {
    const siblings = [];
    let next = section.nextElementSibling;
    while (next && siblings.length < rows.length) {
      if (next.classList.contains('section')) siblings.push(next);
      next = next.nextElementSibling;
    }
    adopted = siblings;
  }

  const list = div('tabs-list');
  list.setAttribute('role', 'tablist');
  const panels = div('tabs-panels');
  const tabs = [];

  rows.forEach((row, i) => {
    const [labelCell, ...panelCells] = [...row.children];
    const tab = div('tabs-tab', ...(labelCell ? [...labelCell.children] : []));
    tab.id = `${base}-tab-${i}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${base}-panel-${i}`);
    tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
    tab.setAttribute('aria-selected', String(i === 0));
    const panel = div('tabs-panel');
    panel.id = `${base}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    if (adopt) {
      if (adopted[i]) panel.append(adopted[i]);
    } else {
      panelCells.forEach((c) => panel.append(...c.children));
    }
    if (i === 0) {
      tab.classList.add('active');
      panel.classList.add('active');
    } else {
      panel.setAttribute('aria-hidden', 'true');
    }
    tabs.push({ tab, panel });
    list.append(tab);
    panels.append(panel);
  });

  const select = (idx) => {
    tabs.forEach(({ tab, panel }, i) => {
      const on = i === idx;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.setAttribute('tabindex', on ? '0' : '-1');
      panel.classList.toggle('active', on);
      if (on) panel.removeAttribute('aria-hidden');
      else panel.setAttribute('aria-hidden', 'true');
    });
  };
  tabs.forEach(({ tab }, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
        select(n);
        tabs[n].tab.focus();
      }
    });
  });

  block.replaceChildren(list, panels);
}
