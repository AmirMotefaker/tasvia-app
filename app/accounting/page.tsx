import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حسابداری تسوین | ساده برای همه، حرفه‌ای برای حسابدارها",
  description:
    "حسابداری تسوین با تجربه دوحالته: ثبت ساده برای صاحبان کسب‌وکار و کنترل کامل دفاتر، اسناد و گزارش‌ها برای حسابداران حرفه‌ای.",
  alternates: { canonical: "/accounting" },
};

const simpleActions = [
  "فروختم",
  "خرید کردم",
  "پول گرفتم",
  "پول دادم",
  "هزینه کردم",
  "طلب و بدهی",
];

const capabilities = [
  ["حسابداری دوبل", "ثبت‌های مالی با دفتر روزنامه، کل و معین و کنترل توازن اسناد."],
  ["فروش و دریافتنی", "فاکتور فروش، وضعیت وصول، مانده مشتری و سررسیدها در یک جریان ساده."],
  ["خرید و پرداختنی", "خرید، هزینه، بدهی تامین‌کننده و برنامه پیگیری پرداخت‌ها."],
  ["بانک، صندوق و خزانه", "دید یکپارچه روی جریان نقد، دریافت و پرداخت و حساب‌های مالی."],
  ["انبار و کالا", "موجودی، گردش کالا و پایه بهای تمام‌شده برای کسب‌وکارهای کالامحور."],
  ["گزارش‌های مالی", "تراز آزمایشی، سود و زیان، ترازنامه و جریان نقد با امکان Drill-down."],
  ["چندشعبه و تیم", "فضای کاری نقش‌محور برای شعب، مدیران، حسابداران و تیم مالی."],
  ["هوشمندی مالی", "هشدار مغایرت، تحلیل جریان نقد و توضیح فارسی قابل فهم برای تصمیم‌گیری."],
];

export default function AccountingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-[#00a99d]/20 bg-[#eafaf8] px-3 py-2 text-xs font-black text-[#007d75]">
              حسابداری بدون پیچیدگی غیرضروری
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.35] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              حسابداری برای کسی که حسابداری بلد نیست؛ ابزار حرفه‌ای برای کسی که بلد است.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f6c7e] sm:text-lg">
              در حالت ساده فقط اتفاق کسب‌وکارتان را ثبت می‌کنید؛ تسوین پشت صحنه ثبت مالی قابل حسابرسی می‌سازد. در حالت حرفه‌ای، حسابدار به اسناد، دفاتر، ابعاد و گزارش‌های کامل دسترسی دارد.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="min-h-12 rounded-2xl bg-[#0f223d] px-6 py-3.5 text-center text-sm font-black text-white">درخواست دسترسی</Link>
              <Link href="/product" className="min-h-12 rounded-2xl border border-black/10 bg-white px-6 py-3.5 text-center text-sm font-black">مشاهده محصول</Link>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#0f223d] p-5 text-white shadow-[0_30px_80px_rgba(15,34,61,0.18)] sm:p-7">
            <div className="text-xs font-black text-[#63dfd4]">حالت ساده تسوین</div>
            <h2 className="mt-3 text-2xl font-black">امروز چه اتفاقی افتاد؟</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {simpleActions.map((action) => (
                <div key={action} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-black">
                  {action}
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-[#132b4b] p-4 text-xs leading-6 text-white/70">
              کاربر عادی نیازی به دانستن بدهکار و بستانکار ندارد؛ هر ثبت سیستم‌ساخته باید قابل توضیح و قابل پیگیری باشد.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-black text-[#008f87]">هسته حسابداری تسوین</div>
            <h2 className="mt-3 text-3xl font-black leading-[1.45]">از عملیات روزانه تا صورت‌های مالی، در یک تجربه واحد.</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(([title, text]) => (
              <article key={title} className="rounded-3xl border border-black/5 bg-[#f8fafc] p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 sm:p-8">
            <div className="text-xs font-black text-[#008f87]">برای صاحب کسب‌وکار</div>
            <h2 className="mt-3 text-2xl font-black">نتیجه را ببین، نه اصطلاحات پیچیده را.</h2>
            <p className="mt-4 text-sm leading-8 text-[#5f6c7e]">مانده‌ها، فروش، هزینه، بدهی، طلب، جریان نقد و وضعیت تسویه‌ها باید با زبان روشن و اقدام بعدی مشخص نمایش داده شوند.</p>
          </div>
          <div className="rounded-[28px] border border-black/5 bg-white p-6 sm:p-8">
            <div className="text-xs font-black text-[#008f87]">برای حسابدار حرفه‌ای</div>
            <h2 className="mt-3 text-2xl font-black">کنترل کامل روی ساختار و شواهد مالی.</h2>
            <p className="mt-4 text-sm leading-8 text-[#5f6c7e]">از صورت مالی تا دفتر و سند و مدرک منبع Drill-down کنید؛ اصلاح رکوردهای ثبت‌شده باید با برگشت و سابقه حسابرسی انجام شود، نه حذف بی‌ردپا.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
