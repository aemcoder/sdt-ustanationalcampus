// stardust:replica wave-2 importer, step 1 — parse the crawled news-archive DOM sidecars offline into
// structured records (kicker, title, date, hero image, body HTML, gallery). Never re-scrapes live.
import fs from 'node:fs'; import path from 'node:path';
const dir='stardust/current/pages'; const out='stardust/.work/news'; fs.mkdirSync(out,{recursive:true});
const files=fs.readdirSync(dir).filter(f=>/^en-home-news-.*\.html$/.test(f) && !/^en-home-news-(html|holiday-hours-html)\.html$/.test(f));
const strip=(s)=>s.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
let ok=0, shapes={};
for (const f of files) { const slug=f.replace(/\.html$/,''); const json=JSON.parse(fs.readFileSync(path.join(dir,slug+'.json'),'utf8')); const h=fs.readFileSync(path.join(dir,f),'utf8'); const s=h.indexOf('id="mainContent"'); const e=h.indexOf('footer-xf'); const main=h.slice(s,e).replace(/<script[\s\S]*?<\/script>/g,'');
  const comp=main.match(/<div class="articleTextDetailImageComp[^"]*">([\s\S]*?)<div class="clearfix">\s*<\/div>\s*<\/div>\s*<\/div>\s*(?=<div id="photoModal"|<div class="clearfix"|<div class="section")/) || main.match(/<div class="articleTextDetailImageComp[^"]*">([\s\S]*)/);
  const shape = comp ? 'article' : (/<div class="text /.test(main)?'text':'other'); shapes[shape]=(shapes[shape]||0)+1;
  if (!comp) { fs.writeFileSync(path.join(out,slug+'.json'),JSON.stringify({slug,url:json.url,shape,title:json.title},null,1)); continue; }
  // video/gallery variant: .textTitle carries h2 (kicker) h3 (title) h6 (byline | date); body = .articleText blocks; .articleVideo iframe; .imageGallery imgGalData
  if (/class="articleVideo"|class="imageGallery"/.test(comp[1])) {
    const c=comp[1]; const tt=(c.match(/<div class="textTitle">([\s\S]*?)<\/div>\s*<div class="imgWrap"/)||[])[1]||'';
    const h2=strip((tt.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)||[])[1]||''), h3=strip((tt.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)||[])[1]||''), h6=strip((tt.match(/<h6[^>]*>([\s\S]*?)<\/h6>/)||[])[1]||'');
    const imgWrap=(c.match(/<div class="imgWrap">([\s\S]*?)<div class="col-xs-12 shareImg/)||[])[1]||''; const img=(imgWrap.match(/<img[^>]*\ssrc="([^"]+)"/)||[])[1]||null; const imgAlt=(imgWrap.match(/<img[^>]*\salt="([^"]*)"/)||[])[1]||'';
    const texts=[...c.matchAll(/<div class="articleText[^"]*">([\s\S]*?)<\/div>\s*(?=<div class="article|<div class="imageGallery|<\/div>)/g)].map(m=>m[1].trim()).filter(t=>/<p|<h|<ul|<table/.test(t));
    const video=(c.match(/<div class="articleVideo">[\s\S]*?<iframe[^>]*src="([^"]+)"/)||[])[1]||null;
    const galSrc=(main.match(/<div id="photoData"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)||[])[1]||c; const galleryTitle=(main.match(/<div id="photoData"[^>]*gallery-title="([^"]*)"/)||[])[1]||null; const gallery=[...galSrc.matchAll(/<div class="imgGalData"([^>]*)>/g)].map(m=>{ const src=(m[1].match(/data-imgpath="([^"]+)"/)||[])[1]; const cap=((m[1].match(/data-imgcaption="([^"]*)"/)||[])[1]||'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"'); return {src:src?new URL(src.replace(/ /g,'%20'),'https://www.ustanationalcampus.com').href:null,caption:cap}; }).filter(g=>g.src);
    const galleryLead=(c.match(/<div class="imgGalWrap">[\s\S]*?<img[^>]*src="([^"]+)"/)||[])[1]||null;
    const rec={slug,url:json.url,shape:'article-video',kicker:h2,title:h3||json.title,titleFallback:!h3?json.title:null,date:h6,image:img?new URL(img,'https://www.ustanationalcampus.com').href:null,imageAlt:imgAlt,bodyHtml:texts.join('\n'),bodyText:strip(texts.join(' ')).slice(0,300),video:video?new URL(video.replace(/^\/\//,'https://'),'https://www.ustanationalcampus.com').href:null,gallery,galleryTitle,galleryLead:galleryLead?new URL(galleryLead,'https://www.ustanationalcampus.com').href:null,paragraphs:(texts.join('').match(/<p[\s>]/g)||[]).length,pageTitle:json.title,fetchedAt:json._provenance.fetchedAt};
    fs.writeFileSync(path.join(out,slug+'.json'),JSON.stringify(rec,null,1)); shapes[shape]--; shapes['article-video']=(shapes['article-video']||0)+1; ok++; continue; }
  const c=comp[1];
  const kicker=strip((c.match(/<div class="textTitle">[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/)||[])[1]||'');
  const title=strip((c.match(/<div class="textTitle">[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/)||[])[1]||'');
  const date=strip((c.match(/<div class="textTitle">[\s\S]*?<h6[^>]*>([\s\S]*?)<\/h6>/)||[])[1]||'');
  // hero image: the <picture>/<img> that follows .articleImg (the div itself carries a CSS-escaped background-image)
  const imgWrap=(c.match(/<div class="imgWrap">([\s\S]*?)<div class="col-xs-12 shareImg/)||[])[1]||'';
  let img=(imgWrap.match(/<img[^>]*\ssrc="([^"]+)"/)||[])[1]||null; const imgAlt=(imgWrap.match(/<img[^>]*\salt="([^"]*)"/)||[])[1]||'';
  if(!img){ const bg=(imgWrap.match(/background-image:\s*url\('([^']+)'\)/)||[])[1]; if(bg) img=bg.replace(/\\2f\s?/g,'/').replace(/\\([0-9a-f]{2})\s?/gi,(m,h)=>String.fromCharCode(parseInt(h,16))); }
  // article body: the "content Holder" comment region (paragraphs, headings, lists, tables, inline images); the
  // newsletter promo (.textWrap/.socialLinks) and share/photo modals are chrome, not content
  const holder=(c.match(/<!-- content Holder-->([\s\S]*?)<!-- content Holder-->/)||[])[1] ?? (c.match(/<!-- content Holder-->([\s\S]*?)<div id="videoData">/)||[])[1] ?? '';
  const quote=(c.match(/<!-- Quote Holder-->([\s\S]*?)<!-- Quote Holder ends -->/)||[])[1]||'';
  const bodyClean=(quote+holder).replace(/<div class="clearfix">\s*<\/div>/g,'').replace(/<!--[\s\S]*?-->/g,'').trim();
  const gallery=[...main.matchAll(/<div id="photoModal"[\s\S]*?<div class="carousel-inner">([\s\S]*?)<\/div>\s*<a class="left/g)].flatMap(m=>[...m[1].matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)].map(x=>x[1]));
  const rec={slug,url:json.url,shape,kicker,title,date,image:img?new URL(img,'https://www.ustanationalcampus.com').href:null,imageAlt:imgAlt,bodyHtml:bodyClean,bodyText:strip(bodyClean).slice(0,300),quoteHtml:quote.trim()||null,videoData:/<div id="videoData">[\s\S]*?<\/div>/.test(c)?((c.match(/<div id="videoData"[^>]*>([\s\S]*?)<\/div>/)||[])[1]||'').trim()||null:null,titleFallback:!title?json.title:null,paragraphs:(bodyClean.match(/<p[\s>]/g)||[]).length,gallery,pageTitle:json.title,fetchedAt:json._provenance.fetchedAt};
  fs.writeFileSync(path.join(out,slug+'.json'),JSON.stringify(rec,null,1)); ok++; }
console.log('news pages parsed', files.length, 'article-shaped', ok, JSON.stringify(shapes));
const recs=fs.readdirSync(out).map(f=>JSON.parse(fs.readFileSync(path.join(out,f)))).filter(r=>r.shape==='article');
console.log('missing title', recs.filter(r=>!r.title).length, 'missing date', recs.filter(r=>!r.date).length, 'missing image', recs.filter(r=>!r.image).length, 'empty body', recs.filter(r=>!r.bodyHtml.trim()).length, 'with gallery', recs.filter(r=>r.gallery.length).length);
console.log(JSON.stringify({...recs[0], bodyHtml: recs[0].bodyHtml.slice(0,300)},null,1));
const tags={}; for (const r of recs) for (const m of r.bodyHtml.matchAll(/<([a-z0-9]+)[\s>]/g)) tags[m[1]]=(tags[m[1]]||0)+1; console.log('body tags', JSON.stringify(tags));
