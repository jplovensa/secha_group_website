import test from "node:test";
import assert from "node:assert/strict";
import { calculateLoan, fundingPlan } from "../assets/loan-model.js";
test("flat example calculates installments, interest and upfront fees separately", () => {
  const result = calculateLoan({
    principal: 20000000,
    months: 12,
    monthlyRate: 1,
    fees: 100000,
    method: "flat",
  });
  assert.ok(Math.abs(result.payment - 1866666.6666666667) < 0.01);
  assert.equal(result.interest, 2400000);
  assert.equal(result.total, 22500000);
});
test("zero-interest and own-funded plans are valid", () => {
  assert.equal(
    calculateLoan({ principal: 12000000, months: 12, monthlyRate: 0 }).payment,
    1000000,
  );
  assert.equal(
    calculateLoan({ principal: 0, months: 12, monthlyRate: 1 }).total,
    0,
  );
  assert.equal(fundingPlan(30000000, 30000000, 0).gap, 0);
});
test("reducing-balance interest is less than flat interest at the same monthly rate", () => {
  const params = { principal: 20000000, months: 12, monthlyRate: 1 };
  assert.ok(
    calculateLoan({ ...params, method: "reducing" }).interest <
      calculateLoan(params).interest,
  );
});
test("funding gaps and surplus are visible and invalid inputs fail", () => {
  assert.equal(fundingPlan(50000000, 10000000, 30000000).gap, 10000000);
  assert.equal(fundingPlan(10000000, 10000000, 5000000).surplus, 5000000);
  assert.throws(
    () => calculateLoan({ principal: 1, months: 0, monthlyRate: 1 }),
    RangeError,
  );
  assert.throws(
    () => calculateLoan({ principal: 1, months: 12, monthlyRate: NaN }),
    RangeError,
  );
});
