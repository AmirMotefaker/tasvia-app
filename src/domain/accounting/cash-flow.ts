import type { Money } from "../financial-safety/money";

export type CashFlowCategory = "OPERATING" | "INVESTING" | "FINANCING";

export interface CashFlowEvent {
  id: string;
  workspaceId: string;
  occurredAt: Date;
  category: CashFlowCategory;
  direction: "INFLOW" | "OUTFLOW";
  amount: Money;
  sourceDocumentId?: string;
  description?: string;
}

export interface CashFlowSection {
  category: CashFlowCategory;
  inflow: Money;
  outflow: Money;
  net: Money;
}

function zero(currency: Money["currency"]): Money {
  return { currency, minorUnits: 0n };
}

export function cashFlowStatement(input: { workspaceId: string; events: CashFlowEvent[]; currency?: Money["currency"] }) {
  const currency = input.currency ?? "IRR";
  const categories: CashFlowCategory[] = ["OPERATING", "INVESTING", "FINANCING"];
  const sections: CashFlowSection[] = categories.map((category) => {
    let inflow = 0n;
    let outflow = 0n;
    for (const event of input.events) {
      if (event.workspaceId !== input.workspaceId || event.category !== category) continue;
      if (event.amount.currency !== currency) throw new Error("Cash-flow currency mismatch");
      if (event.amount.minorUnits <= 0n) throw new Error("Cash-flow amount must be positive");
      if (event.direction === "INFLOW") inflow += event.amount.minorUnits;
      else outflow += event.amount.minorUnits;
    }
    return {
      category,
      inflow: { currency, minorUnits: inflow },
      outflow: { currency, minorUnits: outflow },
      net: { currency, minorUnits: inflow - outflow },
    };
  });
  const netChange = sections.reduce((sum, section) => sum + section.net.minorUnits, 0n);
  return { sections, netChange: { currency, minorUnits: netChange } };
}

export function cashFlowDrillDown(input: { workspaceId: string; category: CashFlowCategory; events: CashFlowEvent[] }) {
  return input.events
    .filter((event) => event.workspaceId === input.workspaceId && event.category === input.category)
    .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
}

export const CASH_FLOW_ZERO = zero("IRR");
