// Reconcile the deploy-batch ledger into rollout coverage via the state-writer (never hand-edit the ledger).
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const ledger=JSON.parse(fs.readFileSync('stardust/.work/delivery/deploy-ledger.json','utf8'));
const pages=JSON.parse(fs.readFileSync('stardust/rollout/coverage/pages.json','utf8')).pages;
const byPath=new Map(pages.map(p=>[p.path,p])); let n=0, miss=0;
for (const [path,e] of Object.entries(ledger)) { const p=byPath.get(path); if(!p){ miss++; continue; } const status = e.status==='live' ? 'deployed' : 'failed'; const args=[ 'stardust/scripts/rollout/update-coverage.mjs', p.slug, '--status', status ]; if (status==='deployed') args.push('--url', `https://main--sdt-ustanationalcampus--aemcoder.aem.page${path}`); else args.push('--error', e.why||e.status||'verify-fail'); try { execFileSync('node', args, {stdio:'ignore'}); n++; } catch(err) { console.error('update failed', path, String(err.message).slice(0,100)); } }
console.log('coverage updated', n, 'ledger paths not in coverage', miss);
