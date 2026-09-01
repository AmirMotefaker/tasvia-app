export type FiscalPeriodStatus = "OPEN" | "CLOSED";

export interface FiscalPeriod {
  id: string;
  workspaceId: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
  status: FiscalPeriodStatus;
}

export function assertValidFiscalPeriod(period: FiscalPeriod): void {
  if (!period.id.trim()) throw new Error("Fiscal period id is required.");
  if (!period.workspaceId.trim()) throw new Error("Workspace id is required.");
  if (!period.name.trim()) throw new Error("Fiscal period name is required.");
  if (period.endsAt.getTime() < period.startsAt.getTime()) {
    throw new RangeError("Fiscal period end cannot be before start.");
  }
}

export function containsPostingDate(period: FiscalPeriod, postingDate: Date): boolean {
  const t = postingDate.getTime();
  return t >= period.startsAt.getTime() && t <= period.endsAt.getTime();
}

export function assertPostingAllowed(period: FiscalPeriod, postingDate: Date): void {
  assertValidFiscalPeriod(period);
  if (period.status !== "OPEN") throw new Error("Fiscal period is closed.");
  if (!containsPostingDate(period, postingDate)) {
    throw new RangeError("Posting date is outside the fiscal period.");
  }
}
