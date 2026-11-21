import assert from 'node:assert/strict';
import {calculateIllustration} from './core-guides.mjs';

const inputs = {principal:200000, annualRatePercent:6, amortizationMonths:360, paidMonths:60};
const actual = calculateIllustration(inputs);
// Reference values independently calculated with 40-digit decimal arithmetic.
assert.ok(Math.abs(actual.payment - 1199.101050305504789) < 1e-8);
assert.ok(Math.abs(actual.balance - 186108.7136456391203) < 1e-7);
assert.ok(Math.abs(actual.principalRepaid - 13891.2863543608797) < 1e-7);
assert.ok(Math.abs(actual.totalPaid - 71946.06301833028735) < 1e-7);
const zeroInterest = calculateIllustration({principal:120000, annualRatePercent:0, amortizationMonths:120, paidMonths:60});
assert.equal(zeroInterest.payment, 1000);
assert.equal(zeroInterest.balance, 60000);
assert.equal(calculateIllustration({...inputs,paidMonths:0}).balance, 200000);
assert.equal(calculateIllustration({...inputs,paidMonths:360}).balance, 0);
assert.equal(calculateIllustration({...inputs,principal:0}).payment, 0);
for (const invalid of [{principal:NaN},{principal:-1},{annualRatePercent:-1},{annualRatePercent:Infinity},{amortizationMonths:0},{amortizationMonths:1201},{paidMonths:361},{paidMonths:.5}]) {
  assert.throws(() => calculateIllustration({...inputs,...invalid}), /Invalid amortization/);
}
console.log('17 independent reference, zero-rate, boundary and invalid-input checks passed.');
