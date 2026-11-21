import {auditSummary} from './engine.mjs';
const roots=[...document.querySelectorAll('[data-case-workspace]')];
for(const root of roots){
 const data=JSON.parse(root.querySelector('[data-case-workspace-data]').textContent);
 const role=name=>root.querySelector(`[data-workspace-role="${name}"]`);
 const fields=[...root.querySelectorAll('[name]')];
 const initial=fields.map(el=>el.value);
 const result=role('workspace-result'),status=role('save-status'),formula=role('live-formula');
 const key='bnb-workspace-v1:'+root.dataset.storagePath;
 const values=()=>Object.fromEntries(fields.map(el=>[el.name,el.value]));
 const update=()=>{const summary=auditSummary([...root.querySelectorAll('[data-evidence]')].map(el=>el.value));result.textContent=summary.message;formula.textContent=`${summary.counts.reviewed} of ${summary.total} records marked reviewed.`;};
 const restore=entries=>{for(const el of fields)if(typeof entries[el.name]==='string'&&(el.tagName!=='SELECT'||[...el.options].some(o=>o.value===entries[el.name])))el.value=entries[el.name];update();};
 root.addEventListener('input',update);root.addEventListener('change',update);
 root.querySelector('[data-review-status]').addEventListener('click',update);
 role('workspace-save').addEventListener('click',()=>{try{localStorage.setItem(key,JSON.stringify(values()));status.textContent='Saved on this browser for this worksheet.';}catch{status.textContent='This browser could not save the worksheet. Use Export JSON instead.';}});
 role('workspace-load').addEventListener('click',()=>{try{const raw=localStorage.getItem(key);if(!raw){status.textContent='No saved entries for this worksheet.';return;}const saved=JSON.parse(raw);if(!saved||typeof saved!=='object'||Array.isArray(saved))throw Error();restore(saved);status.textContent='Loaded saved entries for this worksheet.';}catch{status.textContent='Saved entries could not be loaded. Published inputs remain available.';}});
 role('workspace-reset').addEventListener('click',()=>{fields.forEach((el,i)=>el.value=initial[i]);update();try{localStorage.removeItem(key);status.textContent='Published inputs restored and this worksheet’s saved entries cleared.';}catch{status.textContent='Published inputs restored; browser storage could not be cleared.';}});
 role('workspace-export').addEventListener('click',()=>{
  const anchor=data.example?'#case-'+String(data.example).padStart(2,'0'):'';
  const payload={worksheet:data.title,source:location.origin+location.pathname+anchor,originalWorksheet:root.dataset.storagePath,example:data.example,formulaVersion:'2026-11-21.1',inputs:values(),result:result.textContent,note:'User-entered teaching worksheet, not verified performance.'};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`bnb-worksheet-${data.slug}-${data.example?'example-'+String(data.example).padStart(2,'0'):'own'}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='JSON export prepared for this worksheet.';
 });
 role('workspace-print').addEventListener('click',()=>{const target=root.closest('details')||root.closest('.own-checklist');target.dataset.printSelected='';document.body.classList.add('printing-case');const cleanup=()=>{delete target.dataset.printSelected;document.body.classList.remove('printing-case');};window.addEventListener('afterprint',cleanup,{once:true});window.print();cleanup();});
 update();
}
const details=[...document.querySelectorAll('.case-detail')],filter=document.getElementById('case-filter'),status=document.getElementById('case-filter-status'),links=[...document.querySelectorAll('[data-case-link]')];
function applyFilter(){const query=filter.value.trim().toLowerCase();let count=0;for(const detail of details){const match=!query||detail.dataset.caseSearch.includes(query);detail.hidden=!match;if(match)count++;const link=links.find(a=>a.dataset.caseLink===detail.id);link.hidden=!match;}status.textContent=`${count} of 40 evidence cases`;}
filter.addEventListener('input',applyFilter);
function revealHash(){const detail=details.find(el=>'#'+el.id===location.hash);if(!detail)return;if(detail.hidden){filter.value='';applyFilter();}detail.open=true;detail.scrollIntoView({block:'start'});}
for(const link of links)link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const target=details.find(el=>el.id===link.dataset.caseLink);target.open=true;if(location.hash==='#'+target.id)target.scrollIntoView({block:'start'});});
window.addEventListener('hashchange',revealHash);revealHash();
