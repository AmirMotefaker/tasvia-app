import type { Account } from "./account";

export type BusinessPreset = "GENERAL" | "RETAIL" | "RESTAURANT" | "SERVICES";

const baseAccounts: Account[] = [
  { id: "cash", code: "1101", name: "صندوق", type: "ASSET", active: true },
  { id: "bank", code: "1102", name: "بانک", type: "ASSET", active: true },
  { id: "receivables", code: "1201", name: "حساب‌های دریافتنی", type: "ASSET", active: true },
  { id: "inventory", code: "1301", name: "موجودی کالا", type: "ASSET", active: true },
  { id: "payables", code: "2101", name: "حساب‌های پرداختنی", type: "LIABILITY", active: true },
  { id: "capital", code: "3101", name: "سرمایه", type: "EQUITY", active: true },
  { id: "sales", code: "4101", name: "فروش", type: "REVENUE", active: true },
  { id: "service-revenue", code: "4201", name: "درآمد خدمات", type: "REVENUE", active: true },
  { id: "cogs", code: "5101", name: "بهای تمام‌شده", type: "EXPENSE", active: true },
  { id: "general-expense", code: "5201", name: "هزینه‌های عمومی", type: "EXPENSE", active: true },
];

export function createStarterChart(preset: BusinessPreset): Account[] {
  const selected = baseAccounts.filter((account) => {
    if (preset === "SERVICES") return account.id !== "inventory" && account.id !== "cogs";
    if (preset === "GENERAL") return account.id !== "service-revenue";
    return true;
  });

  return selected.map((account) => ({ ...account }));
}

export function validateChart(accounts: Account[]): void {
  const codes = new Set<string>();
  const ids = new Set<string>();

  for (const account of accounts) {
    if (!account.id.trim() || !account.code.trim() || !account.name.trim()) {
      throw new Error("Account id, code and name are required.");
    }
    if (ids.has(account.id)) throw new Error(`Duplicate account id: ${account.id}`);
    if (codes.has(account.code)) throw new Error(`Duplicate account code: ${account.code}`);
    ids.add(account.id);
    codes.add(account.code);
  }
}
