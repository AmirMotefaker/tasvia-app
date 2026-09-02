import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const queues = [
  ["نیازمند تطبیق", "در انتظار داده"],
  ["نیازمند مدرک", "در انتظار داده"],
  ["نیازمند تصمیم", "در انتظار داده"],
  ["حل‌شده", "از Audit"],
];

export default function ReconciliationPage() {
  return (
    <WorkspaceShell title="مغایرت‌گیری" eyebrow="کنترل و تطبیق" actions={<Link href="/app/treasury" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black">باز کردن خزانه</Link>}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{queues.map(([a,b])=><article key={a} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">{a}</div><div className="mt-3 text-xl font-black">{b}</div></article>)}</section>
      <section className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5"><div><div className="text-xs font-black text-[#0b8d85]">صف بررسی</div><h2 className="mt-1 text-xl font-black">شواهد، تطابق و تصمیم</h2></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[720px] text-right text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['مرجع','مبلغ','تاریخ','تطابق پیشنهادی','اطمینان','اقدام'].map(h=><th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr></thead><tbody><tr className="border-t border-slate-100"><td colSpan={6} className="px-4 py-10 text-center font-bold text-slate-400">برای شروع، تراکنش و شواهد واقعی Workspace لازم است.</td></tr></tbody></table></div></article>
        <article className="rounded-3xl bg-[#102845] p-5 text-white"><div className="text-xs font-black text-[#63dfd4]">فرآیند کنترل‌شده</div><div className="mt-5 space-y-3">{[['۱','جمع‌آوری شواهد'],['۲','پیشنهاد تطبیق'],['۳','تصمیم انسانی'],['۴','ثبت Audit']].map(([n,t])=><div key={n} className="flex items-center gap-3 rounded-2xl bg-white/7 p-4"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#63dfd4] font-black text-[#102845]">{n}</span><span className="text-sm font-black">{t}</span></div>)}</div><p className="mt-5 text-xs leading-6 text-white/55">بدون داده بانکی معتبر، هیچ رکوردی «تأیید بانکی» اعلام نمی‌شود.</p></article>
      </section>
      <section className="mt-5 grid gap-4 lg:grid-cols-3"><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">شواهد</div><h3 className="mt-2 font-black">رسید، زمان، مبلغ و مرجع</h3></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">هوش مالی</div><h3 className="mt-2 font-black">پیشنهاد می‌دهد؛ قطعی نمی‌کند</h3></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">Audit</div><h3 className="mt-2 font-black">کاربر، زمان و دلیل تصمیم ثبت می‌شود</h3></article></section>
    </WorkspaceShell>
  );
}
