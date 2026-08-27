import Image from "next/image";

const stats = [
  { label: "موجودی قابل تسویه", value: "۱۲۸٬۴۵۰٬۰۰۰", unit: "ریال", meta: "نمونه پیش‌نمایش" },
  { label: "تسویه‌های در انتظار", value: "۳", unit: "مورد", meta: "نیازمند بررسی" },
  { label: "جریان نقدی خالص", value: "+۴۲٬۸۰۰٬۰۰۰", unit: "ریال", meta: "۳۰ روز گذشته" },
  { label: "ریسک عملیاتی", value: "کم", unit: "", meta: "بر پایه داده نمایشی" },
];

const settlements = [
  { supplier: "تامین‌کننده سپهر", amount: "۳۶٬۵۰۰٬۰۰۰ ریال", status: "آماده تسویه" },
  { supplier: "پخش آریا", amount: "۱۸٬۲۰۰٬۰۰۰ ریال", status: "نیازمند بررسی" },
  { supplier: "بازرگانی روشا", amount: "۹٬۷۵۰٬۰۰۰ ریال", status: "تطبیق‌شده" },
];

const insights = [
  "بیشترین فشار نقدینگی این هفته مربوط به پرداخت‌های تامین‌کنندگان است.",
  "سه تراکنش نمایشی برای بررسی دستی علامت‌گذاری شده‌اند.",
  "روند خالص جریان نقدی در نمونه فعلی مثبت است.",
];

