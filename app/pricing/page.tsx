import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تعرفه و مدل ارائه",
  description: "مدل ارائه شفاف تسوین برای پایلوت، تیم‌های مالی و کسب‌وکارهای در حال رشد.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    name: "پایلوت",
    tag: "برای شروع کنترل‌شده",
    items: ["راه‌اندازی اولیه محیط کاری", "گردش‌کار تسویه و شواهد", "بازخورد مستقیم محصول", "بدون عملیات واقعی بانکی"],
  },
  {
    name: "کسب‌وکار",
    tag: "مدل هدف",
    items: ["چند کاربر و نقش‌های عملیاتی", "تأمین‌کنندگان و مغایرت‌گیری", "گزارش‌های مدیریتی", "کنترل‌های دسترسی و audit trail"],
  },
  {
    name: "سازمانی",
    tag: "برای عملیات پیچیده",
    items: ["چند واحد یا شعبه", "کنترل‌های سفارشی", "یکپارچه‌سازی‌های تأییدشده", "پشتیبانی و SLA پس از عرضه"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-14 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="text-xs font-black text-[#008f87]">مدل ارائه</div>
          <h1 className="mt-3 text-4xl font-black leading-[1.35]">قیمت‌گذاری شفاف، بدون وعده‌ای که هنوز آماده نیست.</h1>
          <p className="mt-5 text-base leading-8 text-[#657184]">
            تسوین هنوز در مرحله دسترسی اولیه است. عدد نهایی تعرفه عمومی بعد از تثبیت دامنه محصول منتشر می‌شود؛ اما ساختار ارائه از همین حالا روشن است.
          </p>
        </div>
        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-[28px] border border-black/5 bg-white p-6">
              <div className="text-[11px] font-black text-[#008f87]">{plan.tag}</div>
              <h2 className="mt-2 text-2xl font-black">{plan.name}</h2>
              <div className="mt-5 space-y-3">
                {plan.items.map((item) => <div key={item} className="rounded-2xl bg-[#f6f8fb] p-3 text-sm font-bold text-[#4f5d70]">{item}</div>)}
              </div>
            </article>
          ))}
        </section>
        <div className="mt-8 rounded-[28px] bg-[#0f223d] p-6 text-white sm:flex sm:items-center sm:justify-between">
          <div><div className="text-sm font-black">برای پایلوت واقعی آماده‌اید؟</div><p className="mt-2 text-sm text-white/65">دامنه قیمت‌گذاری بر اساس اندازه عملیات و نیازهای واقعی مشخص می‌شود.</p></div>
          <Link href="/contact" className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#0f223d] sm:mt-0">درخواست دسترسی</Link>
        </div>
      </div>
    </main>
  );
}
