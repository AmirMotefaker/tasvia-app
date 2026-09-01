import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "حسابداری ساده تسوین",
  description: "ثبت اتفاق‌های مالی روزانه بدون نیاز به دانستن اصطلاحات حسابداری.",
  alternates: { canonical: "/accounting/simple" },
};

const actions = [
  ["فروختم", "فروش و طلب مشتری را ثبت کن", "فروش"],
  ["خرید کردم", "خرید و بدهی تامین‌کننده را ثبت کن", "خرید"],
  ["پول گرفتم", "دریافت از مشتری یا سایر منابع", "دریافت"],
  ["پول دادم", "پرداخت به تامین‌کننده یا سایر اشخاص", "پرداخت"],
  ["هزینه کردم", "هزینه روزانه را با مدرک ثبت کن", "هزینه"],
  ["طلب و بدهی", "مانده اشخاص و سررسیدها را ببین", "مانده"],
];

export default function SimpleAccountingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 border-b border-black/5 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black text-[#008f87]">حالت ساده</div>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">امروز در کسب‌وکارت چه اتفاقی افتاد؟</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#657184]">اتفاق را انتخاب کن؛ تسوین اطلاعات لازم را مرحله‌به‌مرحله می‌پرسد و ثبت حسابداری متوازن را پشت صحنه می‌سازد.</p>
          </div>
          <Link href="/accounting" className="text-sm font-black text-[#007d75]">بازگشت به حسابداری</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map(([title, description, label]) => (
            <article key={title} className="group rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_14px_45px_rgba(15,34,61,.05)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#eafaf8] px-3 py-1.5 text-xs font-black text-[#007d75]">{label}</span>
                <span aria-hidden className="text-xl text-[#8a96a8]">←</span>
              </div>
              <h2 className="mt-7 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#657184]">{description}</p>
              <button type="button" className="mt-6 min-h-11 w-full rounded-2xl bg-[#0f223d] px-4 py-3 text-sm font-black text-white">شروع ثبت</button>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <section className="rounded-[28px] bg-[#0f223d] p-6 text-white sm:p-8">
            <div className="text-xs font-black text-[#63dfd4]">خلاصه قابل فهم</div>
            <h2 className="mt-3 text-2xl font-black">وضع مالی را بدون خواندن دفتر حسابداری بفهم.</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["فروش", "هزینه", "طلب", "بدهی"].map((item) => <div key={item} className="rounded-2xl bg-white/5 p-4 text-center text-sm font-black">{item}</div>)}
            </div>
            <p className="mt-5 text-sm leading-7 text-white/65">عددهای واقعی فقط از دفتر حسابداری فضای کاری خوانده می‌شوند؛ این صفحه داده نمایشی را به‌جای اطلاعات مالی واقعی نشان نمی‌دهد.</p>
          </section>
          <section className="rounded-[28px] border border-black/5 bg-white p-6 sm:p-8">
            <div className="text-xs font-black text-[#008f87]">نیاز به جزئیات داری؟</div>
            <h2 className="mt-3 text-xl font-black">حالت حرفه‌ای همان اطلاعات را با کنترل کامل نشان می‌دهد.</h2>
            <p className="mt-3 text-sm leading-7 text-[#657184]">سند، دفتر، حساب، مرکز هزینه و شواهد مالی باید از همان ثبت‌های حالت ساده قابل پیگیری باشند.</p>
            <Link href="/accounting/professional" className="mt-6 inline-flex min-h-11 items-center rounded-2xl border border-black/10 px-5 py-3 text-sm font-black">ورود به حالت حرفه‌ای</Link>
          </section>
        </div>
      </section>
    </main>
  );
}
