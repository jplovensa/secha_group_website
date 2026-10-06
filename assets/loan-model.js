/** Illustrative planning math. Rates/fees are user assumptions, never bank quotes. */
export function calculateLoan({
  principal,
  months,
  monthlyRate,
  fees = 0,
  method = "flat",
}) {
  if (
    ![principal, months, monthlyRate, fees].every(Number.isFinite) ||
    principal < 0 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 120 ||
    monthlyRate < 0 ||
    monthlyRate > 100 ||
    fees < 0 ||
    !["flat", "reducing"].includes(method)
  )
    throw new RangeError("Invalid loan assumptions");
  let payment = principal / months;
  if (monthlyRate > 0 && principal > 0) {
    const rate = monthlyRate / 100;
    payment =
      method === "flat"
        ? principal / months + principal * rate
        : (principal * rate) / (1 - (1 + rate) ** -months);
  }
  const interest = Math.max(0, payment * months - principal);
  return { payment, interest, total: principal + interest + fees, fees };
}
export function fundingPlan(budget, ownFunds, principal) {
  if (
    ![budget, ownFunds, principal].every(Number.isFinite) ||
    budget <= 0 ||
    ownFunds < 0 ||
    principal < 0
  )
    throw new RangeError("Invalid budget");
  const funded = ownFunds + principal;
  return {
    funded,
    gap: Math.max(0, budget - funded),
    surplus: Math.max(0, funded - budget),
    coverage: Math.min(funded / budget, 1),
  };
}
