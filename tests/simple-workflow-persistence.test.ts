import assert from "node:assert/strict";
import test from "node:test";
import { assertFinancialWriteEnvironment } from "../src/application/accounting/simple-workflow-persistence";

test("financial writes are disabled by default", () => {
  assert.throws(() => assertFinancialWriteEnvironment({ NODE_ENV: "test" } as NodeJS.ProcessEnv), /FINANCIAL_WRITES_DISABLED/);
});

test("non-production financial writes require explicit enable flag", () => {
  assert.doesNotThrow(() => assertFinancialWriteEnvironment({
    NODE_ENV: "test",
    FINANCIAL_WRITES_ENABLED: "true",
  } as NodeJS.ProcessEnv));
});

test("production financial writes require separate production approval", () => {
  assert.throws(() => assertFinancialWriteEnvironment({
    NODE_ENV: "production",
    FINANCIAL_WRITES_ENABLED: "true",
  } as NodeJS.ProcessEnv), /PRODUCTION_FINANCIAL_WRITES_NOT_APPROVED/);

  assert.doesNotThrow(() => assertFinancialWriteEnvironment({
    NODE_ENV: "production",
    FINANCIAL_WRITES_ENABLED: "true",
    FINANCIAL_WRITES_PRODUCTION_APPROVED: "true",
  } as NodeJS.ProcessEnv));
});

test("Vercel production is treated as production even if NODE_ENV is not", () => {
  assert.throws(() => assertFinancialWriteEnvironment({
    NODE_ENV: "test",
    VERCEL_ENV: "production",
    FINANCIAL_WRITES_ENABLED: "true",
  } as NodeJS.ProcessEnv), /PRODUCTION_FINANCIAL_WRITES_NOT_APPROVED/);
});
