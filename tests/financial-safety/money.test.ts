import assert from "node:assert/strict";
import test from "node:test";
import { addMoney, equalMoney, irr, subtractMoney } from "../../src/domain/financial-safety/money";

test("IRR money uses bigint integer units", () => {
  assert.equal(addMoney(irr("100000000"), irr("50000000")).minorUnits, BigInt("150000000"));
  assert.equal(subtractMoney(irr("100000000"), irr("50000000")).minorUnits, BigInt("50000000"));
  assert.equal(equalMoney(irr(100), irr("100")), true);
});

test("money rejects invalid negative operations", () => {
  assert.throws(() => irr(-1), RangeError);
  assert.throws(() => subtractMoney(irr(10), irr(11)), RangeError);
});
