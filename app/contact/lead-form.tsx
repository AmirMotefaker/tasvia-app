"use client";

import { FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string; reference?: string }
  | { status: "error"; message: string };

export function LeadForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          email: data.get("email"),
          phone: data.get("phone"),
          role: data.get("role"),
          problem: data.get("problem"),
          website: data.get("website"),
          consent: data.get("consent") === "on",
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        reference?: string;
      };

      if (!response.ok || !result.ok) {
        setState({ status: "error", message: result.message || "ارسال درخواست ناموفق بود." });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message: result.message || "درخواست دریافت شد.",
        reference: result.reference,
      });
    } catch {
      setState({ status: "error", message: "ارتباط با سرور برقرار نشد. دوباره تلاش کنید." });
    }
  }

  const busy = state.status === "submitting";

  return (
    <form onSubmit={submit} className="rounded-[32px] border border-black/5 bg-white p-6 sm:p-8">
      <div className="text-sm font-black">درخواست پایلوت</div>
      <p className="mt-2 text-xs leading-6 text-[#687487]">
        اطلاعات بانکی، شماره کارت، رمز، توکن پرداخت یا اسناد مالی حساس در این فرم وارد نکنید.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          نام و نام خانوادگی
          <input name="name" required minLength={2} maxLength={80} className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#008f87]" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          نام کسب‌وکار
          <input name="business" required minLength={2} maxLength={120} className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#008f87]" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          ایمیل کاری
          <input name="email" type="email" required maxLength={160} dir="ltr" className="rounded-2xl border border-black/10 px-4 py-3 text-left outline-none focus:border-[#008f87]" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          شماره تماس <span className="text-xs font-normal text-[#8993a2]">اختیاری</span>
          <input name="phone" inputMode="tel" maxLength={32} dir="ltr" className="rounded-2xl border border-black/10 px-4 py-3 text-left outline-none focus:border-[#008f87]" />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-bold">
        نقش شما
        <select name="role" className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#008f87]">
          <option value="owner">مالک / مدیرعامل</option>
          <option value="finance">مالی / حسابداری</option>
          <option value="operations">عملیات</option>
          <option value="product">محصول / فناوری</option>
          <option value="other">سایر</option>
        </select>
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold">
        مسئله اصلی شما در تسویه یا عملیات مالی چیست؟
        <textarea name="problem" required minLength={20} maxLength={1200} rows={5} className="resize-y rounded-2xl border border-black/10 px-4 py-3 leading-7 outline-none focus:border-[#008f87]" />
      </label>

      <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        وب‌سایت
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="mt-5 flex items-start gap-3 text-xs leading-6 text-[#687487]">
        <input name="consent" type="checkbox" required className="mt-1 size-4" />
        <span>با ارسال این فرم موافقم اطلاعات تماس و توضیح مسئله فقط برای بررسی درخواست پایلوت و پیگیری محصول پردازش شود.</span>
      </label>

      <button disabled={busy} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {busy ? "در حال ارسال…" : "ارسال درخواست پایلوت"}
      </button>

      {state.status === "success" && (
        <div role="status" className="mt-5 rounded-2xl border border-[#008f87]/15 bg-[#eafaf8] p-4 text-sm leading-7 text-[#315b59]">
          <div className="font-black">{state.message}</div>
          {state.reference && <div className="mt-1 text-xs" dir="ltr">{state.reference}</div>}
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-800">
          {state.message}
        </div>
      )}
    </form>
  );
}
