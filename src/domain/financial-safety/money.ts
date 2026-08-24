export type Currency = "IRR";

export interface Money {
  currency: Currency;
  minorUnits: bigint;
}

export function irr(rials: bigint | number | string): Money {
  const value = BigInt(rials);
  if (value < BigInt(0)) throw new RangeError("Money cannot be negative.");
  return { currency: "IRR", minorUnits: value };
}

export function addMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  return { currency: left.currency, minorUnits: left.minorUnits + right.minorUnits };
}

export function subtractMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  if (right.minorUnits > left.minorUnits) {
    throw new RangeError("Money subtraction cannot produce a negative value.");
  }
  return { currency: left.currency, minorUnits: left.minorUnits - right.minorUnits };
}

export function equalMoney(left: Money, right: Money): boolean {
  return left.currency === right.currency && left.minorUnits === right.minorUnits;
}

function assertSameCurrency(left: Money, right: Money): void {
  if (left.currency !== right.currency) throw new TypeError("Money currency mismatch.");
}
