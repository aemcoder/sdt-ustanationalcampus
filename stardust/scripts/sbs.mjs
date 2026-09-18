// side-by-side live|pub montage, scaled to a given width per pane, optional y-range crop (in source px)
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [dir, paneW='450', y0='0', y1='99999', out] = process.argv.slice(2);
const load=(f)=>PNG.sync.read(fs.readFileSync(f)); const a=load(`${dir}/live.png`), b=load(`${dir}/published.png`);
const pw=+paneW; const crop=(img)=>{const s=pw/img.width; const ys=Math.max(0,+y0), ye=Math.min(img.height,+y1); return {img,s,ys,h:Math.round((ye-ys)*s)}; };
const A=crop(a),B=crop(b); const H=Math.max(A.h,B.h); const o=new PNG({width:pw*2+10,height:H}); o.data.fill(255);
for (const [P,ox] of [[A,0],[B,pw+10]]) for (let y=0;y<P.h;y++) for (let x=0;x<pw;x++){ const sx=Math.min(P.img.width-1,Math.floor(x/P.s)), sy=Math.min(P.img.height-1,Math.floor(P.ys+y/P.s)); const si=(sy*P.img.width+sx)*4, di=(y*o.width+x+ox)*4; o.data[di]=P.img.data[si]; o.data[di+1]=P.img.data[si+1]; o.data[di+2]=P.img.data[si+2]; o.data[di+3]=255; }
fs.writeFileSync(out||`${dir}/sbs.png`, PNG.sync.write(o)); console.log('live',a.width+'x'+a.height,'pub',b.width+'x'+b.height);
