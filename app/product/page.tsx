import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "محصول",
  description: "تسوین چگونه درخواست‌های تسویه، شواهد مالی، وضعیت‌ها و تاریخچه عملیات را در یک مسیر شفاف مدیریت می‌کند.",
  alternates: { canonical: "/product" },
};

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-xs font-black text-[#008f87]">محصول تسوین</div>
        <h1 className="mt-3 text-4xl font-black leading-[1.4]">یک جریان واحد برای درخواست، بررسی، شواهد و وضعیت تسویه</h1>
        <p className="mt-5 text-base leading-8 text-[#5f6c7e]">تسوین تلاش می‌کند نقاط پراکنده عملیات مالی را به یک مسیر قابل پیگیری تبدیل کند؛ از ثبت درخواست تا مرور شواهد، وضعیت و تاریخچه رویدادها.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["درخواست", "ثبت مبلغ، ذی‌نفع، توضیح و زمینه عملیاتی."],
            ["بررسی", "مرور جزئیات و کنترل اطلاعات پیش از هر تأیید."],
            ["شواهد", "نگهداری رسید و مدارک به‌عنوان evidence، نه جایگزین تأیید بانکی."],
            ["تاریخچه", "ثبت وضعیت‌ها و رویدادها برای پیگیری و حسابرسی."],
          ].map(([title, text]) => (
            <section key={title} className="rounded-[24px] border border-black/5 bg-white p-5">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p>
            </section>
          ))}
        </div>
        <Link href="/demo" className="mt-8 inline-flex rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">مشاهده دمو</Link>
      </div>
    </main>
  );
}
