// section-probe: per top-level-section [y,h,label] on live (#mainContent) or published (main .section) pages.
// domcontentloaded + settle scroll (EDS origin never reaches networkidle once tags run). Output JSON.
import { chromium } from 'playwright'; import { pathToFileURL } from 'url'; import fs from 'node:fs';
const LS = await import(pathToFileURL('stardust/scripts/diff/live-session.mjs').href);
const [url, wStr, mainSel, outFile] = process.argv.slice(2); const width = +wStr || 1440;
const browser = await chromium.launch(); const ctx = await LS.newLiveContext(browser, { viewport: { width, height: 900 } }); const page = await ctx.newPage();
try {
  await LS.gotoLive(page, url, { waitUntil: 'domcontentloaded', timeoutMs: 60000, settleMs: 2500 });
  await LS.dismissOverlays(page, { lateWindowMs: 1500 }).catch(() => {});
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  // settle scroll
  await page.evaluate(async () => { const s = document.scrollingElement; for (let y = 0; y < s.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  const res = await page.evaluate((sel) => {
    let root = document.querySelector(sel) || document.querySelector('main'); if (!root) return { error: 'no root ' + sel }; for (let d = 0; d < 5; d++) { const vis = [...root.children].filter(e => e.getBoundingClientRect().height > 0); if (vis.length === 1 && !vis[0].classList.contains('section')) root = vis[0]; else break; }
    const kids = [...root.children].filter(e => e.getBoundingClientRect().height > 0);
    const lab = (e) => { const h = e.querySelector('h1,h2,h3,h4'); const t = (h ? h.textContent : (e.textContent || '')).trim().replace(/\s+/g, ' ').slice(0, 50); const cls = [...e.classList].filter(c => c !== 'section').slice(0, 4).join('.'); const blocks = [...e.querySelectorAll('[class*="-wrapper"]')].map(b => b.className.replace('-wrapper', '')).slice(0, 4).join(','); return (cls ? '[' + cls + '] ' : '') + (blocks ? '{' + blocks + '} ' : '') + t; };
    const sy = window.scrollY;
    return { docH: document.documentElement.scrollHeight, rootTop: Math.round(root.getBoundingClientRect().top + sy), rootH: Math.round(root.getBoundingClientRect().height), sections: kids.map(e => { const r = e.getBoundingClientRect(); return { y: Math.round(r.top + sy), h: Math.round(r.height), label: lab(e) }; }) };
  }, mainSel || 'main');
  fs.writeFileSync(outFile, JSON.stringify(res, null, 1)); console.log('ok', url, res.docH);
} catch (e) { fs.writeFileSync(outFile, JSON.stringify({ error: String(e.message).slice(0, 200) })); console.log('ERR', url, e.message.slice(0, 120)); }
await browser.close();
