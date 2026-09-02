import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const queues = [
  ["درخواست جدید", "در انتظار داده", "کنترل اولیه"],
  ["در انتظار تأیید", "در انتظار داده", "Approval"],
  ["آماده اجرا", "در انتظار داده", "Provider خاموش"],
  ["تاریخچه", "از Audit", "قابل پیگیری"],
];

export default function SettlementsPage() {
  return (
    <WorkspaceShell title="مرکز تسویه‌ها" eyebrow="Settlement Control Center" actions={<Link href="/settlements/new" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">+ درخواست تسویه</Link>}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{queues.map(([a,b,c])=><article key={a} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">{a}</div><div className="mt-3 text-xl font-black">{b}</div><div className="mt-2 text-xs font-black text-[#0b8d85]">{c}</div></article>)}</section>
      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xs font-black text-[#0b8d85]">صف عملیات</div><h2 className="mt-1 text-xl font-black">درخواست‌ها و وضعیت تصمیم</h2></div><div className="flex gap-2"><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">همه وضعیت‌ها</button><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">فیلتر مبلغ</button></div></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-right text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['شناسه','ذی‌نفع','مبلغ','وضعیت','تأیید','مرجع'].map(h=><th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr></thead><tbody><tr className="border-t border-slate-100"><td colSpan={6} className="px-4 py-10 text-center text-sm font-bold text-slate-400">هنوز رکورد واقعی برای این Workspace ثبت نشده است.</td></tr></tbody></table></div></section>
      <section className="mt-5 grid gap-4 lg:grid-cols-3"><Link href="/app/suppliers" className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">قبل از تسویه</div><h3 className="mt-2 font-black">بدهی و سند منبع را ببین</h3></Link><Link href="/app/reconciliation" className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">بعد از اجرا</div><h3 className="mt-2 font-black">با شواهد تطبیق بده</h3></Link><article className="rounded-2xl bg-[#102845] p-5 text-white"><div className="text-xs font-black text-[#63dfd4]">حالت امن</div><h3 className="mt-2 font-black">هیچ انتقال وجهی بدون Provider مجاز انجام نمی‌شود</h3></article></section>
    </WorkspaceShell>
  );
}
