import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "ورود به تسوین",
  description: "ورود امن به محیط کاری تسوین.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-md rounded-[32px] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-xs font-black text-[#008f87]">Tasvin Workspace</div>
        <h1 className="mt-3 text-3xl font-black">ورود به محیط کاری</h1>
        <p className="mt-4 text-sm leading-7 text-[#657184]">
          Session در سمت سرور بررسی می‌شود و دسترسی به Workspace فقط پس از احراز هویت
          و وجود عضویت فعال مجاز است.
        </p>
        <Suspense fallback={<div className="mt-6 text-sm text-[#657184]">در حال آماده‌سازی فرم…</div>}>
          <SignInForm />
        </Suspense>
        <div className="mt-6 rounded-2xl bg-[#f5f8fb] p-4 text-xs leading-6 text-[#687487]">
          تسوین در این فرم اطلاعات کارت، رمز بانکی، کد پرداخت یا credential مالی دریافت نمی‌کند.
        </div>
      </div>
    </main>
  );
}
