import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تماس و دسترسی اولیه",
  description: "برای دسترسی اولیه، پایلوت یا همکاری محصول با تسویا در ارتباط باشید.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border border-black/5 bg-white p-6 sm:p-8">
          <div className="text-xs font-black text-[#008f87]">ارتباط با تسویا</div>
          <h1 className="mt-3 text-3xl font-black">برای پایلوت و دسترسی اولیه آماده گفتگو هستیم.</h1>
          <p className="mt-4 text-sm leading-7 text-[#657184]">فرم تماس و CRM در Sprint جداگانه متصل می‌شود. تا آن زمان این صفحه صرفاً نقطه رسمی اعلام علاقه‌مندی است.</p>
          <Link href="/demo" className="mt-6 inline-flex rounded-2xl border border-black/10 px-5 py-3 text-sm font-black">مشاهده دمو محصول</Link>
        </div>
      </div>
    </main>
  );
}
