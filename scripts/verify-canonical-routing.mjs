import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
assert.equal(config.trailingSlash,undefined);
const rules=config.redirects;
function destination(urlPath){
 for(const rule of rules){
  if(rule.source===urlPath)return {target:rule.destination,permanent:rule.permanent};
  const dynamic=rule.source.match(/^\/:section\((.*?)\)\/:path\((.*)\)$/);
  if(dynamic){const match=urlPath.match(new RegExp('^/('+dynamic[1]+')/('+dynamic[2]+')$'));if(match)return {target:rule.destination.replace(':section',match[1]).replace(':path',match[2]),permanent:rule.permanent};}
 }
 return null;
}
const xml=fs.readFileSync('public/sitemap.xml','utf8');const routes=[...xml.matchAll(/<loc>https:\/\/[^/]+([^<]*)<\/loc>/g)].map(m=>m[1]);const report=JSON.parse(fs.readFileSync('build-report.json','utf8'));assert.equal(routes.length,report.indexablePages);assert.equal(report.sourceCases,1600);assert.equal(report.examplePages+report.embeddedCases,report.sourceCases);assert.equal(report.embeddedCases,80);
for(const route of routes){assert.equal(destination(route),null,'Canonical must not redirect: '+route);if(route!='/')assert.deepEqual(destination(route.slice(0,-1)),{target:route,permanent:true},'Normalize published alias: '+route)}
for(const slug of ['nightly-rate-average','review-specificity'])for(let n=1;n<=40;n++)for(const suffix of ['', '/'])assert.deepEqual(destination('/workbooks/'+slug+'/example-'+String(n).padStart(2,'0')+suffix),{target:'/library/'+slug+'/#case-'+String(n).padStart(2,'0'),permanent:true});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const file of walk('public'))if(!file.endsWith('.html'))assert.equal(destination('/'+path.relative('public',file).replaceAll(path.sep,'/')),null,'Asset must not redirect: '+file);
for(const probe of ['/library/topic/file.json','/workbooks/topic/file.css','/style.css','/sitemap.xml','/robots.txt','/unrelated-not-a-published-page'])assert.equal(destination(probe),null);
assert(!rules.some(r=>r.destination.startsWith('//')),'No protocol-relative destinations');
console.log(JSON.stringify({canonicalPagesWithoutRedirect:routes.length,publishedSlashlessAliases:routes.length-1,retiredCasesDirectURLForms:160,assetsExempt:true,scope:'Local matching of the configured literal and namespace rules; actual platform responses still require live verification.'}));
