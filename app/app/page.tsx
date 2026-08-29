import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "محیط کاری تسویا",
  description: "پیش‌نمایش محیط کاری کسب‌وکار در تسویا.",
  robots: { index: false, follow: false },
};

const cards = [
  ["تسویه‌های باز", "۱۲", "PREVIEW"],
  ["نیازمند بررسی", "۴", "PREVIEW"],
  ["تامین‌کنندگان", "۲۸", "PLANNED DATA"],
  ["مغایرت‌ها", "۳", "PLANNED DATA"],
];

export default function WorkspacePreviewPage() {
  return (
    <main className="min-h-screen bg-[#eef3f8] text-[#0b1220]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-lg font-black">تسویا</div>
            <div className="text-[10px] text-[#6f7a8b]">Business Workspace Preview</div>
          </div>
          <Link href="/sign-in" className="rounded-xl border border-black/10 px-3 py-2 text-xs font-black">خروج</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-[#0f223d] p-6 text-white">
          <div className="text-xs font-black text-[#63dfd4]">Active Workspace</div>
          <h1 className="mt-2 text-2xl font-black">کسب‌وکار نمونه</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
            این صفحه فقط UI foundation برای workspace است. اعداد زیر داده نمایشی هستند و به دیتابیس Production متصل نیستند.
          </p>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([title, value, status]) => (
            <article key={title} className="rounded-3xl border border-black/5 bg-white p-5">
              <div className="text-[10px] font-black text-[#008f87]">{status}</div>
              <div className="mt-3 text-sm font-bold text-[#657184]">{title}</div>
              <div className="mt-2 text-3xl font-black">{value}</div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            ["مدیریت تسویه", "درخواست‌ها، وضعیت‌ها و تاریخچه عملیاتی."],
            ["تامین‌کنندگان", "پرونده ذی‌نفعان و سابقه تعامل مالی."],
            ["مغایرت‌گیری", "تطبیق شواهد معتبر با رویدادهای مالی."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-3xl bg-white p-6">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
