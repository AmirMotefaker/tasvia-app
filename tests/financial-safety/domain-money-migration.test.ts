import assert from "node:assert/strict";
import test from "node:test";

import { irr } from "../../src/domain/financial-safety/money";
import { analyzeCashflow } from "../../src/domain/financial-intelligence/cashflow-analyzer";
import { detectAmountAnomaly } from "../../src/domain/financial-intelligence/anomaly-detector";
import type { Invoice } from "../../src/domain/invoice";
import type { Payment } from "../../src/domain/payment";
import type { SettlementRequest } from "../../src/domain/settlement/settlement-request";

test("financial domain entities accept exact IRR Money values", () => {
  const amount = irr("100000000");

  const invoice: Invoice = {
    id: "invoice-1",
    supplierId: "supplier-1",
    invoiceNumber: "INV-1",
    amount,
    status: "PENDING",
    createdAt: new Date("2026-08-24T00:00:00Z"),
  };

  const payment: Payment = {
    id: "payment-1",
    invoiceId: invoice.id,
    amount,
    method: "CARD_TRANSFER",
    status: "PENDING",
    createdAt: new Date("2026-08-24T00:00:00Z"),
  };

  const settlement: SettlementRequest = {
    id: "settlement-1",
    businessId: "business-1",
    supplierId: invoice.supplierId,
    invoiceId: invoice.id,
    paymentRequestId: "request-1",
    amount,
    requestedAt: new Date("2026-08-24T00:00:00Z"),
  };

  assert.equal(invoice.amount.minorUnits, BigInt("100000000"));
  assert.equal(payment.amount.minorUnits, invoice.amount.minorUnits);
  assert.equal(settlement.amount.minorUnits, payment.amount.minorUnits);
});

test("cashflow arithmetic remains exact and supports negative net flow", () => {
  const snapshot = analyzeCashflow(
    [irr("100000000"), irr("50000000")],
    [irr("175000000")],
  );

  assert.equal(snapshot.inflow.minorUnits, BigInt("150000000"));
  assert.equal(snapshot.outflow.minorUnits, BigInt("175000000"));
  assert.equal(snapshot.netCashflowMinorUnits, BigInt("-25000000"));
});

test("anomaly detection operates on Money values", () => {
  const normal = detectAmountAnomaly(
    irr("105000000"),
    [irr("100000000"), irr("100000000")],
  );

  const anomalous = detectAmountAnomaly(
    irr("300000000"),
    [irr("100000000"), irr("100000000")],
  );

  assert.equal(normal.detected, false);
  assert.equal(anomalous.detected, true);
  assert.equal(anomalous.severity, "HIGH");
});
