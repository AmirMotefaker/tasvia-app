import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { buildInventoryProjection } from "../../../src/application/accounting/inventory-projection";

function money(value: bigint) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

function quantity(value: bigint, unit: string) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ${unit}`;
}

export default async function InventoryPage() {
  const current = await requireCurrentWorkspace();
  const projection = await buildInventoryProjection(current.workspace.id);

  const metrics = [
    ["ارزش موجودی", money(projection.totalValue)],
    ["کالاهای کم‌موجودی", `${new Intl.NumberFormat("fa-IR").format(projection.lowStockCount)} مورد`],
    ["ورودی ثبت‌شده", new Intl.NumberFormat("fa-IR").format(projection.totalInbound)],
    ["خروجی ثبت‌شده", new Intl.NumberFormat("fa-IR").format(projection.totalOutbound)],
  ];

  return (
    <WorkspaceShell title="کالا و انبار" eyebrow="دفتر واقعی موجودی" actions={<Link href="/app/inventory" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-500">تعریف کالا و انبار در مرحله بعد</Link>}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold text-slate-500">{label}</div>
            <div className="mt-3 text-xl font-black text-[#102845]">{value}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <div>
          <div className="text-xs font-black text-[#0b8d85]">فهرست کالاها</div>
          <h2 className="mt-1 text-xl font-black">موجودی و بهای میانگین</h2>
        </div>

        {projection.rows.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-sm leading-7 text-slate-500">
            هنوز کالا، انبار یا گردش موجودی ثبت‌شده‌ای در این فضای کاری وجود ندارد. این صفحه دیگر داده نمونه نمایش نمی‌دهد.
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[840px] text-right text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500"><tr>{["کد","نام","انبار","موجودی","میانگین بها","ارزش","وضعیت"].map((header) => <th key={header} className="px-4 py-3 font-black">{header}</th>)}</tr></thead>
              <tbody>
                {projection.rows.map((row) => (
                  <tr key={`${row.itemId}:${row.warehouseId}`} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-medium text-slate-700">{row.sku ?? "—"}</td>
                    <td className="px-4 py-4 font-black text-[#26354a]">{row.name}</td>
                    <td className="px-4 py-4 text-slate-600">{row.warehouseName}</td>
                    <td className="px-4 py-4 text-slate-700">{quantity(row.quantity, row.unit)}</td>
                    <td className="px-4 py-4 text-slate-700">{money(row.averageUnitCost)}</td>
                    <td className="px-4 py-4 font-black text-[#102845]">{money(row.value)}</td>
                    <td className="px-4 py-4"><span className={`rounded-lg px-2.5 py-1.5 text-xs font-black ${row.lowStock ? "bg-amber-50 text-amber-700" : "bg-[#eef8f7] text-[#0b8d85]"}`}>{row.lowStock ? "کم‌موجودی" : "عادی"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl bg-[#102845] p-5 text-white"><div className="text-xs font-black text-[#63dfd4]">کنترل منفی</div><h3 className="mt-2 font-black">خروج بدون موجودی کافی در Application Layer متوقف می‌شود</h3></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">دفتر حرکت</div><h3 className="mt-2 font-black">تمام موجودی از StockMovement محاسبه می‌شود</h3></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">ارزش‌گذاری</div><h3 className="mt-2 font-black">بهای میانگین موزون از گردش واقعی محاسبه می‌شود</h3></article>
      </section>
    </WorkspaceShell>
  );
}
