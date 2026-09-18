// Section-anchor triage for failing sibling pages: live (cached) vs published, both widths, N in parallel → JSON per page.
import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
const PUB='https://main--sdt-ustanationalcampus--aemcoder.aem.page'; const CONC=+(process.env.CONC||5);
const rows=fs.readFileSync('stardust/replica/gates/published-siblings.jsonl','utf8').trim().split('\n').map(l=>JSON.parse(l));
const fails=[...new Set(rows.filter(r=>!r.pass||r.error).map(r=>r.slug))]; const map=JSON.parse(fs.readFileSync('stardust/.work/pagemap.json','utf8')); const st=JSON.parse(fs.readFileSync('stardust/state.json','utf8'));
const jobs=[]; for (const slug of fails) for (const w of [1440,360]) jobs.push({slug,w,live:st.pages.find(p=>p.slug===slug).url,pub:PUB+map[slug].path});
const run=(args)=>new Promise((res)=>{ const ch=spawn('node',args,{stdio:['ignore','pipe','pipe']}); let out=''; ch.stdout.on('data',d=>out+=d); ch.stderr.on('data',d=>out+=d); ch.on('close',()=>res(out)); });
const parse=(out)=>({docH:+((out.match(/doc height (\d+)px/)||[])[1]||0), sections:[...out.matchAll(/^\s+y\s+(\d+)\s+h\s+(\d+)\s+(.+)$/gm)].map(m=>({y:+m[1],h:+m[2],name:m[3].trim()}))});
let i=0; const out={}; async function worker(){ while(i<jobs.length){ const j=jobs[i++]; const G=`stardust/replica/gates/${j.slug}-${j.w}`; fs.mkdirSync(G,{recursive:true}); const live=parse(await run(['stardust/scripts/replica/anchor.mjs',j.live,'--width',String(j.w),'--main','#mainContent','--cache',path.join(G,'anchor-live.json')])); const pub=parse(await run(['stardust/scripts/replica/anchor.mjs',j.pub,'--width',String(j.w)])); (out[j.slug]=out[j.slug]||{})[j.w]={live,pub}; process.stderr.write(`${j.slug} ${j.w}: live ${live.docH} pub ${pub.docH}\n`); } }
await Promise.all(Array.from({length:CONC},worker)); fs.writeFileSync('stardust/replica/gates/anchor-triage.json',JSON.stringify(out,null,1)); console.error('done', Object.keys(out).length);
