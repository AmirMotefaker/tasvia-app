import assert from "node:assert/strict";
import test from "node:test";

import { irr } from "../../src/domain/financial-safety/money";
import { calculateBalance } from "../../src/domain/ledger/ledger-engine";

test("ledger calculates exact bigint balance", () => {
  const balance = calculateBalance([
    {
      id: "1",
      accountId: "cash",
      transactionId: "tx1",
      direction: "DEBIT",
      amount: irr("100000"),
      createdAt: new Date(),
    },
    {
      id: "2",
      accountId: "cash",
      transactionId: "tx2",
      direction: "CREDIT",
      amount: irr("25000"),
      createdAt: new Date(),
    },
  ]);

  assert.equal(balance.minorUnits, BigInt("75000"));
});
