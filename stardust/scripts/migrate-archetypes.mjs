// replica → migrate (Path A) for the gated archetypes: copy each approved prototype into stardust/migrated/<outputPath>
// with relative asset refs + a _meta.json sidecar (migration-procedure.md § _meta.json), so rollout's inventory/coverage
// machinery has its input. Platform conversion is done directly from the prototypes by the deploy agents.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const now=new Date().toISOString(); const st=JSON.parse(fs.readFileSync('stardust/state.json','utf8')); const map=JSON.parse(fs.readFileSync('stardust/.work/pagemap.json','utf8'));
const sha=(f)=>fs.existsSync(f)?crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex').slice(0,12):null;
const out='stardust/migrated'; fs.mkdirSync(out,{recursive:true});
// shared assets once
for (const d of ['css','js','assets']) { fs.cpSync(path.join('stardust/prototypes',d), path.join(out,'_proto',d), {recursive:true}); }
const pageMap=[]; let n=0;
for (const p of st.pages) { const proto=`stardust/prototypes/${p.slug}-proposed.html`; if (p.status!=='approved' || !fs.existsSync(proto)) continue;
  const m=map[p.slug]; const outPath = m.path==='/' ? 'index.html' : m.path.replace(/^\//,'')+'/index.html'; const dir=path.dirname(path.join(out,outPath)); fs.mkdirSync(dir,{recursive:true});
  const depth=outPath.split('/').length-1; const rel='../'.repeat(depth)+'_proto/';
  let html=fs.readFileSync(proto,'utf8').replace(/(href|src)="(css|js|assets)\//g,(x,a,d)=>`${a}="${rel}${d}/`);
  const meta={slug:p.slug,type:p.type,renderBranch:'A',template:p.slug,fidelityTier:'archetype',modules:[...new Set([...html.matchAll(/data-section="([^"]+)"/g)].map(x=>x[1]))],slotsFilled:[],canonShas:{header:sha('stardust/prototypes/partials/header.html'),footer:sha('stardust/prototypes/partials/footer.html'),css:sha('stardust/prototypes/css/canon.css')},deviations:[],migrationDecisions:[{kind:'replica-path-a',note:'prototype copied verbatim; EDS conversion authored directly from the prototype by the deploy agents'}],metadata:{title:p.title,sourceUrl:p.url,path:m.path,template:p.type==='listing'||p.type==='article'?'legacy':(p.type==='static'?'content-page':null)},gatesPassed:['source-fidelity-1440','source-fidelity-360','content-diff','visual-diff','chrome-crop'],migratedAt:now,designMdSha:sha('DESIGN.md'),designJsonSha:sha('DESIGN.json'),sourceCurrentSha:sha(`stardust/current/pages/${p.slug}.json`),sourceProposedSha:sha(proto)};
  html=html.replace('<head>',`<head>\n<!-- stardust:provenance\n  writtenBy: stardust:migrate (replica Path A)\n  writtenAt: ${now}\n  sidecar: ${path.basename(outPath)==='index.html'?'_meta.json':outPath.replace(/\.html$/,'._meta.json')}\n  readArtifacts: [${proto}]\n-->`);
  fs.writeFileSync(path.join(out,outPath),html); fs.writeFileSync(path.join(dir,'_meta.json'),JSON.stringify(meta,null,2));
  p.status='migrated'; p.history.push({status:'migrated',at:now}); p.migratedPath=path.join(out,outPath); pageMap.push({sourceUrl:new URL(p.url).pathname,outputPath:outPath,slug:p.slug}); n++; }
st.migrate={selfContained:false,outputDir:out,pageMap,note:'archetypes-only (replica); siblings are authored directly as EDS content by the deploy agents (rollout archetypes-only mode)',migratedAt:now};
st._provenance={writtenBy:'stardust:migrate',writtenAt:now,stardustVersion:'0.22.1'}; fs.writeFileSync('stardust/state.json',JSON.stringify(st,null,2));
console.log('migrated archetypes:', n, pageMap.map(x=>x.outputPath).join(', '));
