import type { Metadata } from "next";
import Link from "next/link";
import { WorkspaceNav } from "../../src/components/workspace/nav";

export const metadata: Metadata = {
  title: "داشبورد مالی تسوین",
  description: "مرکز فرمان مالی تسوین برای فروش، خرید، نقدینگی، مطالبات، بدهی‌ها، موجودی و گزارش‌ها.",
  robots: { index: false, follow: false },
};

const metrics = [
  ["فروش", "از دفتر واقعی", "فاکتورهای صادرشده و درآمد"],
  ["نقدینگی", "از خزانه", "بانک، صندوق و تنخواه"],
  ["مطالبات", "از مشتریان", "مانده و سررسید طلب‌ها"],
  ["بدهی‌ها", "از تأمین‌کنندگان", "مانده و سررسید پرداخت‌ها"],
];

const modules = [
  ["فروش و فاکتور", "/app/sales", "فاکتور، دریافت، طلب و برگشت از فروش"],
  ["خرید و تأمین‌کننده", "/app/purchases", "خرید، بدهی، پرداخت و مالیات خرید"],
  ["خزانه", "/app/treasury", "بانک، صندوق، انتقال و مغایرت‌گیری"],
  ["کالا و انبار", "/app/inventory", "موجودی، کارت انبار و بهای تمام‌شده"],
  ["کنترل‌های تجاری", "/app/commercial-controls", "چندارزی، اقساط، سطوح قیمت، تخفیف، پورسانت و بارکد"],
  ["گزارش‌های مالی", "/app/reports/financial", "سود و زیان، ترازنامه و جریان نقد"],
  ["حسابداری حرفه‌ای", "/accounting/professional", "اسناد، دفاتر، تراز و Drill-down"],
];

const quickActions = [
  ["فروختم", "/accounting/simple/sale"],
  ["خرید کردم", "/accounting/simple/purchase"],
  ["پول گرفتم", "/accounting/simple/receipt"],
  ["پول دادم", "/accounting/simple/payment"],
  ["هزینه کردم", "/accounting/simple/expense"],
  ["طلب و بدهی", "/accounting/simple/balances"],
];

export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-[#f3f6fa] text-[#0b1220]" dir="rtl">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-black">تسوین</div>
              <div className="text-[11px] text-[#6f7a8b]">مرکز فرمان مالی کسب‌وکار</div>
            </div>
            <Link href="/sign-in" className="rounded-xl border border-black/10 px-3 py-2 text-xs font-black">حساب کاربری</Link>
          </div>
          <div className="mt-4"><WorkspaceNav /></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.45fr_.55fr]">
          <div className="rounded-[30px] bg-[#0f223d] p-6 text-white sm:p-8">
            <div className="text-xs font-black text-[#63dfd4]">وضع مالی کسب‌وکار</div>
            <h1 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">همه چیز مالی، در یک نگاه قابل فهم.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65">فروش، سود، نقدینگی، طلب، بدهی و موجودی باید مستقیماً از دفتر واقعی فضای کاری محاسبه شوند. تسوین در این صفحه عدد ساختگی یا داده نمایشی را به‌جای اطلاعات مالی شما نشان نمی‌دهد.</p>
          </div>
          <Link href="/accounting/simple" className="flex min-h-44 flex-col justify-between rounded-[30px] bg-[#62ddd2] p-6 text-[#0f223d]">
            <span className="text-xs font-black">ثبت سریع</span>
            <span className="text-xl font-black">چه اتفاقی افتاد؟ ←</span>
          </Link>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([title, source, description]) => (
            <article key={title} className="rounded-3xl border border-black/5 bg-white p-5">
              <div className="text-xs font-bold text-[#687487]">{title}</div>
              <div className="mt-2 text-lg font-black text-[#0f223d]">{source}</div>
              <div className="mt-2 text-[11px] font-bold leading-5 text-[#008f87]">{description}</div>
            </article>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <article className="rounded-[30px] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black text-[#008f87]">ماژول‌های اصلی</div>
                <h2 className="mt-2 text-xl font-black">مرکز عملیات مالی</h2>
              </div>
              <Link href="/accounting" className="text-xs font-black text-[#008f87]">حسابداری تسوین</Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {modules.map(([title, href, description]) => (
                <Link key={href} href={href} className="rounded-2xl border border-black/5 bg-[#f7f9fc] p-4 transition hover:bg-[#f0f5f8]">
                  <div className="text-sm font-black">{title}</div>
                  <div className="mt-2 text-xs leading-6 text-[#697587]">{description}</div>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] bg-white p-5 sm:p-6">
            <div className="text-xs font-black text-[#008f87]">برای همه، حتی بدون دانش حسابداری</div>
            <h2 className="mt-2 text-xl font-black">کار روزانه را با زبان خودت ثبت کن</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {quickActions.map(([label, href]) => (
                <Link key={href} href={href} className="flex min-h-20 items-center justify-center rounded-2xl bg-[#f5f8fb] p-4 text-center text-sm font-black hover:bg-[#eaf6f4]">
                  {label}
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-5">
            <div className="text-xs font-black text-[#008f87]">هشدارهای مالی</div>
            <h2 className="mt-2 text-lg font-black">فقط هشدارهای قابل توضیح</h2>
            <p className="mt-3 text-sm leading-7 text-[#687487]">سررسید طلب و بدهی، کمبود موجودی، مغایرت خزانه و ناهنجاری مالی باید با دلیل و منبع نمایش داده شوند.</p>
          </article>
          <article className="rounded-3xl border border-black/5 bg-white p-5">
            <div className="text-xs font-black text-[#008f87]">هوش مالی</div>
            <h2 className="mt-2 text-lg font-black">توضیح ساده، نه تصمیم مالی خودکار</h2>
            <p className="mt-3 text-sm leading-7 text-[#687487]">تسوین می‌تواند وضعیت مالی را به زبان ساده توضیح دهد، اما هیچ اقدام مالی برگشت‌ناپذیری را بدون تأیید کاربر انجام نمی‌دهد.</p>
          </article>
          <article className="rounded-3xl border border-black/5 bg-white p-5">
            <div className="text-xs font-black text-[#008f87]">ردیابی کامل</div>
            <h2 className="mt-2 text-lg font-black">از عدد تا سند منبع</h2>
            <p className="mt-3 text-sm leading-7 text-[#687487]">هر عدد گزارش باید به حساب، سند حسابداری و در نهایت فاکتور، پرداخت یا مدرک منبع قابل Drill-down باشد.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
