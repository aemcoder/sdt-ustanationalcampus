// stardust:replica wave-2 importer, step 2 — author EDS content pages (DA body fragments) for the news archive from the
// records stardust/scripts/news-extract.mjs wrote. Content model (stardust/eds-conversion-log.md): metadata block →
// article-hero = DEFAULT CONTENT section (picture · kicker p · h1 · date p) with section style `article-hero` (D1 —
// the lint flags a prose-only 2-row block; the fixed composition is styled in place) → body as DEFAULT CONTENT (verbatim source block-level nodes) →
// optional embed URL paragraph (video) → optional carousel.gallery block (one row per image + caption).
import fs from 'node:fs'; import path from 'node:path';
const recDir='stardust/.work/news'; const outDir='content/news'; fs.mkdirSync(outDir,{recursive:true});
const pagemap=JSON.parse(fs.readFileSync('stardust/.work/pagemap.json','utf8'));
const byLink=new Map(Object.values(pagemap).filter(p=>p.wave===2).map(p=>[p.source,p]));
const ORIGIN='https://www.ustanationalcampus.com';
const esc=(s)=>String(s).replace(/&(?!(amp|lt|gt|quot|#\d+|nbsp);)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const abs=(u)=>{ try { return new URL(u.replace(/ /g,'%20'),ORIGIN).href; } catch { return u; } };
const seenPaths=new Map();
// media-reconcile: verified-dead source images (stardust/scripts/news-media-check.mjs) are omitted, never shipped as about:error
const broken=new Set(fs.existsSync('stardust/.work/news/_broken-images.json')?JSON.parse(fs.readFileSync('stardust/.work/news/_broken-images.json','utf8')).map(b=>b.url):[]);
const isDead=(u)=>broken.has(u)||broken.has(esc(u));
let omitted=0;
function cleanBody(html){
  let h=html;
  h=h.replace(/<!--[\s\S]*?-->/g,'');
  // unwrap layout divs/spans, drop share buttons, empty spacers, inline styles/classes
  h=h.replace(/<button[\s\S]*?<\/button>/g,'');
  h=h.replace(/<\/?(div|span|section|article|font|center)[^>]*>/g,'');
  h=h.replace(/\s(style|class|id|dir|lang|align|width|height|border|cellpadding|cellspacing|valign|bgcolor|onclick|data-[a-z-]+)="[^"]*"/g,'');
  h=h.replace(/<img([^>]*?)\ssrc="([^"]+)"/g,(m,pre,src)=>`<img${pre} src="${abs(src)}"`);
  h=h.replace(/<a([^>]*?)\shref="(\/[^"]*)"/g,(m,pre,href)=>{ const t=byLink.get(href) || Object.values(pagemap).find(p=>p.source===href); return `<a${pre} href="${t?t.path:abs(href)}"`; });
  h=h.replace(/<b>/g,'<strong>').replace(/<\/b>/g,'</strong>').replace(/<i>/g,'<em>').replace(/<\/i>/g,'</em>');
  h=h.replace(/<u>([\s\S]*?)<\/u>/g,'$1');
  h=h.replace(/<\/?sup>/g,''); // no raw presentational <sup> in content (ENCODE contract)
  h=h.replace(/<h1(\s[^>]*)?>/g,'<h2>').replace(/<\/h1>/g,'</h2>'); // exactly one <h1> per page (#35): body h1s become h2 // underline is presentational; links keep their own underline
  // #112: whitespace-only paragraphs and trailing <br>s never survive the pipeline, but the source (quirks mode) renders one
  // line box per spacer paragraph and per trailing <br>. A paragraph holding a zero-width space DOES survive (verified on
  // /drafts/zwsp-test) and renders the same empty line box — so spacers become <p>&#8203;</p>, one per dropped line.
  h=h.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/g,'<p>&#8203;</p>');
  h=h.replace(/((?:<br\s*\/?>\s*)+)<\/p>/g,(m,brs)=>'</p>'+'<p>&#8203;</p>'.repeat((brs.match(/<br/g)||[]).length));
  // <table> in a DA document IS a block (first row = block name) — author data tables as `table` block rows
  // (Block Collection model; `no-header` when the first row is not a header row, i.e. the archive's key|value tables)
  h=h.replace(/<table>[\s\S]*?<\/table>/g,(t)=>{ const rows=[...t.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m=>[...m[1].matchAll(/<t[dh]>([\s\S]*?)<\/t[dh]>/g)].map(c=>c[1].trim())); if(!rows.length) return ''; const header=/<th>/.test(t)||(rows[0].length>1&&rows[0].every(c=>/^<p>\s*<strong>/.test(c))); return `<div class="table legacy${header?'':' no-header'}">\n${rows.map(r=>`<div>${r.map(c=>`<div>${c}</div>`).join('')}</div>`).join('\n')}\n</div>`; });
  h=h.replace(/\n{3,}/g,'\n\n').trim();
  return h;
}
let n=0, skipped=0; const report=[];
for (const f of fs.readdirSync(recDir)) { const r=JSON.parse(fs.readFileSync(path.join(recDir,f),'utf8')); if (!/^article/.test(r.shape)) { skipped++; report.push({slug:r.slug,skipped:r.shape}); continue; }
  const src=new URL(r.url).pathname; const map=byLink.get(src); if(!map){ skipped++; report.push({slug:r.slug,skipped:'not in pagemap'}); continue; }
  let p=map.path; if (seenPaths.has(p) && seenPaths.get(p)!==src) { p=p+'-alt'; } seenPaths.set(p,src);
  // article-video/gallery variant: the source .textTitle carries the BIG 60px uppercase line in <h2> (extracted as
  // `kicker`) and the small 20px line in <h3> (extracted as `title`) — the visual title is the h2, so swap; the DOM
  // order of the two (small-above-big vs big-above-small) is read from the captured page so the hero keeps it.
  let title=r.title||r.titleFallback||r.pageTitle; let kicker=r.kicker||''; let kickerBelow=false;
  if (/^article-video/.test(r.shape||'') && r.kicker && r.title) {
    [title,kicker]=[r.kicker,r.title];
    try { const src=fs.readFileSync(path.join('stardust/current/pages',r.slug+'.html'),'utf8'); const tt=(src.match(/<div class="textTitle">([\s\S]*?)<\/div>/)||[])[1]||''; const i2=tt.search(/<h2[\s>]/), i3=tt.search(/<h3[\s>]/); kickerBelow = i2>=0 && i3>=0 && i2<i3; } catch { /* keep default order */ }
  }
  const desc=(r.bodyText||'').replace(/\s+/g,' ').slice(0,157).replace(/\s\S*$/,'')+(r.bodyText&&r.bodyText.length>157?'…':'');
  const dateOnly=(r.date||'').split('|').pop().trim();
  const meta=[['Title',esc(r.pageTitle||title)],['Description',esc(desc)],['Template','legacy'],['Category',esc(map.category||'News')],['Published Date',esc(dateOnly)],['Author',/\|/.test(r.date||'')?esc(r.date.split('|')[0].trim()):null],['Image',r.image?esc(r.image):null],['Kicker',kicker?esc(kicker):null]].filter(x=>x[1]);
  const kickerP=kicker?`<p>${esc(kicker)}</p>\n`:'';
  let body=cleanBody(r.bodyHtml||'');
  body=body.replace(/<p>\s*(?:<a [^>]*>)?\s*<img src="([^"]+)"[^>]*>\s*(?:<\/a>)?\s*<\/p>\n?/g,(m,src)=>isDead(src)?(omitted++,''):m).replace(/<img src="([^"]+)"[^>]*>/g,(m,src)=>isDead(src)?(omitted++,''):m);
  const heroImg = r.image && !isDead(r.image) ? r.image : null; if (r.image && !heroImg) omitted++;
  const gal=(r.gallery||[]).filter(g=>!isDead(g.src)); omitted+=(r.gallery||[]).length-gal.length;
  const hero=`${heroImg?`<p><img src="${esc(heroImg)}" alt="${esc(r.imageAlt||title)}"></p>\n`:''}${kickerBelow?'':kickerP}<h1>${esc(title)}</h1>\n${kickerBelow?kickerP:''}${r.date?`<p>${esc(r.date)}</p>\n`:''}<div class="section-metadata"><div><div>style</div><div>article-hero</div></div></div>`;
  const video=r.video?`<div>\n<p><a href="${esc(r.video.replace('/embed/','/watch?v='))}">${esc(r.video.replace('/embed/','/watch?v='))}</a></p>\n</div>\n`:'';
  const gallery=(gal.length)?`<div>\n${r.galleryTitle?`<h2>${esc(r.galleryTitle)}</h2>\n`:''}<div class="carousel gallery">\n${gal.map(g=>`<div><div><img src="${esc(g.src)}" alt="${esc(g.caption||'')}"></div><div>${g.caption?`<p>${esc(g.caption)}</p>`:''}</div></div>`).join('\n')}\n</div>\n</div>\n`:'';
  const html=`<body>\n  <header></header>\n  <main>\n    <div>\n      <div class="metadata">\n${meta.map(([k,v])=>`        <div><div>${k}</div><div>${v}</div></div>`).join('\n')}\n      </div>\n    </div>\n    <div>\n${hero}\n    </div>\n    <div>\n${body}\n    </div>\n${video}${gallery}  </main>\n  <footer></footer>\n</body>\n`;
  const file=path.join('content', p.replace(/^\//,'')+'.html'); fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,html); n++;
  report.push({slug:r.slug,path:p,file,title,paragraphs:r.paragraphs,image:!!r.image,video:!!r.video,gallery:(r.gallery||[]).length,titleBackfilled:!!r.titleFallback});
}
fs.writeFileSync('stardust/.work/news/_author-report.json',JSON.stringify(report,null,1));
console.log('authored',n,'skipped',skipped,'dead images omitted',omitted, 'example', report.find(x=>x.file)?.file);
