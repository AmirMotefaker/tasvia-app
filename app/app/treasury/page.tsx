import Link from "next/link";

const accounts = [
  ["بانک‌ها", "حساب‌های بانکی و مانده نقدی", "/app/treasury"],
  ["صندوق", "دریافت و پرداخت نقدی", "/app/treasury"],
  ["تنخواه", "هزینه‌های خرد و کنترل مانده", "/app/treasury"],
  ["انتقال", "جابجایی بین حساب‌های خزانه", "/app/treasury"],
  ["مغایرت‌گیری", "تطبیق صورتحساب بانک با ثبت‌های تسوین", "/app/reconciliation"],
  ["هزینه‌ها", "ثبت هزینه همراه با مدرک", "/accounting/simple/expense"],
];

export default function TreasuryWorkspacePage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[30px] bg-[#0f223d] p-6 text-white sm:p-8">
          <div className="text-xs font-black text-[#63dfd4]">خزانه تسوین</div>
          <h1 className="mt-3 text-3xl font-black">بانک، صندوق، تنخواه و جریان نقد در یک نمای ساده.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">تسوین مانده‌ها را فقط از ثبت‌های مالی همان فضای کاری می‌سازد. مغایرت‌گیری نقش پیشنهاد تطبیق دارد و هیچ ثبت غیرقابل‌برگشتی را خودکار انجام نمی‌دهد.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map(([title, description, href]) => (
            <Link key={title} href={href} className="rounded-[26px] border border-black/5 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-black">{title}</h2>
                <span aria-hidden className="text-[#8390a3]">←</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-[26px] border border-black/5 bg-white p-6">
            <div className="text-xs font-black text-[#008f87]">وضعیت نقد</div>
            <h2 className="mt-2 text-xl font-black">مانده لحظه‌ای خزانه</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">پس از اتصال Persistence، جمع بانک‌ها، صندوق و تنخواه فعال از دفتر واقعی محاسبه می‌شود.</p>
          </section>
          <section className="rounded-[26px] border border-black/5 bg-white p-6">
            <div className="text-xs font-black text-[#008f87]">کنترل</div>
            <h2 className="mt-2 text-xl font-black">هیچ انتقال نامتوازنی ثبت نمی‌شود.</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">انتقال بین حساب‌ها در یک سند دوبل متوازن ثبت می‌شود و انتقال به همان حساب یا بین فضای کاری متفاوت رد می‌شود.</p>
          </section>
          <section className="rounded-[26px] border border-black/5 bg-white p-6">
            <div className="text-xs font-black text-[#008f87]">مغایرت‌گیری</div>
            <h2 className="mt-2 text-xl font-black">تطبیق با امتیاز اطمینان</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">مبلغ، تاریخ و مرجع برای پیشنهاد تطبیق بررسی می‌شوند و تصمیم نهایی قابل کنترل باقی می‌ماند.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
