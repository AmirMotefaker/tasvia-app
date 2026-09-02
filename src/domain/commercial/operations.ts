export type DocumentKind = "INVOICE" | "RECEIPT" | "CHEQUE" | "CONTRACT" | "OTHER";

export type ArchivedDocument = {
  id: string;
  workspaceId: string;
  kind: DocumentKind;
  title: string;
  storageKey: string;
  sha256: string;
  createdAt: Date;
};

export function validateArchivedDocument(input: ArchivedDocument): ArchivedDocument {
  if (!input.workspaceId.trim()) throw new Error("workspace-required");
  if (!input.title.trim()) throw new Error("document-title-required");
  if (!/^[a-f0-9]{64}$/i.test(input.sha256)) throw new Error("invalid-document-hash");
  if (!input.storageKey.trim()) throw new Error("storage-key-required");
  return input;
}

export type NotificationChannel = "SMS" | "EMAIL" | "TELEGRAM" | "IN_APP";
export type NotificationIntent = "DUE_REMINDER" | "PAYMENT_STATUS" | "LOW_STOCK" | "RECONCILIATION_ALERT";

export type NotificationRequest = {
  workspaceId: string;
  recipientId: string;
  channel: NotificationChannel;
  intent: NotificationIntent;
  templateKey: string;
  idempotencyKey: string;
};

export function validateNotificationRequest(input: NotificationRequest): NotificationRequest {
  if (!input.workspaceId || !input.recipientId) throw new Error("notification-scope-required");
  if (!input.templateKey.trim()) throw new Error("template-required");
  if (input.idempotencyKey.length < 12) throw new Error("idempotency-key-too-short");
  return input;
}

export type CustomFieldType = "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "SELECT";
export type CustomFieldDefinition = {
  key: string;
  label: string;
  type: CustomFieldType;
  required?: boolean;
  options?: string[];
};

export function validateCustomForm(fields: CustomFieldDefinition[]): CustomFieldDefinition[] {
  const keys = new Set<string>();
  for (const field of fields) {
    if (!/^[a-z][a-z0-9_]{1,31}$/.test(field.key)) throw new Error("invalid-field-key");
    if (keys.has(field.key)) throw new Error("duplicate-field-key");
    if (field.type === "SELECT" && (!field.options || field.options.length === 0)) throw new Error("select-options-required");
    keys.add(field.key);
  }
  return fields;
}

export type FiscalYearCloseInput = {
  fiscalPeriodId: string;
  unpostedJournalCount: number;
  unreconciledCriticalCount: number;
  retainedEarningsAccountId?: string;
};

export type FiscalYearCloseReadiness = { ready: true } | { ready: false; blockers: string[] };

export function evaluateFiscalYearClose(input: FiscalYearCloseInput): FiscalYearCloseReadiness {
  const blockers: string[] = [];
  if (input.unpostedJournalCount > 0) blockers.push("unposted-journals");
  if (input.unreconciledCriticalCount > 0) blockers.push("critical-reconciliation-items");
  if (!input.retainedEarningsAccountId) blockers.push("retained-earnings-account-required");
  return blockers.length ? { ready: false, blockers } : { ready: true };
}

export type JournalAggregationCandidate = { journalId: string; accountId: string; debit: bigint; credit: bigint };

export function aggregateJournalLines(lines: JournalAggregationCandidate[]) {
  const totals = new Map<string, { debit: bigint; credit: bigint }>();
  for (const line of lines) {
    const current = totals.get(line.accountId) ?? { debit: 0n, credit: 0n };
    totals.set(line.accountId, { debit: current.debit + line.debit, credit: current.credit + line.credit });
  }
  return [...totals.entries()].map(([accountId, value]) => ({ accountId, ...value }));
}

export type BomComponent = { sku: string; quantity: number; unitCostMinor: bigint };
export type BillOfMaterials = { productSku: string; outputQuantity: number; components: BomComponent[] };

export function calculateBomCost(bom: BillOfMaterials): bigint {
  if (bom.outputQuantity <= 0) throw new Error("invalid-output-quantity");
  let total = 0n;
  for (const component of bom.components) {
    if (component.quantity <= 0) throw new Error("invalid-component-quantity");
    total += BigInt(Math.round(component.quantity * 1_000_000)) * component.unitCostMinor / 1_000_000n;
  }
  return total;
}

export type CommerceConnector = "WOOCOMMERCE" | "SHOPIFY" | "CUSTOM_API";
export type CommerceOrderEnvelope = {
  connector: CommerceConnector;
  externalOrderId: string;
  workspaceId: string;
  currency: string;
  totalMinor: bigint;
  occurredAt: Date;
};

export function normalizeCommerceOrder(input: CommerceOrderEnvelope): CommerceOrderEnvelope {
  if (!input.externalOrderId.trim()) throw new Error("external-order-id-required");
  if (!/^[A-Z]{3}$/.test(input.currency)) throw new Error("invalid-currency-code");
  if (input.totalMinor < 0n) throw new Error("invalid-order-total");
  return input;
}
