import fs from 'node:fs'; import { spawn } from 'node:child_process';
const CONC=+(process.env.CONC||5); const rows=fs.readFileSync('stardust/replica/gates/published-siblings.jsonl','utf8').trim().split('\n').map(l=>JSON.parse(l));
const only=process.argv.slice(2); const fails=[...new Set(rows.filter(r=>(!r.pass||r.error)).map(r=>r.slug))].filter(s=>!only.length||only.includes(s)); const st=JSON.parse(fs.readFileSync('stardust/state.json','utf8'));
const jobs=[]; for (const slug of fails) for (const w of [1440,360]) { const G=`stardust/replica/gates/${slug}-${w}`; jobs.push(['stardust/scripts/section-probe.mjs',st.pages.find(p=>p.slug===slug).url,String(w),'#mainContent',`${G}/sections-live.json`]); }
const run=(args)=>new Promise((res)=>{ const ch=spawn('node',args,{stdio:['ignore','pipe','pipe']}); let out=''; ch.stdout.on('data',d=>out+=d); ch.stderr.on('data',d=>out+=d); ch.on('close',()=>res(out)); });
let i=0; async function worker(){ while(i<jobs.length){ const j=jobs[i++]; process.stderr.write((await run(j)).trim().split('\n').pop()+'\n'); } }
await Promise.all(Array.from({length:CONC},worker)); console.error('done',jobs.length);
