import Link from "next/link";
import Image from "next/image";

const stats = [
  { label: "موجودی قابل تسویه", value: "۱۲۸٬۴۵۰٬۰۰۰", unit: "ریال", meta: "نمونه پیش‌نمایش" },
  { label: "تسویه‌های در انتظار", value: "۳", unit: "مورد", meta: "نیازمند بررسی" },
  { label: "جریان نقدی خالص", value: "+۴۲٬۸۰۰٬۰۰۰", unit: "ریال", meta: "۳۰ روز گذشته" },
  { label: "ریسک عملیاتی", value: "کم", unit: "", meta: "بر پایه داده نمایشی" },
];

const settlements = [
  { supplier: "تامین‌کننده سپهر", amount: "۳۶٬۵۰۰٬۰۰۰ ریال", status: "آماده تسویه", href: "/settlements/tsv-1048" },
  { supplier: "پخش آریا", amount: "۱۸٬۲۰۰٬۰۰۰ ریال", status: "نیازمند بررسی", href: "/settlements/tsv-1047" },
  { supplier: "بازرگانی روشا", amount: "۹٬۷۵۰٬۰۰۰ ریال", status: "تطبیق‌شده", href: "/settlements/tsv-1046" },
];

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f7fb] text-[#0b1220]">
      <div className="mx-auto min-h-screen max-w-[1480px] px-3 pb-28 pt-3 sm:px-4 sm:pt-4 lg:flex lg:gap-6 lg:px-6 lg:pb-6">
        <aside className="hidden w-64 shrink-0 rounded-[28px] bg-[#0f223d] p-5 text-white lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <Image src="/brand/tasvia-avatar.svg" alt="Tasvia" width={44} height={44} priority className="rounded-2xl" />
            <div>
              <div className="text-lg font-black tracking-tight">تسویا</div>
              <div className="text-xs text-white/55">Tasvia Demo</div>
            </div>
          </div>
          <nav className="space-y-2 text-sm">
            <Link href="/" className="block rounded-2xl bg-white px-4 py-3 font-bold text-[#0f223d]">نمای کلی</Link>
            <Link href="/settlements" className="block rounded-2xl px-4 py-3 text-white/70">تسویه‌ها</Link>
            <Link href="/onboarding" className="block rounded-2xl px-4 py-3 text-white/70">کسب‌وکار</Link>
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/60">
            Demo Mode فعال است؛ هیچ انتقال وجه واقعی انجام نمی‌شود.
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-4 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:mb-6 sm:rounded-[28px] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1 text-[11px] font-extrabold text-[#008f87] sm:text-xs">Demo Mode</div>
                <h1 className="text-[22px] font-black leading-tight sm:text-3xl">مرکز عملیات مالی تسویا</h1>
                <p className="mt-2 text-[13px] leading-6 text-[#637083] sm:text-sm">
                  درخواست تسویه، وضعیت، نقدینگی و تاریخچه عملیات مالی در یک مسیر واحد
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <Link href="/onboarding" className="min-h-11 rounded-2xl border border-black/10 px-4 py-3 text-center text-xs font-extrabold">
                  مدیریت کسب‌وکار
                </Link>
                <Link href="/settlements/new" className="min-h-11 rounded-2xl bg-[#0f223d] px-4 py-3 text-center text-xs font-extrabold text-white">
                  درخواست تسویه جدید
                </Link>
              </div>
            </div>
          </header>

          <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="min-w-0 rounded-[22px] border border-black/5 bg-white p-4 shadow-sm sm:p-5">
                <div className="text-[12px] leading-5 text-[#6d7889] sm:text-sm">{stat.label}</div>
                <div className="mt-2 flex flex-wrap items-baseline gap-1">
                  <span className="text-[18px] font-black leading-tight sm:text-xl">{stat.value}</span>
                  {stat.unit ? <span className="text-[10px] font-bold text-[#718096] sm:text-xs">{stat.unit}</span> : null}
                </div>
                <div className="mt-2 text-[10px] font-bold text-[#00a99d] sm:text-xs">{stat.meta}</div>
              </article>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[24px] border border-black/5 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black sm:text-lg">تسویه‌های اخیر</h2>
                  <p className="mt-1 text-[11px] text-[#768195] sm:text-xs">برای مشاهده جزئیات روی هر مورد بزن</p>
                </div>
                <Link href="/settlements" className="rounded-xl border border-black/10 px-3 py-2 text-[11px] font-extrabold sm:text-xs">
                  مشاهده همه
                </Link>
              </div>

              <div className="space-y-3">
                {settlements.map((row) => (
                  <Link key={row.supplier} href={row.href} className="block rounded-2xl border border-black/5 p-4 transition hover:border-[#00a99d]/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-extrabold">{row.supplier}</div>
                        <div className="mt-2 text-[13px] font-bold text-[#556174]">{row.amount}</div>
                      </div>
                      <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-[10px] font-extrabold text-[#304157]">{row.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </article>

            <div className="space-y-4">
              <article className="rounded-[24px] bg-[#0f223d] p-4 text-white shadow-sm sm:rounded-[28px] sm:p-5">
                <div className="text-[11px] font-extrabold text-[#63dfd4]">Tasvia Intelligence</div>
                <h2 className="mt-2 text-lg font-black">اقدام پیشنهادی امروز</h2>
                <p className="mt-4 text-[13px] leading-7 text-white/80">
                  سه درخواست تسویه در Demo Mode نیازمند بررسی هستند. قبل از تایید، مبلغ و ذی‌نفع را کنترل کن.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#f1d9a5] bg-[#fffaf0] p-4 sm:rounded-[28px] sm:p-5">
                <div className="text-[13px] font-black text-[#7d5a13]">حالت پیش‌نمایش امن</div>
                <p className="mt-2 text-[11px] leading-6 text-[#8a7343]">
                  همه عملیات این نسخه شبیه‌سازی‌شده‌اند و هیچ پرداخت یا تسویه واقعی انجام نمی‌شود.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>

      <nav aria-label="ناوبری اصلی موبایل" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[24px] border border-black/10 bg-white/95 p-2 shadow-[0_12px_40px_rgba(15,34,61,0.18)] backdrop-blur lg:hidden">
        <Link href="/" className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl bg-[#0f223d] px-1 text-[10px] font-extrabold text-white"><span className="text-lg">⌂</span><span>خانه</span></Link>
        <Link href="/settlements" className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-extrabold text-[#667085]"><span className="text-lg">⇄</span><span>تسویه‌ها</span></Link>
        <Link href="/settlements/new" className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-extrabold text-[#667085]"><span className="text-lg">＋</span><span>جدید</span></Link>
        <Link href="/onboarding" className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-extrabold text-[#667085]"><span className="text-lg">▤</span><span>کسب‌وکار</span></Link>
      </nav>
    </main>
  );
}
