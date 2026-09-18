// media-reconcile for the news archive: HEAD every authored image URL once (decoding HTML entities), record dead ones.
import fs from 'node:fs'; import path from 'node:path';
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const files=fs.readdirSync('content/news').filter(f=>f.endsWith('.html')).map(f=>path.join('content/news',f));
const dec=(u)=>u.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
const urls=new Set(); for (const f of files) for (const m of fs.readFileSync(f,'utf8').matchAll(/<img src="([^"]+)"/g)) urls.add(m[1]);
const list=[...urls]; const out={}; let i=0;
async function worker(){ while(i<list.length){ const u=list[i++]; const d=dec(u); let s=0; try { const r=await fetch(d,{method:'HEAD',headers:{'user-agent':UA},redirect:'follow'}); s=r.status; if (s===405||s===403) { const g=await fetch(d,{headers:{'user-agent':UA,range:'bytes=0-0'}}); s=g.status; } } catch(e){ s=0; } out[u]={status:s,decoded:d!==u?d:undefined}; if(Object.keys(out).length%150===0) process.stderr.write(`\r${Object.keys(out).length}/${list.length}`); } }
await Promise.all(Array.from({length:12},worker));
const dead=Object.entries(out).filter(([u,x])=>!(x.status>=200&&x.status<300&&x.status!==206)||x.status===0).filter(([u,x])=>x.status!==206);
const ok206=Object.values(out).filter(x=>x.status===206).length;
fs.writeFileSync('stardust/.work/news/_media-check.json',JSON.stringify(out,null,1));
fs.writeFileSync('stardust/.work/news/_broken-images.json',JSON.stringify(dead.map(([u,x])=>({url:u,status:x.status,decoded:x.decoded})),null,1));
console.error(`\nchecked ${list.length} urls; dead ${dead.length}; 206 ok ${ok206}`); dead.slice(0,12).forEach(([u,x])=>console.error(' ',x.status,u.slice(0,110)));
