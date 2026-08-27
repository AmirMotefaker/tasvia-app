import Image from "next/image";

const stats = [
  { label: "موجودی قابل تسویه", value: "۱۲۸٬۴۵۰٬۰۰۰ ریال", meta: "نمونه پیش‌نمایش" },
  { label: "تسویه‌های در انتظار", value: "۳ مورد", meta: "نیازمند بررسی" },
  { label: "جریان نقدی خالص", value: "+۴۲٬۸۰۰٬۰۰۰ ریال", meta: "۳۰ روز گذشته" },
  { label: "ریسک عملیاتی", value: "کم", meta: "بر پایه داده نمایشی" },
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

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] text-[#0b1220]">
      <div className="mx-auto flex min-h-screen max-w-[1480px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-64 shrink-0 rounded-[28px] bg-[#0f223d] p-5 text-white lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <Image src="/brand/tasvia-avatar.svg" alt="Tasvia" width={44} height={44} priority className="rounded-2xl" />
            <div>
              <div className="text-lg font-black tracking-tight">تسویا</div>
              <div className="text-xs text-white/55">Tasvia Preview</div>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            {["نمای کلی", "تسویه‌ها", "جریان نقدی", "صورت‌های مالی", "بینش‌ها"].map((item, index) => (
              <div key={item} className={`rounded-2xl px-4 py-3 ${index === 0 ? "bg-white text-[#0f223d] font-bold" : "text-white/70"}`}>
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/60">
            این محیط صرفاً پیش‌نمایش محصول است و هیچ عملیات واقعی بانکی یا انتقال وجه انجام نمی‌دهد.
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 text-xs font-bold text-[#00a99d]">پیش‌نمایش محصول</div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">مرکز عملیات مالی تسویا</h1>
              <p className="mt-2 text-sm text-[#637083]">یک نمای واحد برای تسویه، نقدینگی، ریسک و وضعیت مالی کسب‌وکار</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#e8f8f5] px-3 py-2 text-xs font-bold text-[#007f77]">Demo Mode</span>
              <div className="rounded-2xl bg-[#0f223d] px-4 py-3 text-sm font-bold text-white">کسب‌وکار نمونه</div>
            </div>
          </header>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm">
                <div className="text-sm text-[#6d7889]">{stat.label}</div>
                <div className="mt-3 text-xl font-black tracking-tight">{stat.value}</div>
                <div className="mt-2 text-xs text-[#00a99d]">{stat.meta}</div>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <div className="space-y-6">
              <article className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black">جریان نقدی</h2>
                    <p className="mt-1 text-xs text-[#768195]">نمایش نمونه ۳۰ روز اخیر</p>
                  </div>
                  <span className="text-xs font-bold text-[#00a99d]">+۱۸٫۴٪</span>
                </div>

                <div className="flex h-56 items-end gap-3 rounded-3xl bg-[#f7f9fc] p-5">
                  {[34, 52, 41, 68, 57, 76, 64, 82, 72, 91, 78, 96].map((height, index) => (
                    <div key={index} className="flex flex-1 items-end">
                      <div className="w-full rounded-t-xl bg-[#0f223d]" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black">تسویه‌های اخیر</h2>
                    <p className="mt-1 text-xs text-[#768195]">داده‌های این جدول نمایشی هستند</p>
                  </div>
                  <button className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold">مشاهده همه</button>
                </div>

                <div className="space-y-3">
                  {settlements.map((row) => (
                    <div key={row.supplier} className="grid gap-3 rounded-2xl border border-black/5 p-4 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center">
                      <div className="font-bold">{row.supplier}</div>
                      <div className="text-sm text-[#556174]">{row.amount}</div>
                      <span className="w-fit rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-bold text-[#304157]">{row.status}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="space-y-6">
              <article className="rounded-[28px] bg-[#0f223d] p-5 text-white shadow-sm">
                <div className="text-xs font-bold text-[#63dfd4]">Tasvia Intelligence</div>
                <h2 className="mt-2 text-xl font-black">خلاصه مالی امروز</h2>
                <div className="mt-5 space-y-3">
                  {insights.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/78">
                      {item}
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black">صورت‌های مالی</h2>
                <p className="mt-1 text-xs text-[#768195]">خلاصه نمونه برای ارزیابی تجربه کاربری</p>
                <div className="mt-5 space-y-3">
                  {[
                    ["درآمد", "۱۸۹٬۰۰۰٬۰۰۰ ریال"],
                    ["هزینه", "۱۴۶٬۲۰۰٬۰۰۰ ریال"],
                    ["سود خالص", "۴۲٬۸۰۰٬۰۰۰ ریال"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl bg-[#f7f9fc] px-4 py-4">
                      <span className="text-sm text-[#657184]">{label}</span>
                      <strong className="text-sm">{value}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[28px] border border-[#f1d9a5] bg-[#fffaf0] p-5">
                <div className="text-sm font-black text-[#7d5a13]">حالت پیش‌نمایش امن</div>
                <p className="mt-2 text-xs leading-6 text-[#8a7343]">
                  همه اعداد و رویدادهای این صفحه ساختگی هستند. هیچ پرداخت، تسویه یا عملیات بانکی واقعی از این نسخه انجام نمی‌شود.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
