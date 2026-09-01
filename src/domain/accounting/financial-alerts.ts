import type { Payable } from "./payable";
import type { Receivable } from "./receivable";
import type { CatalogItem } from "./inventory";

export type FinancialAlertSeverity = "INFO" | "WARNING" | "CRITICAL";
export type FinancialAlertKind = "RECEIVABLE_DUE" | "RECEIVABLE_OVERDUE" | "PAYABLE_DUE" | "PAYABLE_OVERDUE" | "LOW_STOCK" | "RECONCILIATION";

export interface FinancialAlert {
  id: string;
  workspaceId: string;
  kind: FinancialAlertKind;
  severity: FinancialAlertSeverity;
  title: string;
  explanationFa: string;
  sourceType: "RECEIVABLE" | "PAYABLE" | "INVENTORY" | "TREASURY";
  sourceId: string;
}

const DAY = 86_400_000;

function daysUntil(date: Date, asOf: Date): number {
  return Math.ceil((date.getTime() - asOf.getTime()) / DAY);
}

export function receivableAlerts(receivables: Receivable[], asOf: Date): FinancialAlert[] {
  return receivables.flatMap((item) => {
    if (item.outstandingAmount.minorUnits <= 0n) return [];
    const days = daysUntil(item.dueAt, asOf);
    if (days < 0) return [{ id: `ar-overdue:${item.id}`, workspaceId: item.workspaceId, kind: "RECEIVABLE_OVERDUE" as const, severity: days <= -30 ? "CRITICAL" as const : "WARNING" as const, title: "طلب سررسیدگذشته", explanationFa: `یک طلب مشتری ${Math.abs(days)} روز از سررسید گذشته است و هنوز مانده باز دارد.`, sourceType: "RECEIVABLE" as const, sourceId: item.id }];
    if (days <= 7) return [{ id: `ar-due:${item.id}`, workspaceId: item.workspaceId, kind: "RECEIVABLE_DUE" as const, severity: "INFO" as const, title: "طلب نزدیک سررسید", explanationFa: `یک طلب مشتری تا ${days} روز دیگر سررسید می‌شود.`, sourceType: "RECEIVABLE" as const, sourceId: item.id }];
    return [];
  });
}

export function payableAlerts(payables: Payable[], asOf: Date): FinancialAlert[] {
  return payables.flatMap((item) => {
    if (item.outstandingAmount.minorUnits <= 0n) return [];
    const days = daysUntil(item.dueAt, asOf);
    if (days < 0) return [{ id: `ap-overdue:${item.id}`, workspaceId: item.workspaceId, kind: "PAYABLE_OVERDUE" as const, severity: days <= -30 ? "CRITICAL" as const : "WARNING" as const, title: "بدهی سررسیدگذشته", explanationFa: `یک بدهی تأمین‌کننده ${Math.abs(days)} روز از سررسید گذشته است و هنوز تسویه نشده است.`, sourceType: "PAYABLE" as const, sourceId: item.id }];
    if (days <= 7) return [{ id: `ap-due:${item.id}`, workspaceId: item.workspaceId, kind: "PAYABLE_DUE" as const, severity: "INFO" as const, title: "بدهی نزدیک سررسید", explanationFa: `یک بدهی تأمین‌کننده تا ${days} روز دیگر سررسید می‌شود.`, sourceType: "PAYABLE" as const, sourceId: item.id }];
    return [];
  });
}

export function lowStockAlert(input: { item: CatalogItem; workspaceId: string; quantityMinorUnits: bigint }): FinancialAlert | null {
  if (input.item.workspaceId !== input.workspaceId) throw new Error("Cross-workspace inventory alert is forbidden");
  if (input.item.type !== "STOCK_ITEM" || input.item.lowStockThreshold === undefined) return null;
  if (input.quantityMinorUnits > input.item.lowStockThreshold) return null;
  return { id: `stock-low:${input.item.id}`, workspaceId: input.workspaceId, kind: "LOW_STOCK", severity: input.quantityMinorUnits <= 0n ? "CRITICAL" : "WARNING", title: "موجودی کالا پایین است", explanationFa: input.quantityMinorUnits <= 0n ? "موجودی این کالا به صفر یا کمتر رسیده و فروش بعدی ممکن است متوقف شود." : "موجودی این کالا به حد هشدار رسیده است؛ خرید یا انتقال انبار را بررسی کنید.", sourceType: "INVENTORY", sourceId: input.item.id };
}

export function reconciliationAlert(input: { workspaceId: string; transactionId: string; confidence: number }): FinancialAlert | null {
  if (!Number.isFinite(input.confidence) || input.confidence < 0 || input.confidence > 1) throw new Error("Reconciliation confidence must be between 0 and 1");
  if (input.confidence >= 0.8) return null;
  return { id: `recon:${input.transactionId}`, workspaceId: input.workspaceId, kind: "RECONCILIATION", severity: input.confidence < 0.4 ? "CRITICAL" : "WARNING", title: "مغایرت نیازمند بررسی", explanationFa: "تطبیق این تراکنش با مدارک یا ثبت‌های داخلی اطمینان کافی ندارد و باید بررسی شود.", sourceType: "TREASURY", sourceId: input.transactionId };
}

export function prioritizeFinancialAlerts(alerts: FinancialAlert[]): FinancialAlert[] {
  const rank: Record<FinancialAlertSeverity, number> = { CRITICAL: 3, WARNING: 2, INFO: 1 };
  return [...alerts].sort((a, b) => rank[b.severity] - rank[a.severity] || a.title.localeCompare(b.title, "fa"));
}
