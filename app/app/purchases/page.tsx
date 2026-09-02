import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const rows = [
  ["PUR-—", "تأمین‌کننده", "—", "در انتظار داده", "—"],
  ["PUR-—", "خرید خدمت", "—", "در انتظار داده", "—"],
];

export default function PurchasesPage() {
  return (
    <WorkspaceShell title="خرید" eyebrow="خرید و پرداخت" actions={<Link href="/app/purchases" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">+ فاکتور خرید</Link>}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[['خرید دوره','از اسناد واقعی'],['بدهی باز','از تأمین‌کنندگان'],['سررسید نزدیک','در انتظار داده'],['مالیات خرید','از دفتر مالیاتی']].map(([a,b])=><article key={a} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">{a}</div><div className="mt-3 text-xl font-black">{b}</div></article>)}
      </section>
      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xs font-black text-[#0b8d85]">اسناد خرید</div><h2 className="mt-1 text-xl font-black">فاکتور، بدهی و ورود انبار</h2></div><div className="flex gap-2"><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">فیلتر</button><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">سررسیدها</button></div></div>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-right text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['شماره','تأمین‌کننده','مبلغ','وضعیت','سررسید'].map(h=><th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i} className="border-t border-slate-100">{r.map((c,j)=><td key={j} className="px-4 py-4 font-medium text-slate-700">{c}</td>)}</tr>)}</tbody></table></div>
      </section>
      <section className="mt-5 grid gap-4 lg:grid-cols-3"><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">کالا</div><h3 className="mt-2 font-black">خرید کالا به ورود انبار متصل است</h3></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">خدمت</div><h3 className="mt-2 font-black">خرید خدمت به هزینه متصل می‌شود</h3></article><article className="rounded-2xl bg-[#102845] p-5 text-white"><div className="text-xs font-black text-[#63dfd4]">کنترل سه‌دفتر</div><h3 className="mt-2 font-black">بدهی، موجودی/هزینه و حسابداری باید هم‌زمان سازگار بمانند</h3></article></section>
    </WorkspaceShell>
  );
}
