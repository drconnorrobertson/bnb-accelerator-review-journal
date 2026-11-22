import fs from 'node:fs';
import {articleFingerprint} from './approve-articles.mjs';
import {renderDevelopedPage} from './case-article.mjs';
import {scopeWorkspace} from './case-collections.mjs';
import {renderCoreGuide} from './core-guides.mjs';
const cohort=JSON.parse(fs.readFileSync(new URL('../content/collection-cohort.json',import.meta.url),'utf8'));
export const collectionReviewDate=cohort.reviewed;
export const groupedTopicSlugs=new Set(cohort.slugs);
if(groupedTopicSlugs.size!==cohort.slugs.length)throw Error('Duplicate reviewed cohort slug');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderEvidenceCollection({topic,articles,auditForm,own,format,kind,intro}){
 if(articles.length!==40)throw Error('Evidence collection requires all forty source cases');
 const slug=topic.slug,route='/library/'+slug+'/';
 if(!groupedTopicSlugs.has(slug))throw Error('Topic not in reviewed collection cohort: '+slug);
 const nav=articles.map(a=>`<a data-case-link="case-${String(a.number).padStart(2,'0')}" href="#case-${String(a.number).padStart(2,'0')}">${String(a.number).padStart(2,'0')}: ${esc(a.shortTitle)}</a>`).join('');
 const cases=articles.map(a=>{
  if(a.eligibility?.status!=='validated-for-publication'||a.eligibility.contentHash!==articleFingerprint(a))throw Error('Unapproved evidence case '+a.number);
  const id='case-'+String(a.number).padStart(2,'0'),work=auditForm(topic,a.sample,a.title,a.number),legacy=`/workbooks/${slug}/example-${String(a.number).padStart(2,'0')}/`;
  const rendered=renderDevelopedPage(a,{topic,parent:route,workHtml:scopeWorkspace(work,id,legacy),related:'',format,kind});
  const article=rendered.match(/<article data-developed-case="[^\"]+">([\s\S]*?)<\/article>/);
  if(!article)throw Error('Missing evidence article '+a.number);
  return `<details class="case-detail" id="${id}" data-case-search="${esc((a.shortTitle+' '+a.question).toLowerCase())}"><summary>Example ${String(a.number).padStart(2,'0')}: ${esc(a.shortTitle)}</summary><article data-developed-case="${esc(topic.slug+'/'+a.number)}">${article[1].replace(/<div class="table-scroll">/g,`<div class="table-scroll" tabindex="0" role="region" aria-label="Example ${String(a.number).padStart(2,'0')} evidence comparison">`)}</article><p class="source-note">${esc(a.provenance)}</p></details>`;
 }).join('');
 return `<section class="case-collection"><h2>${esc(topic.title)}: one fictional packet, forty evidence conditions</h2><p>Updated ${collectionReviewDate}. These forty exercises share one invented fact packet for this topic. They vary record availability, scope, conflicts and unresolved conditions. They are not forty independent properties, customer experiences or observed outcomes.</p>${intro}${renderCoreGuide(slug)}<section class="own-checklist"><h3>Your evidence checklist</h3><p>Use this separate checklist for non-sensitive source references and open questions. Its statuses record your selections, not independent verification. Editing a checklist does not change the published teaching explanations.</p>${scopeWorkspace(own,'own',route)}</section><section><h3>Choose the evidence condition</h3><p>Start with the topic question: ${esc(topic.question)} Search for the missing or conflicting record you want to practice. Each expandable case preserves its supplied record packet, comparison, interpretation and next request. A different availability condition changes what can be concluded from that packet; it does not create another independent observation.</p><p>Each case has its own editable checklist. Saving, loading, export and print apply to the selected worksheet, and the former case URL opens its matching expanded example. Keep source records and proposed interpretations separate when recording your own non-sensitive review notes.</p></section><div class="sample-note"><strong>Hypothetical worked case.</strong> These are original fictional teaching inputs, not actual customer quotations, provider records or verified BNB results.</div><label for="case-filter">Find an evidence condition<input type="search" id="case-filter" placeholder="Try missing, conflict or primary record"></label><p id="case-filter-status" role="status">40 evidence cases</p><nav class="case-navigation" aria-label="Evidence cases">${nav}</nav>${cases}</section>`;
}