const mobileNav = [
  { label: "خانه", icon: "⌂" },
  { label: "تسویه‌ها", icon: "⇄" },
  { label: "نقدینگی", icon: "◒" },
  { label: "گزارش‌ها", icon: "▤" },
];

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f7fb] text-[#0b1220]">
      <div className="mx-auto min-h-screen max-w-[1480px] px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:flex lg:gap-6 lg:px-6 lg:pb-6">
        <aside className="hidden w-64 shrink-0 rounded-[28px] bg-[#0f223d] p-5 text-white lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <Image
              src="/brand/tasvia-avatar.svg"
              alt="Tasvia"
              width={44}
              height={44}
              priority
              className="rounded-2xl"
            />
            <div>
              <div className="text-lg font-black tracking-tight">تسویا</div>
              <div className="text-xs text-white/55">Tasvia Preview</div>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            {["نمای کلی", "تسویه‌ها", "جریان نقدی", "صورت‌های مالی", "بینش‌ها"].map(
              (item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl px-4 py-3 ${
                    index === 0
                      ? "bg-white font-bold text-[#0f223d]"
                      : "text-white/70"
                  }`}
                >
                  {item}
                </div>
              ),
            )}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/60">
            محیط پیش‌نمایش است و هیچ عملیات واقعی بانکی یا انتقال وجه انجام نمی‌دهد.
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-4 rounded-[24px] border border-black/5 bg-white px-4 py-4 shadow-sm sm:mb-6 sm:rounded-[28px] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1 text-[11px] font-extrabold tracking-tight text-[#008f87] sm:text-xs">
                  پیش‌نمایش محصول
                </div>
                <h1 className="text-[22px] font-black leading-tight tracking-[-0.02em] sm:text-3xl">
                  مرکز عملیات مالی تسویا
                </h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#637083] sm:text-sm">
                  تسویه، نقدینگی، ریسک و وضعیت مالی کسب‌وکار در یک نمای واحد
                </p>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <span className="rounded-full bg-[#e8f8f5] px-3 py-2 text-xs font-extrabold text-[#007f77]">
                  Demo Mode
                </span>
                <div className="rounded-2xl bg-[#0f223d] px-4 py-3 text-sm font-bold text-white">
                  کسب‌وکار نمونه
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f7fafc] px-3 py-3 sm:hidden">
              <div className="flex items-center gap-2">
                <Image
                  src="/brand/tasvia-avatar.svg"
                  alt="Tasvia"
                  width={34}
                  height={34}
                  priority
                  className="rounded-xl"
                />
                <div>
                  <div className="text-sm font-black">تسویا</div>
                  <div className="text-[10px] text-[#7d8797]">Mobile Preview</div>
                </div>
              </div>
              <span className="rounded-full bg-[#e8f8f5] px-3 py-2 text-[10px] font-extrabold text-[#007f77]">
                Demo
              </span>
            </div>
          </header>

          <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="min-w-0 rounded-[22px] border border-black/5 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5"
              >
                <div className="text-[12px] leading-5 text-[#6d7889] sm:text-sm">
                  {stat.label}
                </div>
                <div className="mt-2 flex min-w-0 flex-wrap items-baseline gap-1 sm:mt-3">
                  <span className="break-words text-[18px] font-black leading-tight tracking-[-0.02em] sm:text-xl">
                    {stat.value}
                  </span>
                  {stat.unit ? (
                    <span className="text-[10px] font-bold text-[#718096] sm:text-xs">
                      {stat.unit}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 text-[10px] font-bold leading-5 text-[#00a99d] sm:text-xs">
                  {stat.meta}
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.45fr_1fr]">
            <div className="space-y-4 sm:space-y-6">
              <article className="rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:items-center">
                  <div>
                    <h2 className="text-base font-black sm:text-lg">جریان نقدی</h2>
                    <p className="mt-1 text-[11px] text-[#768195] sm:text-xs">
                      نمایش نمونه ۳۰ روز اخیر
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-extrabold text-[#00a99d] sm:text-xs">
                    +۱۸٫۴٪
                  </span>
                </div>

                <div className="flex h-44 items-end gap-2 overflow-hidden rounded-[22px] bg-[#f7f9fc] p-4 sm:h-56 sm:gap-3 sm:rounded-3xl sm:p-5">
                  {[34, 52, 41, 68, 57, 76, 64, 82, 72, 91, 78, 96].map(
                    (height, index) => (
                      <div key={index} className="flex min-w-0 flex-1 items-end">
                        <div
                          className="w-full rounded-t-lg bg-[#0f223d] sm:rounded-t-xl"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ),
                  )}
                </div>
              </article>

              <article className="rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:items-center">
                  <div>
                    <h2 className="text-base font-black sm:text-lg">تسویه‌های اخیر</h2>
                    <p className="mt-1 text-[11px] text-[#768195] sm:text-xs">
                      داده‌های این جدول نمایشی هستند
                    </p>
                  </div>
                  <button className="min-h-11 shrink-0 rounded-xl border border-black/10 px-3 text-[11px] font-extrabold sm:text-xs">
                    مشاهده همه
                  </button>
                </div>

                <div className="space-y-3">
                  {settlements.map((row) => (
                    <div
                      key={row.supplier}
                      className="rounded-2xl border border-black/5 p-4 sm:grid sm:grid-cols-[1.2fr_1fr_auto] sm:items-center sm:gap-3"
                    >
                      <div className="flex items-start justify-between gap-3 sm:block">
                        <div className="min-w-0 font-extrabold leading-6">{row.supplier}</div>
                        <span className="shrink-0 rounded-full bg-[#eef3f8] px-3 py-1 text-[10px] font-extrabold text-[#304157] sm:hidden">
                          {row.status}
                        </span>
                      </div>
                      <div className="mt-2 text-[13px] font-bold tabular-nums text-[#556174] sm:mt-0 sm:text-sm">
                        {row.amount}
                      </div>
                      <span className="hidden w-fit rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-bold text-[#304157] sm:inline-flex">
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <article className="rounded-[24px] bg-[#0f223d] p-4 text-white shadow-sm sm:rounded-[28px] sm:p-5">
                <div className="text-[11px] font-extrabold text-[#63dfd4] sm:text-xs">
                  Tasvia Intelligence
                </div>
                <h2 className="mt-2 text-lg font-black sm:text-xl">خلاصه مالی امروز</h2>
                <div className="mt-4 space-y-3 sm:mt-5">
                  {insights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[13px] leading-7 text-white/80 sm:text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
                <h2 className="text-base font-black sm:text-lg">صورت‌های مالی</h2>
                <p className="mt-1 text-[11px] text-[#768195] sm:text-xs">
                  خلاصه نمونه برای ارزیابی تجربه کاربری
                </p>

                <div className="mt-4 space-y-3 sm:mt-5">
                  {[
                    ["درآمد", "۱۸۹٬۰۰۰٬۰۰۰ ریال"],
                    ["هزینه", "۱۴۶٬۲۰۰٬۰۰۰ ریال"],
                    ["سود خالص", "۴۲٬۸۰۰٬۰۰۰ ریال"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-[#f7f9fc] px-4 py-3 sm:py-4"
                    >
                      <span className="text-[12px] text-[#657184] sm:text-sm">{label}</span>
                      <strong className="text-left text-[12px] font-extrabold tabular-nums sm:text-sm">
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[24px] border border-[#f1d9a5] bg-[#fffaf0] p-4 sm:rounded-[28px] sm:p-5">
                <div className="text-[13px] font-black text-[#7d5a13] sm:text-sm">
                  حالت پیش‌نمایش امن
                </div>
                <p className="mt-2 text-[11px] leading-6 text-[#8a7343] sm:text-xs">
                  همه اعداد و رویدادهای این صفحه ساختگی هستند. هیچ پرداخت، تسویه یا عملیات بانکی واقعی از این نسخه انجام نمی‌شود.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>

      <nav
        aria-label="ناوبری اصلی موبایل"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[24px] border border-black/10 bg-white/95 p-2 shadow-[0_12px_40px_rgba(15,34,61,0.18)] backdrop-blur lg:hidden"
      >
        {mobileNav.map((item, index) => (
          <button
            key={item.label}
            className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-extrabold ${
              index === 0 ? "bg-[#0f223d] text-white" : "text-[#667085]"
            }`}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
