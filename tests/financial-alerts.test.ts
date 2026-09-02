import assert from "node:assert/strict";
import test from "node:test";
import { lowStockAlert, payableAlerts, prioritizeFinancialAlerts, receivableAlerts, reconciliationAlert } from "../src/domain/accounting/financial-alerts";
import type { Receivable } from "../src/domain/accounting/receivable";
import type { Payable } from "../src/domain/accounting/payable";
import type { CatalogItem } from "../src/domain/accounting/inventory";
import type { Money } from "../src/domain/financial-safety/money";

const m = (minorUnits: bigint): Money => ({ currency: "IRR", minorUnits });
const asOf = new Date("2026-09-01T00:00:00Z");

const receivable: Receivable = { id: "ar1", workspaceId: "ws", customerId: "c1", issuedAt: new Date("2026-07-01"), dueAt: new Date("2026-08-01"), originalAmount: m(1000n), outstandingAmount: m(500n), status: "OVERDUE" };
const payable: Payable = { id: "ap1", workspaceId: "ws", supplierId: "s1", issuedAt: new Date("2026-08-01"), dueAt: new Date("2026-09-05"), originalAmount: m(800n), outstandingAmount: m(800n), status: "OPEN" };
const item: CatalogItem = { id: "i1", workspaceId: "ws", type: "STOCK_ITEM", name: "کالا", unit: "عدد", active: true, lowStockThreshold: 5n };

test("overdue receivable becomes critical after 30 days", () => {
  const alerts = receivableAlerts([receivable], asOf);
  assert.equal(alerts[0]?.kind, "RECEIVABLE_OVERDUE");
  assert.equal(alerts[0]?.severity, "CRITICAL");
});

test("payable within seven days produces due alert", () => {
  const alerts = payableAlerts([payable], asOf);
  assert.equal(alerts[0]?.kind, "PAYABLE_DUE");
  assert.equal(alerts[0]?.severity, "INFO");
});

test("low stock is warning and zero stock is critical", () => {
  assert.equal(lowStockAlert({ item, workspaceId: "ws", quantityMinorUnits: 4n })?.severity, "WARNING");
  assert.equal(lowStockAlert({ item, workspaceId: "ws", quantityMinorUnits: 0n })?.severity, "CRITICAL");
});

test("weak reconciliation confidence creates alert", () => {
  assert.equal(reconciliationAlert({ workspaceId: "ws", transactionId: "tx1", confidence: 0.3 })?.severity, "CRITICAL");
  assert.equal(reconciliationAlert({ workspaceId: "ws", transactionId: "tx2", confidence: 0.9 }), null);
});

test("alerts are prioritized by severity", () => {
  const alerts = prioritizeFinancialAlerts([
    ...payableAlerts([payable], asOf),
    ...receivableAlerts([receivable], asOf),
  ]);
  assert.equal(alerts[0]?.severity, "CRITICAL");
});
