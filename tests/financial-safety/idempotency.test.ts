import assert from "node:assert/strict";
import test from "node:test";
import { createIdempotencyKey, serializeIdempotencyKey } from "../../src/domain/financial-safety/idempotency";

test("idempotency keys normalize and serialize deterministically", () => {
  const value = createIdempotencyKey(" settlement ", " payment-123 ");
  assert.deepEqual(value, { scope: "settlement", key: "payment-123" });
  assert.equal(serializeIdempotencyKey(value), "settlement:payment-123");
});

test("idempotency keys reject blank values", () => {
  assert.throws(() => createIdempotencyKey("", "abc"), TypeError);
  assert.throws(() => createIdempotencyKey("settlement", " "), TypeError);
});
