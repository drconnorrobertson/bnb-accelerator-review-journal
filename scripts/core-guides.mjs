import fs from 'node:fs';

const guides = JSON.parse(fs.readFileSync(new URL('../content/core-guides.json', import.meta.url), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const paragraph = text => `<p>${escape(text)}</p>`;
const money = value => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);

export function calculateIllustration({principal, annualRatePercent, amortizationMonths, paidMonths}) {
  if (!Number.isFinite(principal) || principal < 0 || !Number.isFinite(annualRatePercent) || annualRatePercent < 0 || annualRatePercent > 100 || !Number.isInteger(amortizationMonths) || amortizationMonths < 1 || amortizationMonths > 1200 || !Number.isInteger(paidMonths) || paidMonths < 0 || paidMonths > amortizationMonths) {
    throw new Error('Invalid amortization illustration inputs.');
  }
  const rate = annualRatePercent / 1200;
  const payment = rate === 0 ? principal / amortizationMonths : principal * rate / (-Math.expm1(-amortizationMonths * Math.log1p(rate)));
  let balance = principal;
  for (let month = 0; month < paidMonths; month++) balance = balance * (1 + rate) - payment;
  if (paidMonths === amortizationMonths && Math.abs(balance) < 1e-7 * Math.max(1, principal)) balance = 0;
  const totalPaid = payment * paidMonths;
  if (![payment, balance, totalPaid].every(Number.isFinite)) throw new Error('Illustration has no finite result.');
  return {payment, balance, totalPaid, principalRepaid: principal - balance};
}

function renderIllustration(inputs) {
  const result = calculateIllustration(inputs);
  const rows = [
    ['Original principal', inputs.principal],
    ['Monthly principal and interest', result.payment],
    [`${inputs.paidMonths} regular payments combined`, result.totalPaid],
    [`Principal repaid through month ${inputs.paidMonths}`, result.principalRepaid],
    [`Principal remaining after month ${inputs.paidMonths}`, result.balance]
  ];
  return `<table style="width:100%;border-collapse:collapse"><caption style="text-align:left">Hypothetical amortization and remaining principal</caption><thead><tr><th scope="col" style="text-align:left;padding:.4rem .75rem .4rem 0">Measure</th><th scope="col" style="text-align:right">Amount</th></tr></thead><tbody>${rows.map(([label, value]) => `<tr><th scope="row" style="text-align:left;padding:.4rem .75rem .4rem 0">${escape(label)}</th><td style="white-space:nowrap;text-align:right">${money(value)}</td></tr>`).join('')}</tbody></table>`;
}

export function renderCoreGuide(slug) {
  const guide = guides[slug];
  if (!guide) return '';
  return `<section class="core-guide"><h2>${escape(guide.heading)}</h2>${paragraph(guide.intro)}${guide.sections.map(section => `<h3>${escape(section.heading)}</h3>${section.paragraphs.map(paragraph).join('')}${section.illustration ? renderIllustration(section.illustration) : ''}${section.items ? `<ul>${section.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>` : ''}`).join('')}<h3>Sources and scope</h3>${guide.sources.map(source => {
    if (!/^https:\/\//.test(source.url)) throw new Error('Core guide source must use HTTPS.');
    return `<p><a href="${escape(source.url)}">${escape(source.label)}</a>. ${escape(source.note)}</p>`;
  }).join('')}</section>`;
}
