/**
 * header — USTA National Campus fixed chrome (stardust:replica, template-slotted / node-slotted).
 *
 * Authored document /nav (four sections, default content only):
 *   1. alert banner  — one <p> (bold text with a link) shown in the orange band
 *   2. brand         — the logo image link
 *   3. sections      — <ul> of top-level links, each with a nested <ul> of sub-links
 *   4. tools         — the BOOK NOW CTA (<strong><a>)
 * The breadcrumb band is generated from the page path + /query-index.json titles
 * (live: HOME › PLAY › PROGRAMS).
 * @ew-exempt all breadcrumb text — derived from the index.
 * State machine cloned from the live site (stardust/current/_chrome-lift.json): desktop
 * dropdowns open on hover or toggle click (aria-expanded); mobile: hamburger → body.menu-open
 * (panel slides in, body locked, hamburger↔cancel swap), toggle opens the item's sub-list;
 * alert close hides the band for the session.
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 768px)');

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function iconButton(className, src, alt, label) {
  const b = el('button', className, { type: 'button', 'aria-label': label });
  const img = el('img', '', {
    src, alt, width: '24', height: '24',
  });
  b.append(img);
  return b;
}

function pretty(segment) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

async function buildBreadcrumb(ol) {
  const { pathname } = window.location;
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ path: '/', label: 'Home' }];
  let acc = '';
  segments.forEach((s) => { acc += `/${s}`; crumbs.push({ path: acc, label: pretty(s) }); });
  try {
    const resp = await fetch('/query-index.json?limit=2000');
    if (resp.ok) {
      const { data = [] } = await resp.json();
      const titles = new Map(data.map((r) => [r.path, r.title]));
      crumbs.forEach((c) => { if (titles.get(c.path)) c.label = titles.get(c.path); });
    }
  } catch (e) { /* index not available yet — segment labels stand */ }
  // live: the last crumb is the page's own title (the <title>), not its h1
  const pageTitle = (document.title || '').trim();
  const h1 = document.querySelector('main h1');
  if (crumbs.length > 1) {
    const last = crumbs[crumbs.length - 1];
    last.label = pageTitle || (h1 ? h1.textContent.trim() : last.label);
  }
  ol.textContent = '';
  crumbs.forEach((c, i) => {
    const li = el('li');
    if (i === crumbs.length - 1) {
      li.className = 'active';
      li.textContent = c.label;
    } else {
      const a = el('a', '', { href: c.path });
      a.textContent = c.label;
      const div = el('span', 'divider');
      div.textContent = '>';
      li.append(a, ' ', div);
    }
    ol.append(li);
  });
}

function decorateNavList(ul) {
  ul.className = 'main-nav-list';
  [...ul.children].forEach((li, i) => {
    li.className = 'main-nav-item';
    // pipeline (#98): <li><p><a></p><ul> on live, <li><a><ul> in the harness — normalize
    const link = li.querySelector(':scope > a, :scope > p > a');
    const sub = li.querySelector(':scope > ul');
    const controls = el('div', 'main-nav-controls');
    if (link) {
      const p = link.closest('p');
      link.className = 'main-nav-link';
      if (p && p.parentElement === li) p.replaceWith(link);
      controls.append(link);
    }
    if (sub) {
      const id = `nav-sub-${i}`;
      sub.id = id;
      sub.className = 'main-nav-sub';
      const toggle = el('button', 'main-nav-toggle', { type: 'button', 'aria-expanded': 'false', 'aria-controls': id });
      const sr = el('span', 'sr-only');
      sr.textContent = `${link ? link.textContent.trim() : ''} submenu`;
      toggle.append(sr);
      toggle.addEventListener('click', () => {
        const open = li.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      controls.append(toggle);
    }
    li.prepend(controls);
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')].map((s) => s.querySelector('.default-content-wrapper') || s);
  const [alertSec, brandSec, navSec, toolsSec] = sections;

  const root = el('div', 'site-header');
  const topNav = el('div', 'top-nav');
  root.append(topNav);

  // 1. alert banner
  if (alertSec && alertSec.textContent.trim()) {
    const banner = el('div', 'alert-banner');
    const content = el('div', 'alert-banner-content');
    const icon = el('img', 'alert-banner-icon', {
      src: '/icons/tennis-ball.svg', alt: '', width: '22', height: '22',
    });
    const text = el('div', 'alert-banner-text');
    text.append(...alertSec.querySelectorAll('p'));
    const close = el('button', 'alert-banner-close', { type: 'button', 'aria-label': 'Close' });
    close.addEventListener('click', () => {
      banner.classList.add('is-hidden');
      try { sessionStorage.setItem('nc-alert-closed', '1'); } catch (e) { /* ignore */ }
    });
    try { if (sessionStorage.getItem('nc-alert-closed')) banner.classList.add('is-hidden'); } catch (e) { /* ignore */ }
    content.append(icon, text, close);
    banner.append(content);
    topNav.append(banner);
  }
  topNav.append(el('div', 'top-nav-line'));

  // 2. nav row: brand + menu + tools
  const row = el('div', 'top-nav-content');
  const logo = el('div', 'top-nav-logo');
  const cancel = iconButton('top-nav-logo-cancel', '/icons/cancel-topnav-bold.svg', 'Close', 'Close menu');
  const hamburger = iconButton('top-nav-logo-hamburger', '/icons/hamburger-menu-black.svg', 'Menu', 'Open menu');
  hamburger.addEventListener('click', () => document.body.classList.add('menu-open'));
  cancel.addEventListener('click', () => document.body.classList.remove('menu-open'));
  logo.append(cancel, hamburger);
  if (brandSec) {
    const link = brandSec.querySelector('a') || el('a', '', { href: '/' });
    link.className = 'top-nav-logo-image';
    const media = brandSec.querySelector('picture, img');
    if (media && !link.contains(media)) link.append(media);
    logo.append(link);
  }
  row.append(logo);

  const nav = el('nav', 'main-nav', { 'aria-label': 'Main menu' });
  const ul = navSec ? navSec.querySelector('ul') : null;
  if (ul) { decorateNavList(ul); nav.append(ul); }
  row.append(nav);

  if (toolsSec) {
    const tools = el('div', 'top-nav-tools');
    toolsSec.querySelectorAll('a').forEach((a) => tools.append(a.closest('p') || a));
    row.append(tools);
  }
  topNav.append(row);

  // 3. breadcrumb band (part of the fixed header on the live site)
  const crumb = el('div', 'breadcrumb');
  const inner = el('div', 'breadcrumb-inner');
  const bnav = el('nav', '', { 'aria-label': 'Breadcrumb' });
  const ol = el('ol');
  bnav.append(ol);
  inner.append(bnav);
  crumb.append(inner);
  root.append(crumb);
  buildBreadcrumb(ol);

  // close the mobile panel / dropdowns on escape
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      document.body.classList.remove('menu-open');
      root.querySelectorAll('.main-nav-item.is-open').forEach((li) => {
        li.classList.remove('is-open');
        const t = li.querySelector('.main-nav-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
  isDesktop.addEventListener('change', () => document.body.classList.remove('menu-open'));

  block.textContent = '';
  block.append(root);
}
