import Link from "next/link";

const alertGroups = [
  ["طلب‌های سررسیدشده", "مطالباتی که از موعد گذشته‌اند و باید پیگیری شوند.", "/app/sales"],
  ["بدهی‌های نزدیک سررسید", "پرداخت‌هایی که باید برای جلوگیری از تأخیر برنامه‌ریزی شوند.", "/app/purchases"],
  ["موجودی پایین", "کالاهایی که به حداقل موجودی رسیده‌اند یا در آستانه اتمام هستند.", "/app/inventory"],
  ["مغایرت‌های خزانه", "تراکنش‌هایی که تطبیق آن‌ها با بانک یا صندوق نیاز به بررسی دارد.", "/app/treasury"],
];

export default function AlertsPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col gap-5 border-b border-black/5 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black text-[#008f87]">مرکز اقدام</div>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">چه چیزی الان نیاز به توجه دارد؟</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657184]">تسوین هشدارها را از واقعیت حسابداری، سررسیدها، موجودی و مغایرت‌های خزانه می‌سازد؛ نه از حدس و عدد نمایشی.</p>
          </div>
          <Link href="/app" className="text-sm font-black text-[#007d75]">بازگشت به داشبورد</Link>
        </header>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {alertGroups.map(([title, description, href]) => (
            <Link key={title} href={href} className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_14px_45px_rgba(15,34,61,.05)] transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black text-[#008f87]">هشدار قابل پیگیری</div>
                  <h2 className="mt-2 text-xl font-black">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#657184]">{description}</p>
                </div>
                <span className="text-xl text-[#8090a3]">←</span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-7 rounded-[30px] bg-[#0f223d] p-6 text-white sm:p-8">
          <div className="text-xs font-black text-[#63dfd4]">توضیح ساده، منبع مشخص</div>
          <h2 className="mt-3 text-2xl font-black">هر هشدار باید بگوید چه اتفاقی افتاده، چرا مهم است و از کدام سند آمده.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">لایه هوشمند فقط واقعیت‌های ثبت‌شده را توضیح می‌دهد. هیچ پرداخت، انتقال، ثبت مالیاتی یا اقدام برگشت‌ناپذیر بدون تصمیم و مجوز کاربر انجام نمی‌شود.</p>
        </section>
      </section>
    </main>
  );
}
