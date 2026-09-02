import type { Receivable } from "../../domain/accounting/receivable";
import type { Payable } from "../../domain/accounting/payable";
import {
  allocateReceipt,
  applyAllocations,
  type CustomerReceipt,
  type ReceiptAllocation,
} from "../../domain/accounting/receipt-allocation";
import {
  allocateSupplierPayment,
  applySupplierPaymentAllocations,
  type SupplierPayment,
  type SupplierPaymentAllocation,
} from "../../domain/accounting/supplier-payment-allocation";
import type { JournalEntry } from "../../domain/journal/journal-entry";
import {
  createReceiptJournal,
  createSupplierPaymentJournal,
  type AccountingAccountMap,
  type AccountingCommandContext,
} from "./simple-accounting";

export interface RecordCustomerReceiptCommand extends AccountingCommandContext {
  id: string;
  customerId: string;
  amount: CustomerReceipt["amount"];
  receivables: Receivable[];
  allocations: Array<{ receivableId: string; amount: CustomerReceipt["amount"] }>;
  accounts: AccountingAccountMap;
  reference?: string;
}

export interface RecordCustomerReceiptResult {
  receipt: CustomerReceipt;
  allocations: ReceiptAllocation[];
  receivables: Receivable[];
  journalEntry: JournalEntry;
}

export function recordCustomerReceipt(command: RecordCustomerReceiptCommand): RecordCustomerReceiptResult {
  const receipt: CustomerReceipt = {
    id: command.id,
    workspaceId: command.workspaceId,
    customerId: command.customerId,
    amount: command.amount,
    receivedAt: command.occurredAt,
    reference: command.reference,
  };

  const allocations = allocateReceipt(receipt, command.receivables, command.allocations, command.occurredAt);
  const receivables = applyAllocations(command.receivables, allocations);
  const allocatedMinorUnits = allocations.reduce((sum, item) => sum + item.amount.minorUnits, 0n);

  if (allocatedMinorUnits !== command.amount.minorUnits) {
    throw new Error("Simple receipt must be fully allocated before posting");
  }

  const journalEntry = createReceiptJournal({
    workspaceId: command.workspaceId,
    actorId: command.actorId,
    occurredAt: command.occurredAt,
    id: command.id,
    amount: command.amount,
    accounts: command.accounts,
  });

  return { receipt, allocations, receivables, journalEntry };
}

export interface RecordSupplierPaymentCommand extends AccountingCommandContext {
  id: string;
  supplierId: string;
  amount: SupplierPayment["amount"];
  payables: Payable[];
  allocations: Array<{ payableId: string; amount: SupplierPayment["amount"] }>;
  accounts: AccountingAccountMap;
  reference?: string;
}

export interface RecordSupplierPaymentResult {
  payment: SupplierPayment;
  allocations: SupplierPaymentAllocation[];
  payables: Payable[];
  journalEntry: JournalEntry;
}

export function recordSupplierPayment(command: RecordSupplierPaymentCommand): RecordSupplierPaymentResult {
  const payment: SupplierPayment = {
    id: command.id,
    workspaceId: command.workspaceId,
    supplierId: command.supplierId,
    amount: command.amount,
    paidAt: command.occurredAt,
    reference: command.reference,
  };

  const allocations = allocateSupplierPayment(payment, command.payables, command.allocations, command.occurredAt);
  const payables = applySupplierPaymentAllocations(command.payables, allocations, command.occurredAt);
  const allocatedMinorUnits = allocations.reduce((sum, item) => sum + item.amount.minorUnits, 0n);

  if (allocatedMinorUnits !== command.amount.minorUnits) {
    throw new Error("Simple supplier payment must be fully allocated before posting");
  }

  const journalEntry = createSupplierPaymentJournal({
    workspaceId: command.workspaceId,
    actorId: command.actorId,
    occurredAt: command.occurredAt,
    id: command.id,
    amount: command.amount,
    accounts: command.accounts,
  });

  return { payment, allocations, payables, journalEntry };
}
