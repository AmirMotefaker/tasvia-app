import assert from "node:assert/strict";
import test from "node:test";
import { issuePurchaseInvoice } from "../src/application/accounting/issue-purchase-invoice";

const item = { id: "item-1", workspaceId: "ws-1", type: "STOCK_ITEM" as const, name: "کالا", unit: "عدد", active: true };
const warehouse = { id: "wh-1", workspaceId: "ws-1", name: "انبار مرکزی", code: "MAIN", active: true };

test("purchase invoice creates payable, input tax, stock movement and balanced journal", () => {
  const result = issuePurchaseInvoice({
    invoice: {
      id: "pinv-1", workspaceId: "ws-1", supplierId: "sup-1", number: "P-1",
      issuedAt: new Date("2026-09-01T00:00:00Z"), dueAt: new Date("2026-09-30T00:00:00Z"), status: "DRAFT",
      lines: [{ id: "l1", description: "خرید کالا", item, warehouse, quantityMinorUnits: 2n, unitPrice: { currency: "IRR", minorUnits: 1_000_000n }, taxRateBasisPoints: 1000 }],
    },
    payableAccountId: "ap", inventoryAccountId: "inventory", expenseAccountId: "expense", inputTaxAccountId: "input-tax",
  });
  assert.equal(result.invoice.status, "ISSUED");
  assert.equal(result.payable.outstandingAmount.minorUnits, 2_200_000n);
  assert.equal(result.stockMovements.length, 1);
  assert.equal(result.stockMovements[0]?.type, "PURCHASE");
  assert.equal(result.tax.minorUnits, 200_000n);
  const debit = result.journal.lines.reduce((sum, line) => sum + line.debit.minorUnits, 0n);
  const credit = result.journal.lines.reduce((sum, line) => sum + line.credit.minorUnits, 0n);
  assert.equal(debit, credit);
});

test("service purchase becomes expense without stock movement", () => {
  const service = { ...item, id: "service-1", type: "SERVICE" as const, name: "خدمت" };
  const result = issuePurchaseInvoice({
    invoice: {
      id: "pinv-2", workspaceId: "ws-1", supplierId: "sup-1", number: "P-2",
      issuedAt: new Date("2026-09-01T00:00:00Z"), dueAt: new Date("2026-09-30T00:00:00Z"), status: "DRAFT",
      lines: [{ id: "l1", description: "خدمت", item: service, quantityMinorUnits: 1n, unitPrice: { currency: "IRR", minorUnits: 500_000n }, taxRateBasisPoints: 0 }],
    },
    payableAccountId: "ap", inventoryAccountId: "inventory", expenseAccountId: "expense", inputTaxAccountId: "input-tax",
  });
  assert.equal(result.stockMovements.length, 0);
  assert.equal(result.grandTotal.minorUnits, 500_000n);
});
