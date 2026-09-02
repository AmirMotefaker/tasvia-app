import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const rows = [
  ["K-1001", "کالای نمونه", "انبار مرکزی", "در انتظار داده", "—", "—"],
  ["K-1002", "خدمت نمونه", "بدون انبار", "در انتظار داده", "—", "—"],
];

export default function InventoryPage() {
  return (
    <WorkspaceShell title="کالا و انبار" eyebrow="کنترل موجودی" actions={<Link href="/app/inventory" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">+ کالای جدید</Link>}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[['ارزش موجودی','از دفتر انبار'],['کالاهای کم‌موجودی','پس از اتصال داده'],['ورودی این دوره','از رویداد واقعی'],['خروجی این دوره','از فروش و انتقال']].map(([a,b])=><article key={a} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">{a}</div><div className="mt-3 text-xl font-black">{b}</div></article>)}
      </section>
      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xs font-black text-[#0b8d85]">فهرست کالاها</div><h2 className="mt-1 text-xl font-black">موجودی و بهای تمام‌شده</h2></div><div className="flex gap-2"><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">فیلتر</button><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">خروجی</button></div></div>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-right text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['کد','نام','انبار','موجودی','میانگین بها','ارزش'].map(h=><th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r[0]} className="border-t border-slate-100">{r.map((c,i)=><td key={i} className="px-4 py-4 font-medium text-slate-700">{c}</td>)}</tr>)}</tbody></table></div>
      </section>
      <section className="mt-5 grid gap-4 lg:grid-cols-3"><article className="rounded-2xl bg-[#102845] p-5 text-white"><div className="text-xs font-black text-[#63dfd4]">کنترل منفی</div><h3 className="mt-2 font-black">خروج بدون موجودی کافی متوقف می‌شود</h3></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">انتقال</div><h3 className="mt-2 font-black">دو رویداد متناظر و قابل Audit</h3></article><article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">COGS</div><h3 className="mt-2 font-black">فروش کالا به بهای تمام‌شده متصل است</h3></article></section>
    </WorkspaceShell>
  );
}
