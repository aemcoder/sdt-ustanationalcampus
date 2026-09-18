/**
 * footer — USTA National Campus sage footer (stardust:replica, node-slotted).
 *
 * Authored document /footer (eight sections, default content only, in this order):
 *   1. brand       — logo image link + the newsletter CTA (<strong><a>)
 *   2. hours       — <h3>Campus Hours</h3> + hour paragraphs + the VIEW HOLIDAY HOURS link
 *   3. address     — <h3>Address</h3> + address paragraphs (phone link) + "Show on map" link
 *   4. usta info   — <h3>Usta info</h3> + <ul> of links
 *   5. usta links  — <h3>Usta links</h3> + <ul> of links
 *   6. book        — the Book now CTA (<strong><a>)
 *   7. social      — <ul> of image links (Facebook, Instagram, YouTube)
 *   8. copyright   — one <p>
 * Every authored element is MOVED into its slot (EW1); wrappers carry the layout classes (EW2).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function moveAll(from, to) {
  if (!from) return;
  [...from.children].forEach((c) => to.append(c));
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  const secs = [...fragment.querySelectorAll(':scope > .section')].map((s) => s.querySelector('.default-content-wrapper') || s);
  const [brand, hours, address, info, links, book, social, copyright] = secs;

  const root = el('div', 'site-footer');
  const top = el('div', 'site-footer-container');

  // 1. brand + newsletter
  const sub = el('section', 'site-footer-subscription');
  if (brand) {
    const logoLink = brand.querySelector('a:has(picture, img)') || brand.querySelector('a');
    if (logoLink) {
      logoLink.className = 'site-footer-logo-link';
      const p = logoLink.closest('p');
      sub.append(p && p.parentElement === brand ? p : logoLink);
    }
    brand.querySelectorAll('a').forEach((a) => {
      if (a === logoLink || sub.contains(a)) return;
      const wrap = el('div', 'site-footer-subscription-button');
      wrap.append(a.closest('p') || a);
      sub.append(wrap);
    });
  }
  top.append(sub);

  // 2–6. info grid
  const infoGrid = el('section', 'site-footer-info');
  const schedule = el('div', 'site-footer-schedule');
  moveAll(hours, schedule);
  const addr = el('div', 'site-footer-address');
  if (address) {
    [...address.children].forEach((c) => {
      const a = c.querySelector && c.querySelector('a[href*="google.com/maps"], a[href*="maps"]');
      if (a && c.tagName === 'P') {
        const map = el('div', 'site-footer-map');
        map.append(c);
        const pin = el('img', 'site-footer-map-pin');
        pin.src = '/icons/map-location-pin.svg';
        pin.alt = '';
        pin.setAttribute('aria-hidden', 'true');
        map.append(pin);
        addr.append(map);
      } else {
        addr.append(c);
      }
    });
  }
  const ustaInfo = el('nav', 'site-footer-links site-footer-links-usta');
  moveAll(info, ustaInfo);
  const ustaLinks = el('nav', 'site-footer-links site-footer-links-partner');
  moveAll(links, ustaLinks);
  const booking = el('div', 'site-footer-booking');
  if (book) book.querySelectorAll('a').forEach((a) => booking.append(a.closest('p') || a));
  infoGrid.append(schedule, addr, ustaInfo, ustaLinks, booking);
  top.append(infoGrid);
  root.append(top);

  // 7–8. social + copyright
  const bottom = el('div', 'site-footer-bottom');
  const socialNav = el('nav', 'site-footer-social');
  socialNav.setAttribute('aria-label', 'Social');
  moveAll(social, socialNav);
  const copy = el('div', 'site-footer-copyright');
  moveAll(copyright, copy);
  bottom.append(socialNav, copy);
  root.append(bottom, el('div', 'site-footer-line'));

  block.textContent = '';
  block.append(root);
}
