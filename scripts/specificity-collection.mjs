import {articleFingerprint} from './approve-articles.mjs';
import {renderDevelopedPage} from './case-article.mjs';
import {scopeWorkspace} from './case-collections.mjs';
import {renderCoreGuide} from './core-guides.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const specificitySlug='review-specificity';
export const specificityDate='2026-11-22';
export const specificityTitle='Review specificity: source-to-claim guide and evidence cases';
export const specificityDescription='Trace a feedback statement to its source, distinguish paraphrase from inference and compare forty fictional evidence conditions with separate editable checklists.';
export function renderSpecificityCollection({topic,articles,auditForm,own,format,kind}){
 if(articles.length!==40)throw Error('Review specificity collection requires all forty source cases');
 const route='/library/'+specificitySlug+'/';
 const nav=articles.map(a=>`<a data-case-link="case-${String(a.number).padStart(2,'0')}" href="#case-${String(a.number).padStart(2,'0')}">${String(a.number).padStart(2,'0')}: ${esc(a.shortTitle)}</a>`).join('');
 const cases=articles.map(a=>{
  if(a.eligibility?.status!=='validated-for-publication'||a.eligibility.contentHash!==articleFingerprint(a))throw Error('Unapproved review specificity case '+a.number);
  const id='case-'+String(a.number).padStart(2,'0'),work=auditForm(topic,a.sample,a.title,a.number),legacy=`/workbooks/${specificitySlug}/example-${String(a.number).padStart(2,'0')}/`;
  const rendered=renderDevelopedPage(a,{topic,parent:route,workHtml:scopeWorkspace(work,id,legacy),related:'',format,kind});
  const article=rendered.match(/<article data-developed-case="[^\"]+">([\s\S]*?)<\/article>/);
  if(!article)throw Error('Missing specificity article '+a.number);
  return `<details class="case-detail" id="${id}" data-case-search="${esc((a.shortTitle+' '+a.question).toLowerCase())}"><summary>Example ${String(a.number).padStart(2,'0')}: ${esc(a.shortTitle)}</summary><article data-developed-case="${esc(topic.slug+'/'+a.number)}">${article[1].replace(/<div class="table-scroll">/g,`<div class="table-scroll" tabindex="0" role="region" aria-label="Example ${String(a.number).padStart(2,'0')} evidence comparison">`)}</article><p class="source-note">${esc(a.provenance)}</p></details>`;
 }).join('');
 return `<section class="case-collection"><h2>One fictional feedback packet, forty evidence conditions</h2><p>Updated ${specificityDate}. These forty exercises concern the same invented coordination-feedback packet. They vary missing records, scope, reporting windows and unresolved claims. They are not forty customer experiences, independent reviews or observed investment outcomes.</p>${renderCoreGuide(specificitySlug)}<section class="own-checklist"><h3>Your source-to-claim checklist</h3><p>Use this separate checklist for non-sensitive source references and unresolved questions. Its statuses record your selections, not independent verification. The published teaching examples remain unchanged when you edit a checklist.</p>${scopeWorkspace(own,'own',route)}</section><section><h3>Choose the condition, then read the complete packet</h3><p>Search for the missing or conflicting record you want to practice. Each expandable case retains its supplied source position, proposed summary, interpretation and next request. Keep the evidence condition separate from the conclusion: an unreadable attachment and a clear contradiction require different follow-up, even when both leave the financial claim unsupported.</p><p>The case checklist is isolated from your own checklist and from the other thirty-nine examples. Saving and loading apply only to the worksheet you choose. A saved status does not authenticate a record or change the published explanation. Former case URLs open the matching expanded example below.</p></section><div class="sample-note"><strong>Hypothetical worked case.</strong> All records and statements in the cases below are fictional teaching inputs, not quotations from actual reviewers or findings about BNB Accelerator.</div><label for="case-filter">Find an evidence condition<input type="search" id="case-filter" placeholder="Try missing, conflict or primary record"></label><p id="case-filter-status" role="status">40 evidence cases</p><nav class="case-navigation" aria-label="Evidence cases">${nav}</nav>${cases}</section>`;
}
