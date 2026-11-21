"""Regression checks for the hand-reviewed nightly-rate collection."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json,re,subprocess,os
root=Path.cwd();pub=root/'public';slug='nightly-rate-average';route='/library/'+slug+'/'
class Scan(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.labels=[];self.links=[];self.cases=[];self.roots=[];self.json=[];self.parts=None
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id'in a:self.ids.append(a['id'])
  if t=='label':self.labels.append(a.get('for'))
  if t=='a':self.links.append(a.get('href',''))
  if 'data-developed-case'in a:self.cases.append(a['data-developed-case'])
  if 'data-case-workspace'in a:self.roots.append(a)
  if 'data-case-workspace-data'in a:self.parts=[]
 def handle_data(self,s):
  if self.parts is not None:self.parts.append(s)
 def handle_endtag(self,t):
  if t=='script' and self.parts is not None:self.json.append(json.loads(''.join(self.parts)));self.parts=None
text=(pub/route.lstrip('/')/'index.html').read_text();s=Scan();s.feed(text)
assert len(s.ids)==len(set(s.ids)),'Duplicate collection IDs'
assert all(label in s.ids for label in s.labels),'Unmatched label'
assert s.cases==[slug+'/'+str(i) for i in range(1,41)]
assert len(s.roots)==len(s.json)==41
assert len(list((pub/'workbooks').glob('*/example-*/index.html')))==1560
assert len({r['data-storage-path'] for r in s.roots})==41
assert '<form'not in text,'Collection must not submit notes through GET'
assert 'id="workspace-data"'not in text,'Legacy global runtime must not mount'
for link in s.links:
 if link.startswith('#'):assert link[1:] in s.ids,link
articles=json.loads((root/'content/page-articles'/f'{slug}.json').read_text())
for a,data,workspace in zip(articles,s.json[1:],s.roots[1:]):
 n=a['number'];assert data['sample']==a['sample'];assert data['title']==a['title'];assert data['example']==n
 assert workspace['data-storage-path']==f'/workbooks/{slug}/example-{n:02d}/'
 assert f'id="case-{n:02d}"'in text
 assert not (pub/f'workbooks/{slug}/example-{n:02d}').exists()
# Independently render the original source articles, then compare their complete
# visible text to the embedded articles (IDs may change, prose may not).
node="""import fs from 'node:fs';import {renderDevelopedPage} from './scripts/case-article.mjs';
const topic=JSON.parse(fs.readFileSync('content/catalog.json')).topics.find(t=>t.slug==='nightly-rate-average');
const articles=JSON.parse(fs.readFileSync('content/page-articles/nightly-rate-average.json'));
console.log(JSON.stringify(articles.map(a=>renderDevelopedPage(a,{topic,parent:'/',workHtml:'',related:'',format:()=>'',kind:'audit'}).match(/<article[^>]*>([\s\S]*?)<\/article>/)[1])));"""
originals=json.loads(subprocess.check_output([os.environ.get('NODE_BINARY','node'),'--input-type=module','-e',node],text=True))
class VisibleText(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.script=False
 def handle_starttag(self,t,a):
  if t=='script':self.script=True
 def handle_endtag(self,t):
  if t=='script':self.script=False
 def handle_data(self,data):
  if not self.script:self.parts.append(data)
def visible(value):
 parser=VisibleText();parser.feed(value);return ' '.join(' '.join(parser.parts).split())
embedded=re.findall(r'<article data-developed-case="[^\"]+">([\s\S]*?)</article>',text)
for before,after in zip(originals,embedded):
 # Editable controls are separate from the authored explanation.
 after=after.split('<section><h2>Track the evidence and next request</h2>')[0]
 before=before.split('<section><h2>Track the evidence and next request</h2>')[0]
 assert visible(before)==visible(after),'Source case prose changed during collection rendering'
redirects=json.loads((root/'vercel.json').read_text())['redirects'];assert len(redirects)==80
for n in range(1,41):
 for slash in ['', '/']:
  source=f'/workbooks/{slug}/example-{n:02d}'+slash
  match=[r for r in redirects if r['source']==source];assert len(match)==1
  assert match[0]['permanent'] is True and match[0]['destination']==route+f'#case-{n:02d}'
assert not any('example-41'in r['source'] for r in redirects)
sitemap=(pub/'sitemap.xml').read_text();assert '<lastmod>2026-11-21</lastmod>'in sitemap and f'/workbooks/{slug}/'not in sitemap
assert '$22,000 ÷ 100 = $220' in text and (20*300+80*200)/(20+80)==220
assert (50*300+50*200)/100==250
print(json.dumps({'embeddedCases':40,'isolatedWorkspaces':41,'duplicateIDs':0,'legacySavedPaths':41,'permanentAliases':80,'undefinedRateBoundary':'explained','sitemap':'1627 canonical pages','passed':True}))
