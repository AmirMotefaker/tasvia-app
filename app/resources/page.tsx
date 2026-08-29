import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "منابع",
  description: "راهنماها و محتوای آموزشی تسویا درباره عملیات تسویه و شفافیت مالی.",
  alternates: { canonical: "/resources" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">مرکز منابع تسویا</h1>
        <p className="mt-4 text-base leading-8 text-[#5f6c7e]">بنیان محتوایی برای آموزش شفافیت مالی، عملیات تسویه، کنترل داخلی و یکپارچه‌سازی‌های آینده.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link href="/faq" className="rounded-3xl bg-white p-6"><div className="text-lg font-black">سوالات متداول</div><p className="mt-2 text-sm text-[#657184]">پاسخ‌های کوتاه و قابل استناد درباره وضعیت محصول.</p></Link>
          <Link href="/compare/variza" className="rounded-3xl bg-white p-6"><div className="text-lg font-black">مقایسه تسویا و واریزا</div><p className="mt-2 text-sm text-[#657184]">مقایسه دامنه محصول با برچسب وضعیت قابلیت‌ها.</p></Link>
        </div>
      </div>
    </main>
  );
}
