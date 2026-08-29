import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f7fb] px-3 py-4 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <div className="text-[11px] font-extrabold text-[#008f87]">Demo Onboarding</div>
          <h1 className="mt-1 text-2xl font-black">کسب‌وکار فعال</h1>
          <p className="mt-2 text-sm leading-7 text-[#657184]">در این نسخه فقط یک انتخاب نمایشی برای تست جریان محصول داریم.</p>
        </div>

        <section className="space-y-4 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:p-5">
          <div className="rounded-2xl border border-[#00a99d]/30 bg-[#ecfbf8] p-4">
            <div className="text-[10px] font-extrabold text-[#008f87]">انتخاب‌شده</div>
            <div className="mt-2 text-lg font-black">کافه نمونه تسویا</div>
            <div className="mt-2 text-xs text-[#657184]">شعبه مرکزی · Demo Mode</div>
          </div>

          <div className="rounded-2xl border border-black/5 p-4">
            <div className="text-sm font-black">اطلاعات نمونه</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#f7f9fc] p-3"><div className="text-[#8a94a3]">نوع کسب‌وکار</div><div className="mt-1 font-extrabold">کافه</div></div>
              <div className="rounded-xl bg-[#f7f9fc] p-3"><div className="text-[#8a94a3]">تامین‌کنندگان</div><div className="mt-1 font-extrabold">۱۲ مورد</div></div>
            </div>
          </div>

          <Link href="/" className="block min-h-12 rounded-2xl bg-[#0f223d] px-4 py-3 text-center text-xs font-extrabold text-white">ورود به داشبورد</Link>
        </section>
      </div>
    </main>
  );
}
