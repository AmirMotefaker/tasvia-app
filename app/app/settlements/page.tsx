import type { Metadata } from "next";
import Link from "next/link";
import { WorkspaceNav } from "../../../src/components/workspace/nav";

export const metadata: Metadata = {
  title: "مرکز تسویه‌ها",
  description: "مدیریت درخواست‌های تسویه با وضعیت، شواهد، Approval و سابقه تصمیم‌ها.",
  robots: { index: false, follow: false },
};

const stages = [
  ["درخواست جدید", "درخواست‌های ثبت‌شده که هنوز کنترل اولیه و شواهدشان بررسی نشده است."],
  ["در انتظار تأیید", "مواردی که به‌دلیل مبلغ، نقش یا سیاست Workspace نیازمند Approval هستند."],
  ["آماده اجرا", "درخواست‌هایی که از نظر داخلی آماده‌اند اما اجرای واقعی فقط با Provider مجاز انجام می‌شود."],
  ["تاریخچه", "تصمیم‌ها، تغییر وضعیت، شواهد و مرجع عملیات برای Audit و پیگیری."],
] as const;

export default function SettlementsPage() {
  return (
    <main className="min-h-screen bg-[#f3f6fa] text-[#0b1220]" dir="rtl">
      <header className="border-b border-black/5 bg-white"><div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8"><div className="mb-4 font-black">تسوین · محیط کاری</div><WorkspaceNav /></div></header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <article className="rounded-[30px] bg-white p-6 sm:p-8"><p className="text-xs font-black text-[#008f87]">Settlement Control Center</p><h1 className="mt-2 text-3xl font-black">مرکز تسویه‌ها</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-[#657184]">تسویه در تسوین یک workflow کنترل‌شده است، نه یک دکمه انتقال پول. درخواست، شواهد، Approval، وضعیت اجرا و Audit باید قبل از هر اتصال بانکی واقعی قابل پیگیری باشند.</p></article>
          <Link href="/settlements/new" className="flex min-h-44 flex-col justify-between rounded-[30px] bg-[#62ddd2] p-6 text-[#0f223d]"><span className="text-xs font-black">شروع workflow</span><span className="text-xl font-black">درخواست تسویه جدید ←</span></Link>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stages.map(([title, description]) => <article key={title} className="rounded-3xl border border-black/5 bg-white p-5"><div className="text-sm font-black">{title}</div><p className="mt-3 text-sm leading-7 text-[#687487]">{description}</p><div className="mt-5 rounded-xl bg-[#f7f9fc] px-3 py-2 text-xs font-bold text-[#687487]">فقط از رکوردهای واقعی Workspace</div></article>)}
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          <Link href="/app/suppliers" className="rounded-3xl border border-black/5 bg-white p-6"><div className="text-xs font-black text-[#008f87]">ذی‌نفع</div><h2 className="mt-2 font-black">پرونده تأمین‌کننده</h2><p className="mt-3 text-sm leading-7 text-[#687487]">قبل از تسویه، بدهی و اسناد منبع را از پرونده ذی‌نفع بررسی کنید.</p></Link>
          <Link href="/app/reconciliation" className="rounded-3xl border border-black/5 bg-white p-6"><div className="text-xs font-black text-[#008f87]">بعد از اجرا</div><h2 className="mt-2 font-black">مغایرت‌گیری</h2><p className="mt-3 text-sm leading-7 text-[#687487]">نتیجه عملیات و شواهد بانکی باید بعداً با رکورد داخلی تطبیق داده شوند.</p></Link>
          <Link href="/app/platform-controls" className="rounded-3xl bg-[#0f223d] p-6 text-white"><div className="text-xs font-black text-[#63dfd4]">کنترل نهایی</div><h2 className="mt-2 font-black">Approval و Provider</h2><p className="mt-3 text-sm leading-7 text-white/65">اجرای واقعی فقط با سیاست دسترسی، تأیید لازم و Provider مجاز محیط Production فعال خواهد شد.</p></Link>
        </section>
      </div>
    </main>
  );
}
