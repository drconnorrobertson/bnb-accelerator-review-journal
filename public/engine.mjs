export function evaluate(node,values){
 if(typeof node==='number')return node;
 if(typeof node==='string'){if(!Number.isFinite(values[node]))throw new Error('Missing or invalid input: '+node);return values[node]}
 if(!Array.isArray(node))throw new Error('Invalid formula');
 const [op,...args]=node;const a=args.map(n=>evaluate(n,values));
 switch(op){case 'add':return a[0]+a[1];case 'sub':return a[0]-a[1];case 'mul':return a[0]*a[1];case 'div':if(a[1]===0)throw new Error('A zero denominator has no finite result.');return a[0]/a[1];case 'pow':return a[0]**a[1];case 'ceil':return Math.ceil(a[0]);case 'payment':{const [loan,annual,years]=a,r=annual/1200,n=years*12;return r===0?loan/n:loan*r/(-Math.expm1(-n*Math.log1p(r)))}default:throw new Error('Unsupported formula operation')}
}
export function calculate(model,values){
 for(const field of model.fields){const v=values[field.id];if(!Number.isFinite(v)||v<field.min||v>field.max)throw new Error(`${field.label} must be between ${field.min} and ${field.max}.`)}
 if(model.slug==='booked-night-occupancy'&&values.nights>values.available)throw new Error('Booked nights cannot exceed available nights.');
 if(model.slug==='amenity-payback-illustration'&&values.extra<=values.running)throw new Error('No finite positive payback: incremental contribution must be positive.');
 const answer=evaluate(model.expression,values);if(!Number.isFinite(answer))throw new Error('No finite result for these inputs.');return answer;
}
export function format(value,unit){if(!Number.isFinite(value))return 'Not applicable';if(unit==='USD')return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);const n=new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(value);if(unit.startsWith('USD'))return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value)+' '+unit.replace('USD ','');return n+(unit==='percent'?'%':unit==='multiple'?'×':' '+unit)}
export function auditSummary(statuses){const counts={reviewed:0,pending:0,missing:0,conflict:0};for(const s of statuses){if(!(s in counts))throw new Error('Unsupported evidence status');counts[s]++}const total=statuses.length;const complete=total>0&&counts.reviewed===total;return {counts,total,complete,message:counts.conflict?'Conflicting records need reconciliation.':counts.missing?'Missing evidence remains open.':counts.pending?'Review is still pending.':total?'All listed records marked reviewed; this is not verification.':'No records listed.'}}
