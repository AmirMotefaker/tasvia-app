import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "./lead-form";

export const metadata: Metadata = {
  title: "تماس و درخواست پایلوت",
  description: "درخواست پایلوت و دسترسی اولیه به تسویا برای تیم‌های مالی و کسب‌وکارها.",
  alternates: { canonical: "/contact" },
};

const paths = [
  ["پایلوت کسب‌وکار", "برای ارزیابی گردش‌کار تسویه و کنترل عملیات در یک سناریوی محدود."],
  ["همکاری محصول", "برای کسب‌وکارها و تیم‌هایی که مسئله واقعی در تسویه، شواهد یا مغایرت‌گیری دارند."],
  ["یکپارچه‌سازی آینده", "برای بررسی فنی API، داده و اتصال‌های معتبر پس از آماده‌شدن لایه Production."],
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-14 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="rounded-[32px] bg-[#0f223d] p-7 text-white sm:p-10">
              <div className="text-xs font-black text-[#63dfd4]">ارتباط با تسویا</div>
              <h1 className="mt-3 text-4xl font-black leading-[1.4]">از یک مسئله واقعی مالی شروع کنیم.</h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-white/65">
                در دسترسی اولیه، هدف فروش یک وعده نیست؛ مسئله عملیاتی، گردش‌کار و معیار موفقیت پایلوت را مشخص می‌کنیم.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/demo" className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#0f223d]">مشاهده دمو</Link>
                <Link href="/security" className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black">مدل امنیت</Link>
              </div>
            </div>

            <aside className="rounded-[28px] border border-black/5 bg-white p-6">
              <div className="text-sm font-black">فرآیند دسترسی اولیه</div>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-[#657184]">
                <li><b className="text-[#0b1220]">۱.</b> تعریف مسئله و حجم عملیات</li>
                <li><b className="text-[#0b1220]">۲.</b> انتخاب دامنه محدود پایلوت</li>
                <li><b className="text-[#0b1220]">۳.</b> ارزیابی نتیجه قبل از هر اتصال مالی واقعی</li>
              </ol>
            </aside>
          </div>

          <LeadForm />
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {paths.map(([title, text]) => (
            <article key={title} className="rounded-[26px] bg-white p-6">
              <h2 className="font-black">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
