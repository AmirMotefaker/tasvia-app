import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "محصول",
  description: "تسوین؛ مرکز عملیات مالی، حسابداری، خزانه، فروش، خرید، انبار، گزارش و کنترل‌های هوشمند کسب‌وکار.",
  alternates: { canonical: "/product" },
};

const capabilities = [
  ["فروش و دریافتنی", "فاکتور، برگشت، اقساط، تخفیف، پورسانت، طلب و دریافت وجه."],
  ["خرید و پرداختنی", "تأمین‌کننده، فاکتور خرید، بدهی، پرداخت، شواهد و سررسیدها."],
  ["خزانه و چک", "بانک، صندوق، انتقال، چک، POS و مغایرت‌گیری با کنترل انسانی."],
  ["کالا و تولید", "انبار، انتقال، میانگین موزون، بهای تمام‌شده، بارکد و BOM."],
  ["حسابداری دو سطحی", "ثبت ساده برای صاحب کسب‌وکار و دفاتر/اسناد حرفه‌ای برای حسابدار."],
  ["گزارش و هوش مالی", "تراز آزمایشی، سود و زیان، ترازنامه، جریان نقد و هشدارهای توضیح‌پذیر."],
  ["کنترل‌های تجاری", "چندارزی، سطوح قیمت، قواعد تخفیف، اقساط و کمیسیون فروش."],
  ["کنترل و انطباق", "سامانه مودیان، Approval، Backup رمزنگاری‌شده، Audit trail و Integration boundary."],
] as const;

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] bg-[#0f223d] p-7 text-white sm:p-10">
          <div className="text-xs font-black text-[#63dfd4]">محصول تسوین</div>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.35] sm:text-5xl">مرکز عملیات مالی کسب‌وکار؛ از فروش روزانه تا دفتر حسابداری و گزارش مدیریتی.</h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-white/70">تسوین یک مجموعه صفحه جدا از هم نیست. فروش، خرید، خزانه، انبار، تسویه، اسناد حسابداری، گزارش‌ها و کنترل‌های تجاری روی یک حقیقت مالی مشترک قرار می‌گیرند تا هر عدد قابل ردیابی و هر اقدام حساس قابل کنترل باشد.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-2xl bg-[#63dfd4] px-5 py-3 text-sm font-black text-[#0f223d]">مشاهده محیط محصول</Link>
            <Link href="/accounting" className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-black">حسابداری تسوین</Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map(([title, text]) => (
            <article key={title} className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[28px] bg-white p-6"><div className="text-xs font-black text-[#008f87]">برای صاحب کسب‌وکار</div><h2 className="mt-2 text-xl font-black">با زبان روزمره ثبت کن</h2><p className="mt-3 text-sm leading-7 text-[#657184]">فروختم، خریدم، پول گرفتم، پول دادم و هزینه کردم؛ تسوین اثر حسابداری را در همان دفتر مشترک نگه می‌دارد.</p></article>
          <article className="rounded-[28px] bg-white p-6"><div className="text-xs font-black text-[#008f87]">برای حسابدار</div><h2 className="mt-2 text-xl font-black">دفتر، سند و کنترل حرفه‌ای</h2><p className="mt-3 text-sm leading-7 text-[#657184]">کدینگ، دوره مالی، اسناد، دفاتر، گزارش‌ها و Drill-down از صورت مالی تا سند منبع.</p></article>
          <article className="rounded-[28px] bg-white p-6"><div className="text-xs font-black text-[#008f87]">برای مدیر</div><h2 className="mt-2 text-xl font-black">تصمیم بر اساس شواهد</h2><p className="mt-3 text-sm leading-7 text-[#657184]">هشدارهای نقدینگی، مطالبات، بدهی، موجودی و مغایرت با توضیح منبع؛ نه اقدام مالی خودکار و برگشت‌ناپذیر.</p></article>
        </section>
      </div>
    </main>
  );
}
