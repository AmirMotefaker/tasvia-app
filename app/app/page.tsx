import type { Metadata } from "next";
import Link from "next/link";
import { WorkspaceNav } from "../../src/components/workspace/nav";

export const metadata: Metadata = {
  title: "داشبورد کسب‌وکار",
  description: "محیط کاری مدیریت عملیات تسویه و مالی.",
  robots: { index: false, follow: false },
};

const metrics = [
  ["درخواست‌های باز","۱۲","در جریان بررسی"],
  ["نیازمند اقدام","۴","اولویت امروز"],
  ["تأمین‌کنندگان","۲۸","پرونده فعال"],
  ["مغایرت‌ها","۳","نیازمند تطبیق"],
];
const activity = [
  ["تسویه فروشگاه مرکزی","در انتظار بررسی","امروز، ۱۰:۴۰"],
  ["فاکتور تأمین‌کننده لبنیات","شواهد تکمیل شد","امروز، ۰۹:۱۵"],
  ["مغایرت شعبه ونک","نیازمند اقدام","دیروز، ۱۸:۲۰"],
];

export default function WorkspacePage(){
 return <main className="min-h-screen bg-[#f3f6fa] text-[#0b1220]">
  <header className="border-b border-black/5 bg-white">
   <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between gap-4">
     <div><div className="text-lg font-black">تسویا</div><div className="text-[11px] text-[#6f7a8b]">مرکز عملیات مالی</div></div>
     <Link href="/sign-in" className="rounded-xl border border-black/10 px-3 py-2 text-xs font-black">حساب کاربری</Link>
    </div>
    <div className="mt-4"><WorkspaceNav /></div>
   </div>
  </header>
  <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
   <section className="grid gap-4 lg:grid-cols-[1.5fr_.5fr]">
    <div className="rounded-[28px] bg-[#0f223d] p-6 text-white sm:p-8">
     <div className="text-xs font-black text-[#63dfd4]">کسب‌وکار نمونه · نمای عملیاتی</div>
     <h1 className="mt-3 text-3xl font-black">صبح بخیر؛ وضعیت مالی امروز آماده بررسی است.</h1>
     <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">یک نمای واحد برای پیگیری درخواست‌ها، شواهد، ذی‌نفعان و مغایرت‌ها. داده‌های این نسخه نمایشی‌اند و انتقال وجه واقعی انجام نمی‌شود.</p>
    </div>
    <Link href="/settlements/new" className="flex min-h-40 flex-col justify-between rounded-[28px] bg-[#62ddd2] p-6 text-[#0f223d]">
     <span className="text-xs font-black">اقدام سریع</span><span className="text-xl font-black">درخواست تسویه جدید ←</span>
    </Link>
   </section>
   <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {metrics.map(([a,b,c])=><article key={a} className="rounded-3xl border border-black/5 bg-white p-5"><div className="text-xs font-bold text-[#687487]">{a}</div><div className="mt-2 text-3xl font-black">{b}</div><div className="mt-2 text-[11px] font-bold text-[#008f87]">{c}</div></article>)}
   </section>
   <section className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
    <article className="rounded-3xl bg-white p-5 sm:p-6">
     <div className="flex items-center justify-between"><h2 className="text-lg font-black">فعالیت‌های اخیر</h2><Link href="/app/settlements" className="text-xs font-black text-[#008f87]">همه تسویه‌ها</Link></div>
     <div className="mt-4 divide-y divide-black/5">{activity.map(([a,b,c])=><div key={a} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto]"><div><div className="text-sm font-black">{a}</div><div className="mt-1 text-xs text-[#697587]">{b}</div></div><div className="text-xs text-[#8a94a3]">{c}</div></div>)}</div>
    </article>
    <article className="rounded-3xl bg-white p-5 sm:p-6"><h2 className="text-lg font-black">کنترل امروز</h2><div className="mt-4 space-y-3 text-sm">{["۴ مورد نیازمند بررسی","۳ مغایرت باز","۲ پرونده بدون مدرک کافی"].map(x=><div key={x} className="rounded-2xl bg-[#f5f8fb] p-4 font-bold">{x}</div>)}</div></article>
   </section>
  </div>
 </main>
}
