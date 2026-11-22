"""Independently compare all source articles and worksheet payloads with their collections."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,subprocess,os,xml.etree.ElementTree as ET
root=Path.cwd();pub=root/'public';catalog=json.loads((root/'content/catalog.json').read_text());dossiers=json.loads((root/'content/topic-dossiers.json').read_text());cohort=json.loads((root/'content/collection-cohort.json').read_text())
assert len(cohort['slugs'])==len(set(cohort['slugs']))==38
assert set(cohort['slugs'])=={t['slug'] for t in catalog['topics']}-{'nightly-rate-average','review-specificity'}
class Scan(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.labels=[];self.links=[];self.cases=[];self.roots=[];self.json=[];self.parts=None
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id' in a:self.ids.append(a['id'])
  if t=='label':self.labels.append(a.get('for'))
  if t=='a':self.links.append(a.get('href',''))
  if 'data-developed-case' in a:self.cases.append(a['data-developed-case'])
  if 'data-case-workspace' in a:self.roots.append(a)
  if 'data-case-workspace-data' in a:self.parts=[]
 def handle_data(self,s):
  if self.parts is not None:self.parts.append(s)
 def handle_endtag(self,t):
  if t=='script' and self.parts is not None:self.json.append(json.loads(''.join(self.parts)));self.parts=None
class Visible(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.script=False
 def handle_starttag(self,t,a):
  if t=='script':self.script=True
 def handle_endtag(self,t):
  if t=='script':self.script=False
 def handle_data(self,d):
  if not self.script:self.parts.append(d)
def visible(s):
 p=Visible();p.feed(s);return ' '.join(' '.join(p.parts).split())
node="""import fs from 'node:fs';import {renderDevelopedPage} from './scripts/case-article.mjs';import {renderCoreGuide} from './scripts/core-guides.mjs';const catalog=JSON.parse(fs.readFileSync('content/catalog.json'));const out={};for(const t of catalog.topics){const a=JSON.parse(fs.readFileSync('content/page-articles/'+t.slug+'.json'));out[t.slug]={core:renderCoreGuide(t.slug),articles:a.map(x=>renderDevelopedPage(x,{topic:t,parent:'/',workHtml:'',related:'',format:()=>'',kind:'audit'}).match(/<article[^>]*>([\\s\\S]*?)<\\/article>/)[1])};}console.log(JSON.stringify(out));"""
originals=json.loads(subprocess.check_output([os.environ.get('NODE_BINARY','node'),'--input-type=module','-e',node],text=True));allpaths=[];articlecount=0
for topic in catalog['topics']:
 slug=topic['slug'];text=(pub/'library'/slug/'index.html').read_text();s=Scan();s.feed(text);articles=json.loads((root/'content/page-articles'/f'{slug}.json').read_text())
 assert len(s.ids)==len(set(s.ids)) and all(x in s.ids for x in s.labels),slug
 assert s.cases==[slug+'/'+str(n) for n in range(1,41)] and len(s.roots)==len(s.json)==41,slug
 assert len({x['data-storage-path'] for x in s.roots})==41 and s.roots[0]['data-storage-path']==f'/library/{slug}/'
 assert '<form' not in text and 'id="workspace-data"' not in text
 assert all(a['caseFacts']==dossiers[slug]['facts'] for a in articles)
 for a,data,workspace in zip(articles,s.json[1:],s.roots[1:]):
  n=a['number'];expected=f'/workbooks/{slug}/example-{n:02d}/';assert data['sample']==a['sample'] and data['title']==a['title'] and data['example']==n and data['slug']==slug
  assert workspace['data-storage-path']==expected;allpaths.append(expected)
  assert not (pub/expected.lstrip('/')).exists()
 for href in s.links:
  if href.startswith('#'):assert href[1:] in s.ids,(slug,href)
 embedded=re.findall(r'<article data-developed-case="[^\"]+">([\s\S]*?)</article>',text);assert len(embedded)==40
 for before,after in zip(originals[slug]['articles'],embedded):
  split='<section><h2>Track the evidence and next request</h2>';assert visible(before.split(split)[0])==visible(after.split(split)[0]),slug;articlecount+=1
 if originals[slug]['core']:assert originals[slug]['core'] in text,slug
assert len(allpaths)==len(set(allpaths))==articlecount==1600
assert not list((pub/'workbooks').rglob('index.html'))
urls=[e.text for e in ET.parse(pub/'sitemap.xml').findall('.//{*}loc')];assert len(urls)==67 and not any('/workbooks/' in u for u in urls)
for slug in cohort['slugs']:
 entry=next(e for e in ET.parse(pub/'sitemap.xml').getroot() if e.find('{*}loc').text.endswith('/library/'+slug+'/'));assert entry.find('{*}lastmod').text==cohort['reviewed']
print(json.dumps({'topics':40,'caseArticlesPreserved':articlecount,'isolatedWorksheets':1640,'legacySavedPaths':1600,'parentSavedPaths':40,'fictionalFactPackets':40,'newlyCollectedTopics':38,'duplicateIDs':0,'unmatchedLabels':0,'canonicalOwners':67,'passed':True}))
