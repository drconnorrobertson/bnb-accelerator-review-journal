from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from collections import deque
import json,xml.etree.ElementTree as ET,hashlib,re
root=Path.cwd();pub=root/'public';cfg=json.loads((root/'content/site.json').read_text());report=json.loads((root/'build-report.json').read_text())
class Scan(HTMLParser):
 def __init__(self):super().__init__();self.h1=0;self.links=[];self.assets=[];self.canonical=[];self.robots='';self.description='';self.title='';self.in_title=False;self.in_main=False;self.main=[];self.script=None;self.script_parts=[];self.schemas=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='h1':self.h1+=1
  if t=='title':self.in_title=True
  if t=='main':self.in_main=True
  if t=='a' and 'href'in a:self.links.append(a['href'])
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
  if t=='link' and a.get('rel') in ['stylesheet','icon']:self.assets.append(a['href'])
  if t=='script' and 'src'in a:self.assets.append(a['src'])
  if t=='meta' and a.get('name')=='robots':self.robots=a['content']
  if t=='meta' and a.get('name')=='description':self.description=a['content']
  if t=='script' and a.get('type') in ['application/json','application/ld+json']:self.script=a['type'];self.script_parts=[]
 def handle_endtag(self,t):
  if t=='title':self.in_title=False
  if t=='main':self.in_main=False
  if t=='script' and self.script:
   data=json.loads(''.join(self.script_parts));self.schemas.append(data);self.script=None
 def handle_data(self,s):
  if self.in_title:self.title+=s
  if self.in_main and not self.script:self.main.append(s)
  if self.script:self.script_parts.append(s)
def file_for(route):
 p=pub/unquote(route).lstrip('/');return p/'index.html' if route.endswith('/') else p
pages={};titles=set();digests=set();issues=[];workspace_count=core_count=0
for f in pub.rglob('*.html'):
 if f.name=='404.html':continue
 route='/'+str(f.parent.relative_to(pub))+'/' if f.parent!=pub else '/'
 s=Scan();text=f.read_text();s.feed(text)
 assert s.h1==1,(route,'H1',s.h1)
 assert len(s.canonical)==1,(route,'canonical count')
 assert s.canonical[0]==cfg['origin']+route,(route,s.canonical)
 assert s.description,(route,'description')
 assert s.title not in titles,(route,'duplicate title');titles.add(s.title)
 digest=hashlib.sha256(' '.join(s.main).encode()).hexdigest();assert digest not in digests,(route,'duplicate main content');digests.add(digest)
 assert not re.search(r'\$\{[a-zA-Z]|\bNaN\b|\bInfinity\b',text),(route,'unrendered or invalid value')
 if route.startswith('/workbooks/'):
  assert s.robots=='index,follow',(route,'developed case must be index eligible');workspace_count+=1
  assert 'Hypothetical worked case.' in text,(route,'example disclosure');assert 'data-developed-case=' in text,(route,'missing substantive case article')
 else:assert 'noindex'not in s.robots,(route,'core noindex');core_count+=1
 assert 'My BnB Accelerator, LLC' in text,(route,'publisher')
 for url in s.links+s.assets:
  path=urlsplit(url).path
  if url.startswith('/'):
   assert file_for(path).exists(),(route,'broken internal path',url)
  elif url.startswith('http'):
   parsed=urlsplit(url);assert parsed.scheme=='https',(route,'non-https link')
 pages[route]=s
assert workspace_count==1600,workspace_count
assert core_count==report['corePages'],(core_count,report['corePages'])
assert len(pages)==report['totalPages'],(len(pages),report['totalPages'])
sitemap={urlsplit(x.text).path for x in ET.parse(pub/'sitemap.xml').findall('.//{*}loc')}
assert len(sitemap)==len(pages)
assert sitemap==set(pages)
visited={'/'};q=deque(['/'])
while q:
 r=q.popleft()
 for url in pages[r].links:
  route=urlsplit(url).path
  if url.startswith('/') and route in pages and route not in visited:visited.add(route);q.append(route)
assert visited==set(pages),('orphan routes',list(set(pages)-visited)[:5])
assert not list(pub.rglob('*.py'));assert not list(pub.rglob('site.json'));assert not list(pub.rglob('catalog.json'));assert not list(pub.rglob('build-report.json'))
summary=dict(project=cfg['project'],totalPages=len(pages),corePages=core_count,developedCasePages=workspace_count,indexEligiblePages=len(pages),noindexCasePages=0,sitemapEntries=len(sitemap),reachablePages=len(visited),uniqueTitles=len(titles),uniqueMainContent=len(digests),internalLinks='passed',structuredJSON='passed',sourceBoundary='passed')
(root/'validation-report.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
