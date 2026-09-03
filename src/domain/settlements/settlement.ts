export function nextSettlementStatus(
  outstandingBefore: bigint,
  amount: bigint,
): {
  outstandingAfter: bigint;
  status: "PARTIALLY_PAID" | "PAID";
} {
  if (outstandingBefore <= 0n) throw new Error("BALANCE_ALREADY_SETTLED");
  if (amount <= 0n) throw new Error("SETTLEMENT_AMOUNT_MUST_BE_POSITIVE");
  if (amount > outstandingBefore) throw new Error("SETTLEMENT_EXCEEDS_OUTSTANDING");

  const outstandingAfter = outstandingBefore - amount;

  return {
    outstandingAfter,
    status: outstandingAfter === 0n ? "PAID" : "PARTIALLY_PAID",
  };
}
