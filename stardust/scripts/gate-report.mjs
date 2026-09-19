// Merge gate jsonl files (latest record per slug+width wins, in argument order) → markdown table + summary JSON.
import fs from 'node:fs';
const files=process.argv.slice(2); const latest={}; const r0={};
for (const l of fs.readFileSync('stardust/replica/gates/published-siblings.jsonl','utf8').trim().split('\n')) { const r=JSON.parse(l); r0[r.slug+'|'+r.w]=r; }
for (const f of files) if (fs.existsSync(f)) for (const l of fs.readFileSync(f,'utf8').trim().split('\n')) { if(!l.trim()) continue; const r=JSON.parse(l); latest[r.slug+'|'+r.w]=r; }
const by={}; for (const r of Object.values(latest)) (by[r.slug]=by[r.slug]||{type:r.type,path:r.path})[r.w]=r;
const fmt=(r)=>r?(r.error?'stitch-blocked':`${r.pct.toFixed(1)}% Δh${r.dh}${r.pass?'':' ✗'}`):'—';
const f0=(k)=>r0[k]?(r0[k].error?'blocked':r0[k].pct.toFixed(1)+'%'):'—';
const rows=Object.entries(by).sort((a,b)=>a[1].type.localeCompare(b[1].type)||a[1].path.localeCompare(b[1].path));
let pass=0, runs=0, runsPass=0; const md=['| page | type | 1440 (round 0 → final) | 360 (round 0 → final) | status |','|---|---|---|---|---|'];
for (const [slug,v] of rows) { const ok=[1440,360].every(w=>v[w]&&!v[w].error&&v[w].pass); if(ok) pass++; for (const w of [1440,360]) { if(v[w]){runs++; if(!v[w].error&&v[w].pass) runsPass++;} } md.push(`| ${v.path} | ${v.type} | ${f0(slug+'|1440')} → ${fmt(v[1440])} | ${f0(slug+'|360')} → ${fmt(v[360])} | ${ok?'PASS':'open'} |`); }
console.log(md.join('\n')); console.log(`\n**${pass} / ${rows.length} pages pass at both widths; ${runsPass} / ${runs} runs < 10%.**`);
fs.writeFileSync('stardust/replica/gates/siblings-final.json', JSON.stringify({generatedAt:new Date().toISOString(), pagesPass:pass, pages:rows.length, runsPass, runs, pages_: Object.fromEntries(rows.map(([s,v])=>[s,{path:v.path,type:v.type,w1440:v[1440]&&{pct:v[1440].pct,dh:v[1440].dh,pass:v[1440].pass,error:!!v[1440].error},w360:v[360]&&{pct:v[360].pct,dh:v[360].dh,pass:v[360].pass,error:!!v[360].error}}]))},null,1));
