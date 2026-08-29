import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تعرفه",
  description: "اطلاعات دسترسی اولیه و مدل ارائه تسویا برای پایلوت‌های کسب‌وکاری.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border border-black/5 bg-white p-6 sm:p-8">
          <div className="text-xs font-black text-[#008f87]">Early Access</div>
          <h1 className="mt-3 text-3xl font-black">تعرفه عمومی هنوز نهایی نشده است.</h1>
          <p className="mt-4 text-sm leading-7 text-[#657184]">در این مرحله تمرکز تسویا روی پایلوت محصول، اعتبارسنجی جریان‌های عملیاتی و همکاری با کسب‌وکارهای منتخب است. قیمت‌گذاری عمومی پس از تثبیت دامنه محصول منتشر می‌شود.</p>
          <Link href="/contact" className="mt-6 inline-flex rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">درخواست دسترسی اولیه</Link>
        </div>
      </div>
    </main>
  );
}
