// Merge per-archetype ledgers (stardust/replica/progress/<slug>.json) into stardust/replica/progress.json and
// advance state.json: prototyped → approved (approvedBy: hands-off) when both breakpoints pass.
import fs from 'node:fs'; import path from 'node:path';
const now=new Date().toISOString(); const dir='stardust/replica/progress';
const prog=JSON.parse(fs.readFileSync('stardust/replica/progress.json','utf8')); const st=JSON.parse(fs.readFileSync('stardust/state.json','utf8'));
let changed=[];
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))) { const slug=f.replace(/\.json$/,''); const led=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')); prog.archetypes[slug]=led;
  const bps=led.breakpoints||{}; const pass=Object.keys(bps).length>=2 && Object.values(bps).every(b=>b.result&&b.result.pass);
  const page=st.pages.find(p=>p.slug===slug); if(!page) continue; const proto=`stardust/prototypes/${slug}-proposed.html`; if(!fs.existsSync(proto)) continue;
  if (!page.history.some(h=>h.status==='prototyped')) { page.status='prototyped'; page.history.push({status:'prototyped',at:now}); page.prototypePath=proto; changed.push(slug+':prototyped'); }
  if (pass && !page.history.some(h=>h.status==='approved')) { page.status='approved'; page.history.push({status:'approved',at:now,approvedBy:'hands-off',gate:Object.fromEntries(Object.entries(bps).map(([w,b])=>[w,{pixelPct:b.result.pixelPct,heightDelta:b.result.heightDelta,structuralRed:b.result.structuralRed}]))}); changed.push(slug+':approved'); }
  page.fidelityTier='archetype'; }
prog._provenance.writtenAt=now; fs.writeFileSync('stardust/replica/progress.json',JSON.stringify(prog,null,2)); st._provenance={writtenBy:'stardust:replica',writtenAt:now,stardustVersion:'0.22.1'}; fs.writeFileSync('stardust/state.json',JSON.stringify(st,null,2));
console.log('merged', Object.keys(prog.archetypes).length, 'ledgers; changes:', changed.join(', ')||'none');
for (const [slug,led] of Object.entries(prog.archetypes)) { const b=led.breakpoints||{}; console.log(' ', slug.padEnd(62), Object.entries(b).map(([w,x])=>`${w}: ${x.result?.pixelPct}% Δh${x.result?.heightDelta} red${x.result?.structuralRed} ${x.result?.pass?'PASS':'FAIL'} (${x.iterations} it)`).join(' | ')); }
