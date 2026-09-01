export const SIMPLE_ACCOUNTING_ACTIONS = {
  SALE: {
    slug: "sale",
    label: "فروختم",
    description: "فروش و طلب مشتری را ثبت کن",
    requiredInputs: ["customer", "amount", "issuedAt", "dueAt"] as const,
    accountingEffect: "receivable-and-revenue",
  },
  PURCHASE: {
    slug: "purchase",
    label: "خرید کردم",
    description: "خرید و بدهی تأمین‌کننده را ثبت کن",
    requiredInputs: ["supplier", "amount", "issuedAt", "dueAt"] as const,
    accountingEffect: "expense-or-inventory-and-payable",
  },
  RECEIPT: {
    slug: "receipt",
    label: "پول گرفتم",
    description: "دریافت را به طلب مشتری تخصیص بده",
    requiredInputs: ["customer", "amount", "receivedAt"] as const,
    accountingEffect: "cash-and-receivable-allocation",
  },
  PAYMENT: {
    slug: "payment",
    label: "پول دادم",
    description: "پرداخت را به بدهی تأمین‌کننده تخصیص بده",
    requiredInputs: ["supplier", "amount", "paidAt"] as const,
    accountingEffect: "cash-and-payable-allocation",
  },
  EXPENSE: {
    slug: "expense",
    label: "هزینه کردم",
    description: "هزینه روزانه را با مدرک ثبت کن",
    requiredInputs: ["category", "amount", "occurredAt"] as const,
    accountingEffect: "expense-and-cash-or-payable",
  },
  BALANCES: {
    slug: "balances",
    label: "طلب و بدهی",
    description: "مانده اشخاص و سررسیدها را ببین",
    requiredInputs: [] as const,
    accountingEffect: "receivables-and-payables-reporting",
  },
} as const;

export type SimpleAccountingActionKey = keyof typeof SIMPLE_ACCOUNTING_ACTIONS;
export type SimpleAccountingActionSlug = (typeof SIMPLE_ACCOUNTING_ACTIONS)[SimpleAccountingActionKey]["slug"];

export function simpleActionBySlug(slug: string) {
  return Object.values(SIMPLE_ACCOUNTING_ACTIONS).find((action) => action.slug === slug) ?? null;
}
