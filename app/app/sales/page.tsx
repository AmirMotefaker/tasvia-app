import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { listSales, listSalesOptions } from "../../../src/application/sales/sales-service";
import { SalesForm } from "./sales-form";
import { approveSaleAction, postSaleAction, submitSaleAction } from "./actions";

const money = (value: bigint) => `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
const statusLabel: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  SUBMITTED: "ارسال‌شده",
  APPROVED: "تأییدشده",
  POSTED: "ثبت مالی",
  PAID: "وصول‌شده",
  CANCELLED: "لغوشده",
};

export default async function SalesPage() {
  const current = await requireCurrentWorkspace();
  const [options, sales] = await Promise.all([
    listSalesOptions(current.workspace.id),
    listSales(current.workspace.id),
  ]);

  const posted = sales.filter((sale) => ["POSTED", "PAID"].includes(sale.status));
  const revenue = posted.reduce((sum, sale) => sum + sale.total, 0n);
  const cogs = posted.reduce((sum, sale) => sum + sale.cogsTotal, 0n);

  return (
    <WorkspaceShell eyebrow="فروش، موجودی و دریافتنی" title="فروش">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["فروش ثبت‌شده", money(revenue)],
          ["بهای تمام‌شده", money(cogs)],
          ["سود ناخالص", money(revenue - cogs)],
          ["تعداد اسناد", new Intl.NumberFormat("fa-IR").format(sales.length)],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <div className="text-xs font-bold text-slate-500">{label}</div>
            <div className="mt-3 text-xl font-black text-[#102845]">{value}</div>
          </article>
        ))}
      </section>

      <section className="mt-5">
        <div className="mb-3">
          <div className="text-xs font-black text-[#0b8d85]">ثبت فروش واقعی</div>
          <h2 className="mt-1 text-xl font-black text-[#102845]">فاکتور جدید</h2>
        </div>
        <SalesForm customers={options.customers} warehouses={options.warehouses} items={options.items} />
      </section>

      <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
        <div className="border-b border-slate-100 p-5">
          <div className="text-xs font-black text-[#0b8d85]">اسناد فروش</div>
          <h2 className="mt-1 text-lg font-black text-[#102845]">چرخه پیش‌نویس تا وصول</h2>
        </div>

        {sales.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-sm font-black text-[#26354a]">هنوز فروشی ثبت نشده است.</div>
            <p className="mt-2 text-xs leading-6 text-[#8190a3]">اولین فاکتور را از فرم بالا بسازید؛ بعد از تأیید، موجودی، مطالبات و دفتر مالی هم‌زمان به‌روز می‌شوند.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>{["شماره", "مشتری", "مبلغ", "بهای تمام‌شده", "وضعیت", "عملیات"].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}</tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-black text-[#26354a]">{sale.invoiceNumber}</td>
                    <td className="px-4 py-4">{sale.customer.name}</td>
                    <td className="px-4 py-4 font-black">{money(sale.total)}</td>
                    <td className="px-4 py-4">{money(sale.cogsTotal)}</td>
                    <td className="px-4 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-black text-slate-600">{statusLabel[sale.status]}</span></td>
                    <td className="px-4 py-4">
                      {sale.status === "DRAFT" ? <form action={async () => { "use server"; await submitSaleAction(sale.id); }}><button className="rounded-lg border border-slate-200 px-3 py-2 font-black">ارسال</button></form> : null}
                      {sale.status === "SUBMITTED" ? <form action={async () => { "use server"; await approveSaleAction(sale.id); }}><button className="rounded-lg border border-slate-200 px-3 py-2 font-black">تأیید</button></form> : null}
                      {sale.status === "APPROVED" ? <form action={async () => { "use server"; await postSaleAction(sale.id); }}><button className="rounded-lg bg-[#102845] px-3 py-2 font-black text-white">ثبت مالی</button></form> : null}
                      {["POSTED", "PAID"].includes(sale.status) ? <span className="font-black text-emerald-700">ثبت‌شده</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
