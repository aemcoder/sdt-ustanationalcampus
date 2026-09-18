// wave-2 content-count acceptance (fidelity-tiers.md § Content-count acceptance): captured record vs authored page.
import fs from 'node:fs'; import path from 'node:path';
const rep=JSON.parse(fs.readFileSync('stardust/.work/news/_author-report.json','utf8')).filter(r=>r.file);
const count=(html,re)=>(html.match(re)||[]).length; let fail=0; const rows=[];
for (const r of rep) { const rec=JSON.parse(fs.readFileSync(path.join('stardust/.work/news',r.slug+'.json'),'utf8')); const html=fs.readFileSync(r.file,'utf8'); const bodyStart=html.indexOf('</div>\n    </div>\n    <div>\n', html.indexOf('article-hero')); const authored=html.slice(bodyStart);
  const src=rec.bodyHtml||''; const sP=count(src,/<p[\s>]/g), aP=count(authored,/<p[\s>]/g); const sImg=count(src,/<img[\s>]/g)+(rec.gallery||[]).length, aImg=count(authored,/<img[\s>]/g); const sH=count(src,/<h[1-6][\s>]/g), aH=count(authored,/<h[1-6][\s>]/g)-((rec.gallery||[]).length&&rec.galleryTitle?1:0); const sLi=count(src,/<li[\s>]/g), aLi=count(authored,/<li[\s>]/g); const sTbl=count(src,/<table[\s>]/g), aTbl=count(authored,/<table[\s>]/g)+count(authored,/<div class="table[" ]/g); /* data tables are authored as `table` block rows (a <table> in a DA doc is a block) */
  const sA=count(src,/<a[\s>]/g), aA=count(authored,/<a[\s>]/g)-(rec.video?1:0);
  const drops=[]; if(aP<sP-count(src,/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/g)) drops.push(`p ${sP}→${aP}`); if(aImg<sImg) drops.push(`img ${sImg}→${aImg}`); if(aH<sH) drops.push(`h ${sH}→${aH}`); if(aLi<sLi) drops.push(`li ${sLi}→${aLi}`); if(aTbl<sTbl) drops.push(`table ${sTbl}→${aTbl}`); if(aA<sA) drops.push(`a ${sA}→${aA}`);
  if (drops.length) { fail++; rows.push(r.path+' : '+drops.join(', ')); } }
console.log('news content-count acceptance:', rep.length-fail, 'pass /', fail, 'fail'); console.log(rows.slice(0,15).join('\n'));
