import type { Metadata } from "next";
import Link from "next/link";
import { WorkspaceNav } from "../../../src/components/workspace/nav";

export const metadata: Metadata = {
  title: "تأمین‌کنندگان",
  description: "مدیریت تأمین‌کننده، بدهی، اسناد خرید، پرداخت و سابقه مالی.",
  robots: { index: false, follow: false },
};

const workflows = [
  ["ثبت خرید", "/app/purchases", "فاکتور خرید، مالیات، بدهی و اثر حسابداری را از یک مسیر ثبت کنید."],
  ["پرداخت و خزانه", "/app/treasury", "پرداخت به تأمین‌کننده، بانک، صندوق، چک و شواهد پرداخت را مدیریت کنید."],
  ["طلب و بدهی", "/accounting/simple/balances", "مانده باز هر ذی‌نفع را بدون نیاز به ورود به جزئیات دفتر کل ببینید."],
  ["تسویه", "/app/settlements", "درخواست‌های تسویه، وضعیت بررسی و سابقه تصمیم‌ها را پیگیری کنید."],
] as const;

export default function SuppliersPage() {
  return (
    <main className="min-h-screen bg-[#f3f6fa] text-[#0b1220]" dir="rtl">
      <header className="border-b border-black/5 bg-white"><div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8"><div className="mb-4 font-black">تسوین · محیط کاری</div><WorkspaceNav /></div></header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[30px] bg-white p-6 sm:p-8">
          <p className="text-xs font-black text-[#008f87]">حساب‌های پرداختنی</p>
          <h1 className="mt-2 text-3xl font-black">تأمین‌کنندگان</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657184]">هر تأمین‌کننده باید یک پرونده مالی قابل ردیابی داشته باشد: خریدها، بدهی باز، پرداخت‌ها، چک‌ها، مدارک و تسویه‌ها. تا زمانی که دیتای واقعی Workspace متصل نباشد، تسوین عدد نمایشی تولید نمی‌کند.</p>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {workflows.map(([title, href, description]) => <Link key={href} href={href} className="rounded-3xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#008f87]/25"><h2 className="font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-[#687487]">{description}</p><div className="mt-4 text-xs font-black text-[#008f87]">باز کردن ←</div></Link>)}
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl bg-[#0f223d] p-6 text-white"><div className="text-xs font-black text-[#63dfd4]">پرونده تأمین‌کننده</div><h2 className="mt-2 text-xl font-black">یک نمای واحد از همکاری</h2><p className="mt-3 text-sm leading-7 text-white/65">اطلاعات هویتی، شرایط پرداخت، اسناد خرید، پرداخت‌ها و مانده باز باید از یک پرونده قابل Drill-down باشند.</p></article>
          <article className="rounded-3xl border border-black/5 bg-white p-6"><div className="text-xs font-black text-[#008f87]">سررسیدها</div><h2 className="mt-2 text-xl font-black">بدهی بدون غافلگیری</h2><p className="mt-3 text-sm leading-7 text-[#687487]">هشدار سررسید باید به فاکتور و مدرک منبع متصل باشد، نه فقط یک عدد بدون زمینه.</p></article>
          <article className="rounded-3xl border border-black/5 bg-white p-6"><div className="text-xs font-black text-[#008f87]">کنترل پرداخت</div><h2 className="mt-2 text-xl font-black">تأیید قبل از اقدام حساس</h2><p className="mt-3 text-sm leading-7 text-[#687487]">پرداخت واقعی و تسویه بانکی فقط پس از اتصال Provider و کنترل دسترسی/Approval محیط عملیاتی فعال می‌شود.</p></article>
        </section>
      </div>
    </main>
  );
}
