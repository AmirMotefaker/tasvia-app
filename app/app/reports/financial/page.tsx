import Link from "next/link";

const reports = [
  ["تراز آزمایشی", "مانده بدهکار و بستانکار همه حساب‌ها و کنترل توازن دفتر"],
  ["سود و زیان", "درآمد، هزینه و سود خالص دوره با امکان رفتن تا حساب و سند"],
  ["ترازنامه", "دارایی، بدهی، حقوق مالکانه و سود جاری در یک نمای قابل فهم"],
  ["جریان نقد", "ورودی و خروجی نقد عملیاتی، سرمایه‌گذاری و تأمین مالی"],
  ["مطالبات", "مانده مشتریان، Aging و سررسیدهای دریافت"],
  ["بدهی‌ها", "مانده تأمین‌کنندگان، Aging و سررسیدهای پرداخت"],
];

export default function FinancialReportsPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col gap-5 border-b border-black/5 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black text-[#008f87]">گزارش‌های مالی</div>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">از خلاصه مدیریتی تا سند منبع</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657184]">عددها از دفتر حسابداری فضای کاری می‌آیند؛ هر گزارش باید تا حساب، سند و مدرک منبع قابل پیگیری باشد.</p>
          </div>
          <Link href="/app" className="text-sm font-black text-[#007d75]">بازگشت به میزکار</Link>
        </header>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map(([title, description]) => (
            <article key={title} className="rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_14px_45px_rgba(15,34,61,.05)]">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#657184]">{description}</p>
              <div className="mt-5 text-xs font-black text-[#008f87]">مشاهده گزارش ←</div>
            </article>
          ))}
        </div>

        <section className="mt-7 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] bg-[#0f223d] p-6 text-white sm:p-8">
            <div className="text-xs font-black text-[#63dfd4]">برای صاحب کسب‌وکار</div>
            <h2 className="mt-3 text-2xl font-black">بفهم چه اتفاقی افتاده، نه فقط اینکه عدد چیست.</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">سود، نقدینگی، طلب و بدهی باید با توضیح ساده و هشدارهای قابل اقدام نمایش داده شوند.</p>
          </div>
          <div className="rounded-[28px] border border-black/5 bg-white p-6 sm:p-8">
            <div className="text-xs font-black text-[#008f87]">برای حسابدار</div>
            <h2 className="mt-3 text-2xl font-black">Drill-down کامل و قابل حسابرسی</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">از صورت مالی به حساب، از حساب به گردش، از گردش به Journal و از Journal به سند منبع.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
