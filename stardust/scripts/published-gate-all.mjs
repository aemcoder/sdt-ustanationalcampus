// Published-origin pixel gate over the wave-1 sibling pages (source-fidelity-gate.md § published-origin gate), N pages in
// parallel. Per page × width: live stitch (settled, cached), published stitch, pixel-compare (bands), summary JSONL.
import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
const PUB='https://main--sdt-ustanationalcampus--aemcoder.aem.page'; const CONC=+(process.env.CONC||5);
const st=JSON.parse(fs.readFileSync('stardust/state.json','utf8')); const map=JSON.parse(fs.readFileSync('stardust/.work/pagemap.json','utf8'));
const arche=new Set(Object.values(st.replica.archetypes).concat(['en-home-about-holiday-hours-html','en-home-news-campus-pro-shop-html']));
const only=process.argv.slice(2); const pages=st.pages.filter(p=>p.type!=='redirect' && (process.env.ALL||!arche.has(p.slug)) && (!only.length||only.includes(p.slug)));
const jobs=[]; for (const p of pages) for (const w of [1440,360]) jobs.push({slug:p.slug,type:p.type,live:p.url,pub:PUB+map[p.slug].path,path:map[p.slug].path,w});
const outDir='stardust/replica/gates'; const summary=process.env.SUMMARY||'stardust/replica/gates/published-siblings.jsonl';
const run=(args,log)=>new Promise((res)=>{ const ch=spawn('node',args,{stdio:['ignore','pipe','pipe']}); let out=''; ch.stdout.on('data',d=>out+=d); ch.stderr.on('data',d=>out+=d); ch.on('close',code=>{ if(log) fs.appendFileSync(log,out); res({code,out}); }); });
let i=0, done=0; const results=[];
async function worker(){ while(i<jobs.length){ const j=jobs[i++]; const G=path.join(outDir,`${j.slug}-${j.w}`); fs.mkdirSync(G,{recursive:true}); const t0=Date.now();
  if (!fs.existsSync(path.join(G,'live.png'))) { const r=await run(['stardust/scripts/replica/stitch-shot.mjs',j.live,path.join(G,'live.png'),'--width',String(j.w),'--settle'],path.join(G,'stitch.log')); if(r.code!==0){ results.push({...j,error:'live stitch failed '+r.out.slice(-160)}); fs.appendFileSync(summary,JSON.stringify(results.at(-1))+'\n'); done++; continue; } }
  await run(['stardust/scripts/trim-black.mjs',path.join(G,'live.png')]);
  const r2=await run(['stardust/scripts/replica/stitch-shot.mjs',j.pub,path.join(G,'published.png'),'--width',String(j.w),'--settle'],path.join(G,'stitch.log')); if(r2.code!==0){ results.push({...j,error:'published stitch failed '+r2.out.slice(-160)}); fs.appendFileSync(summary,JSON.stringify(results.at(-1))+'\n'); done++; continue; }
  const r3=await run(['stardust/scripts/replica/pixel-compare.mjs',path.join(G,'live.png'),path.join(G,'published.png'),'--out',path.join(G,'diff-published.png')]); const out=r3.out;
  const pct=+((out.match(/= ([0-9.]+)%/)||[])[1]||NaN); const dh=+((out.match(/height delta (-?[0-9]+)px/)||[])[1]||0); const sizes=(out.match(/A (\d+)x(\d+)\s+B (\d+)x(\d+)/)||[]); const bands=[...out.matchAll(/y\s+(\d+)–(\d+): ([0-9.]+)%/g)].map(m=>[+m[1],+m[2],+m[3]]); const hot=bands.filter(b=>b[2]>15).map(b=>`${b[0]}-${b[1]}:${b[2]}%`);
  const rec={...j,pct,dh,liveH:+sizes[2]||null,pubH:+sizes[4]||null,hot,pass:pct<10,secs:Math.round((Date.now()-t0)/1000)}; results.push(rec); fs.appendFileSync(summary,JSON.stringify(rec)+'\n'); fs.writeFileSync(path.join(G,'published.txt'),JSON.stringify(rec)); done++; process.stderr.write(`[${done}/${jobs.length}] ${j.slug} ${j.w}: ${pct}% Δh${dh} ${rec.pass?'PASS':'FAIL'}\n`); } }
fs.writeFileSync(summary,''); await Promise.all(Array.from({length:CONC},worker));
const fails=results.filter(r=>r.error||!r.pass); console.error(`\ndone: ${results.length} runs, ${fails.length} fail/err`);
