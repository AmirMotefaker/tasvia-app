import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const rows = [
  ["فروش نقدی", "مشتری", "در انتظار داده", "—", "آماده"],
  ["فروش اعتباری", "مشتری", "در انتظار داده", "—", "آماده"],
  ["برگشت از فروش", "مشتری", "در انتظار داده", "—", "کنترل‌شده"],
];

export default function SalesPage() {
  return (
    <WorkspaceShell
      eyebrow="فروش و دریافتنی"
      title="فاکتورهای فروش"
      actions={<Link href="/accounting/simple/sale" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">فاکتور جدید +</Link>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["فروش دوره", "در انتظار داده"],
          ["فاکتورهای باز", "در انتظار داده"],
          ["مطالبات", "در انتظار داده"],
          ["میانگین وصول", "در انتظار داده"],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <div className="text-xs font-black text-[#6c798c]">{label}</div>
            <div className="mt-4 text-xl font-black text-[#102845]">{value}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black text-[#0b8d85]">دفتر فروش</div>
            <h2 className="mt-1 text-lg font-black text-[#102845]">فاکتورها و وضعیت وصول</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#526177]">فیلتر</button>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#526177]">همه وضعیت‌ها</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-xs">
            <thead className="bg-[#f8fafc] text-[#66758a]"><tr><th className="px-5 py-3">نوع</th><th className="px-5 py-3">طرف حساب</th><th className="px-5 py-3">مبلغ</th><th className="px-5 py-3">سررسید</th><th className="px-5 py-3">وضعیت</th><th className="px-5 py-3">عملیات</th></tr></thead>
            <tbody>
              {rows.map(([type, party, amount, due, status]) => (
                <tr key={type} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-black text-[#26354a]">{type}</td>
                  <td className="px-5 py-4 text-[#6f7d90]">{party}</td>
                  <td className="px-5 py-4 text-[#6f7d90]">{amount}</td>
                  <td className="px-5 py-4 text-[#6f7d90]">{due}</td>
                  <td className="px-5 py-4"><span className="rounded-lg bg-[#eef8f7] px-2.5 py-1.5 font-black text-[#0b8d85]">{status}</span></td>
                  <td className="px-5 py-4"><button aria-label="عملیات" className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-black text-[#526177]">•••</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-[11px] text-[#7b8899]">
          <span>داده‌های واقعی پس از انتخاب فضای کاری نمایش داده می‌شوند.</span>
          <span>۱ / ۱</span>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        {[
          ["فاکتور", "مشتری، کالا/خدمت، تخفیف، مالیات و سررسید در یک جریان."],
          ["وصول", "دریافت وجه به مطالبات باز تخصیص داده می‌شود."],
          ["برگشت", "Credit Note مانده مشتری و ثبت حسابداری را کنترل‌شده اصلاح می‌کند."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-black text-[#102845]">{title}</div>
            <p className="mt-2 text-xs leading-6 text-[#748195]">{description}</p>
          </article>
        ))}
      </section>
    </WorkspaceShell>
  );
}
