from pathlib import Path
import argparse,json,re,math,hashlib,datetime,subprocess,itertools
P=Path.cwd();cfg=json.loads((P/'content/site.json').read_text());catalog=json.loads((P/'content/catalog.json').read_text());kind=cfg['kind'];bytopic={t['slug']:t for t in catalog['topics']}
ap=argparse.ArgumentParser();ap.add_argument('--approve',action='store_true');args=ap.parse_args()
def math_eval(node,v):
 if isinstance(node,(int,float)):return node
 if isinstance(node,str):return v[node]
 op,*rest=node;a=[math_eval(x,v) for x in rest]
 if op=='add':return a[0]+a[1]
 if op=='sub':return a[0]-a[1]
 if op=='mul':return a[0]*a[1]
 if op=='div':return a[0]/a[1]
 if op=='pow':return a[0]**a[1]
 if op=='ceil':return math.ceil(a[0])
 if op=='payment':
  principal,rate,years=a;r=rate/1200;n=years*12
  return principal/n if not r else principal*r*(1+r)**n/((1+r)**n-1)
 raise ValueError(op)
def close(a,b):assert abs(a-b)<max(1e-7,abs(b)*1e-8),(a,b)
def narrative(a):return ' '.join([a['question'],a['answer'],*a['analysis'],*a['steps'],*a['changeOfAnswer'],a['requestText'],a['commonMistake'],*a.get('caseFacts',[])])
def shingles(text):
 words=re.findall(r"[\w'-]+",text.lower());return {hashlib.blake2s(' '.join(words[i:i+5]).encode(),digest_size=8).digest() for i in range(len(words)-4)}
questions=set();answers=set();titles=set();count=assertions=0;ledger=[];worst=[];wordcounts=[];pairchecks=0
for file in sorted((P/'content/page-articles').glob('*.json')):
 topic=bytopic[file.stem];articles=json.loads(file.read_text());assert len(articles)==40;family=[]
 for j,a in enumerate(articles,1):
  assert a['number']==j
  for key,bucket in [('question',questions),('answer',answers),('title',titles)]:assert a[key] not in bucket,(file,j,'duplicate '+key);bucket.add(a[key])
  assert len(a['analysis'])>=3 and len(a['steps'])>=5 and len(a['changeOfAnswer'])>=2
  text=narrative(a);words=len(re.findall(r'\w+',text));assert words>=350,(file,j,'insufficient developed analysis',words);wordcounts.append(words)
  assert len(a['answer'].split())>=45,(file,j,'answer too brief')
  assert 'Hypothetical' not in a['title'],(file,j,'title should identify the task rather than only the exercise')
  if kind=='calculator':
   assert set(a['values'])=={f['id'] for f in topic['fields']}
   for f in topic['fields']:assert f['min']<=a['values'][f['id']]<=f['max']
   expected=math_eval(topic['expression'],a['values']);close(expected,a['expectedAnswer']);assertions+=1
   assert len(a['trace'])>=1
   close(a['trace'][-1]['result'],expected);assertions+=1
   ref=math_eval(topic['expression'],a['reference']['values']);close(ref,a['reference']['answer']);assertions+=1
   assert len(a['sensitivity'])==2*len(topic['fields'])
   for alt in a['sensitivity']:
    v={**a['values'],alt['field']:alt['value']}
    try:
     calculated=math_eval(topic['expression'],v)
     if topic['slug']=='booked-night-occupancy' and v['nights']>v['available']:raise ValueError('unavailable nights')
     if topic['slug']=='amenity-payback-illustration' and v['extra']<=v['running']:raise ValueError('nonpositive contribution')
     assert alt['valid'];close(calculated,alt['answer'])
    except (ZeroDivisionError,ValueError):assert not alt['valid'] and alt.get('reason')
    assertions+=1
   assert a['editorialChecks']['workedArithmetic'] and a['editorialChecks']['oneInputSensitivity']
  else:
   assert len(a['caseFacts'])==3 and len(a['packet']) in [3,4]
   assert a['comparison']['summary']!=a['comparison']['source']
   assert a['comparison']['subjectField'] in a['answer']
   assert a['resolution'] in a['answer']
   assert a['deliverable'] in a['requestText']
   assert len({r['name'] for r in a['packet']})==len(a['packet'])
   assert [r['status'] for r in a['packet']]==[r['status'] for r in a['sample']['records']]
   for r in a['packet']:
    assert r['status'] in ['reviewed','pending','missing','conflict']
    if r['status']=='missing':assert r['excerpt'] is None
    else:assert r['excerpt'] in a['caseFacts']
   assert a['editorialChecks']['workedRecordComparison'] and not a['editorialChecks']['realCustomerClaim']
   assertions+=8
  assert a['editorialChecks']['hypotheticalDisclosed']
  assert not re.search(r'\$\{[A-Za-z]|\bNaN\b|\bInfinity\b',text)
  family.append((j,shingles(text)));count+=1
  ledger.append(dict(topic=file.stem,number=j,wordCount=words,question=a['question'],checks='passed'))
 for (j,x),(k,y) in itertools.combinations(family,2):
  score=len(x&y)/len(x|y);pairchecks+=1
  if score>.75:raise AssertionError((file.name,j,k,'overlapping developed narratives',round(score,4)))
  if not worst or score>worst[-1]['similarity']:
   worst.append(dict(topic=file.stem,first=j,second=k,similarity=round(score,4)));worst=sorted(worst,key=lambda x:x['similarity'],reverse=True)[:10]
assert count==1600 and len(questions)==1600 and len(titles)==1600
report=dict(status='passed',project=cfg['project'],pages=count,uniqueQuestions=len(questions),uniqueAnswers=len(answers),uniqueTitles=len(titles),minimumNarrativeWords=min(wordcounts),maximumNarrativeWords=max(wordcounts),meanNarrativeWords=round(sum(wordcounts)/len(wordcounts)),independentArithmeticOrEvidenceAssertions=assertions,withinTopicSimilarityComparisons=pairchecks,maximumFiveWordShingleJaccard=worst[0]['similarity'],highestOverlapPairs=worst,reviewedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),method='Automated structured-content, independent arithmetic/evidence and similarity checks; no claim of independent professional verification.')
(P/'article-review-report.json').write_text(json.dumps(report,indent=2));(P/'article-review-ledger.json').write_text(json.dumps(ledger,indent=2));print(json.dumps(report))
if args.approve:subprocess.run(['node','scripts/approve-articles.mjs'],check=True)
