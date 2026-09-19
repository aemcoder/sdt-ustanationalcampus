#!/usr/bin/env node
/**
 * nav-hover-path — asserts a hover-opened desktop dropdown STAYS open while the pointer
 * travels from the trigger link down to the first sub-link, then clicks it.
 * Catches the "menu collapses in the gap" class of bug (dropdown absolutely positioned
 * below the hovered <li> with a dead strip between them).
 *
 *   node stardust/scripts/nav-hover-path.mjs <pageURL> [--local]
 *   --local serves blocks/header/* from disk over the page origin
 *   exit 0 = pass, 2 = collapsed on the path / click did not navigate
 */
/* eslint-disable import/no-extraneous-dependencies, no-await-in-loop, no-continue, no-console, max-len */
import { chromium } from 'playwright';

const [url = 'https://main--sdt-ustanationalcampus--aemcoder.aem.page/'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const LOCAL = process.argv.includes('--local');
const ITEM = '.main-nav-item'; const LINK = '.main-nav-link'; const SUB = '.main-nav-sub';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
if (LOCAL) {
  await page.route(`${new URL(url).origin}/blocks/header/header.*`, (route) => {
    const f = route.request().url().split('/').pop();
    route.fulfill({ path: `blocks/header/${f}`, contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript' });
  });
}
await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector(`${ITEM} ${SUB}`, { state: 'attached' });

let fail = 0;
const items = page.locator(ITEM).filter({ has: page.locator(SUB) });
const n = await items.count();
for (let i = 0; i < n; i += 1) {
  const item = items.nth(i); const link = item.locator(LINK); const sub = item.locator(SUB);
  const label = (await link.textContent()).trim();
  const lb = await link.boundingBox();
  await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2); await page.waitForTimeout(100);
  if (!(await sub.isVisible())) { console.log(`✗ ${label}: no dropdown on hover`); fail = 2; continue; }
  const target = sub.locator('a').first(); const fb = await target.boundingBox();
  let collapsedAt = null;
  for (let y = lb.y + lb.height - 1; y <= fb.y + fb.height / 2; y += 2) {
    await page.mouse.move(lb.x + lb.width / 2, y); await page.waitForTimeout(10);
    if (collapsedAt === null && !(await sub.isVisible())) collapsedAt = Math.round(y - (lb.y + lb.height));
  }
  const gap = Math.round(fb.y - (lb.y + lb.height));
  if (collapsedAt !== null) { console.log(`✗ ${label}: dropdown collapsed ${collapsedAt}px below the link (first sub-link ${gap}px below)`); fail = 2; continue; }
  console.log(`✓ ${label}: open along the whole ${gap}px path`);
  await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2); await page.waitForTimeout(50); // park back
}
// click-through on the first dropdown
const first = items.first(); const lb = await (first.locator(LINK)).boundingBox();
await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2); await page.waitForTimeout(100);
const a = first.locator(`${SUB} a`).first(); const href = await a.getAttribute('href'); const fb = await a.boundingBox();
for (let y = lb.y + lb.height / 2; y < fb.y + fb.height / 2; y += 4) { await page.mouse.move(lb.x + lb.width / 2, y); await page.waitForTimeout(5); }
await page.mouse.move(fb.x + 10, fb.y + fb.height / 2);
const start = page.url();
try {
  await Promise.all([page.waitForURL((u) => u.href !== start, { timeout: 15000 }), page.mouse.click(fb.x + 10, fb.y + fb.height / 2)]);
  console.log(`✓ click ${href} → ${new URL(page.url()).pathname}`);
} catch (e) { console.log(`✗ click on ${href} did not navigate`); fail = 2; }
await browser.close();
process.exit(fail);
