import type { Metadata } from "next";
import Link from "next/link";
import { WorkspaceNav } from "../../../src/components/workspace/nav";

export const metadata: Metadata = {
  title: "مغایرت‌گیری",
  description: "صف بررسی مغایرت‌های خزانه و پرداخت با شواهد، دلیل و اقدام بعدی.",
  robots: { index: false, follow: false },
};

const queues = [
  ["نیازمند تطبیق", "تراکنش‌هایی که هنوز تطابق کافی با فاکتور، پرداخت یا سند ندارند."],
  ["نیازمند مدرک", "عملیاتی که برای تصمیم مالی به رسید، صورتحساب یا مرجع Provider نیاز دارند."],
  ["نیازمند تصمیم", "مواردی که داده کافی دارند اما تأیید انسانی یا Approval لازم است."],
  ["حل‌شده", "مواردی که دلیل مغایرت، تصمیم و مرجع حل آن‌ها ثبت شده است."],
] as const;

export default function ReconciliationPage() {
  return (
    <main className="min-h-screen bg-[#f3f6fa] text-[#0b1220]" dir="rtl">
      <header className="border-b border-black/5 bg-white"><div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8"><div className="mb-4 font-black">تسوین · محیط کاری</div><WorkspaceNav /></div></header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <article className="rounded-[30px] bg-white p-6 sm:p-8"><p className="text-xs font-black text-[#008f87]">کنترل و تطبیق</p><h1 className="mt-2 text-3xl font-black">مغایرت‌گیری</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-[#657184]">هر مغایرت باید از «تراکنش مبهم» به یک تصمیم قابل دفاع برسد: شواهد، تطابق احتمالی، دلیل تصمیم و ردپای کاربر. تسوین بدون داده بانکی معتبر هیچ موردی را «تأیید بانکی» اعلام نمی‌کند.</p></article>
          <Link href="/app/treasury" className="flex min-h-44 flex-col justify-between rounded-[30px] bg-[#62ddd2] p-6 text-[#0f223d]"><span className="text-xs font-black">منبع اصلی</span><span className="text-xl font-black">باز کردن خزانه ←</span></Link>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {queues.map(([title, description]) => <article key={title} className="rounded-3xl border border-black/5 bg-white p-5"><div className="text-sm font-black">{title}</div><p className="mt-3 text-sm leading-7 text-[#687487]">{description}</p><div className="mt-5 rounded-xl bg-[#f7f9fc] px-3 py-2 text-xs font-bold text-[#687487]">نمایش فقط از داده واقعی Workspace</div></article>)}
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-black/5 bg-white p-6"><div className="text-xs font-black text-[#008f87]">۱. جمع‌آوری شواهد</div><h2 className="mt-2 font-black">مرجع را پیدا کن</h2><p className="mt-3 text-sm leading-7 text-[#687487]">شناسه پرداخت، مبلغ، زمان، حساب، فاکتور، رسید و مرجع Provider در یک پرونده کنار هم قرار می‌گیرند.</p></article>
          <article className="rounded-3xl border border-black/5 bg-white p-6"><div className="text-xs font-black text-[#008f87]">۲. پیشنهاد تطبیق</div><h2 className="mt-2 font-black">هوش مالی توضیح می‌دهد</h2><p className="mt-3 text-sm leading-7 text-[#687487]">سیستم می‌تواند تطابق محتمل را پیشنهاد و دلیل آن را توضیح دهد، اما نتیجه حساس را خودکار قطعی نمی‌کند.</p></article>
          <article className="rounded-3xl bg-[#0f223d] p-6 text-white"><div className="text-xs font-black text-[#63dfd4]">۳. تصمیم و Audit</div><h2 className="mt-2 font-black">تصمیم قابل پیگیری</h2><p className="mt-3 text-sm leading-7 text-white/65">تأیید، رد یا ارجاع باید همراه با کاربر، زمان، دلیل و مرجع شواهد ثبت شود.</p></article>
        </section>
      </div>
    </main>
  );
}
