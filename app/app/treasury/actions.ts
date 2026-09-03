"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import {
  executeSettlement,
  type SettlementDirection,
  type TreasuryAccountCode,
} from "../../../src/application/settlements/settlement-service";

export type TreasurySettlementState = {
  ok: boolean;
  message: string;
};

function normalizeDigits(value: string) {
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(/[۰-۹]/g, (digit) => String(fa.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ar.indexOf(digit)))
    .replace(/[,_،\s]/g, "");
}

function positiveRials(value: FormDataEntryValue | null) {
  const normalized = normalizeDigits(String(value ?? ""));
  if (!/^\d+$/.test(normalized)) {
    throw new Error("مبلغ باید عدد صحیح ریالی باشد.");
  }

  const amount = BigInt(normalized);
  if (amount <= 0n) {
    throw new Error("مبلغ باید بیشتر از صفر باشد.");
  }

  return amount;
}

export async function submitSettlementAction(
  _: TreasurySettlementState,
  formData: FormData,
): Promise<TreasurySettlementState> {
  try {
    const current = await requireCurrentWorkspace();

    if (current.role === "VIEWER") {
      return {
        ok: false,
        message: "نقش مشاهده‌گر اجازه ثبت دریافت یا پرداخت ندارد.",
      };
    }

    const direction = String(
      formData.get("direction") ?? "",
    ) as SettlementDirection;

    if (!["RECEIPT", "PAYMENT"].includes(direction)) {
      return { ok: false, message: "نوع عملیات معتبر نیست." };
    }

    const treasuryAccountCode = String(
      formData.get("treasuryAccountCode") ?? "",
    ) as TreasuryAccountCode;

    if (!["1101", "1102"].includes(treasuryAccountCode)) {
      return { ok: false, message: "حساب خزانه معتبر نیست." };
    }

    const occurredAt = new Date(
      String(formData.get("occurredAt") ?? ""),
    );

    if (Number.isNaN(occurredAt.getTime())) {
      return { ok: false, message: "تاریخ معتبر نیست." };
    }

    const result = await executeSettlement({
      workspaceId: current.workspace.id,
      actorId: current.userId,
      direction,
      openBalanceId: String(formData.get("openBalanceId") ?? ""),
      treasuryAccountCode,
      amountRials: positiveRials(formData.get("amount")),
      occurredAt,
      idempotencyKey: `settlement:${current.workspace.id}:${randomUUID()}`,
      description:
        String(formData.get("description") ?? "").trim() || undefined,
    });

    revalidatePath("/app/treasury");
    revalidatePath("/app/sales");
    revalidatePath("/app/purchases");
    revalidatePath("/app");
    revalidatePath("/app/reports/financial");

    return {
      ok: true,
      message:
        result.status === "PAID"
          ? "مانده به‌طور کامل تسویه و سند خزانه ثبت شد."
          : "تسویه جزئی و سند خزانه با موفقیت ثبت شد.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ثبت تسویه ناموفق بود.";

    const translations: Record<string, string> = {
      OPEN_BALANCE_NOT_FOUND: "مانده باز انتخاب‌شده معتبر نیست.",
      SETTLEMENT_EXCEEDS_OUTSTANDING:
        "مبلغ پرداخت یا دریافت از مانده باز بیشتر است.",
      SETTLEMENT_AMOUNT_MUST_BE_POSITIVE:
        "مبلغ باید بیشتر از صفر باشد.",
      BALANCE_ALREADY_SETTLED: "این مانده قبلاً تسویه شده است.",
      OPEN_FISCAL_PERIOD_REQUIRED:
        "برای تاریخ عملیات دوره مالی باز وجود ندارد.",
      FINANCIAL_WRITES_DISABLED:
        "ثبت مالی در این محیط هنوز فعال نشده است.",
      PRODUCTION_FINANCIAL_WRITES_NOT_APPROVED:
        "ثبت مالی Production مجوز نهایی ندارد.",
    };

    return {
      ok: false,
      message:
        translations[message] ??
        (message.startsWith("ACCOUNT_NOT_CONFIGURED:")
          ? `حساب پایه ${message.split(":")[1]} تنظیم نشده است.`
          : message),
    };
  }
}
