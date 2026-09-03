import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { listPurchaseOptions, listPurchases } from "../../../src/application/purchases/purchase-service";
import { PurchaseForm } from "./purchase-form";
import { approvePurchaseAction, postPurchaseAction, submitPurchaseAction } from "./actions";

function money(value: bigint) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

const statusLabel: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  SUBMITTED: "ارسال‌شده",
  APPROVED: "تأییدشده",
  POSTED: "ثبت مالی",
  PAID: "پرداخت‌شده",
  CANCELLED: "لغوشده",
};

export default async function PurchasesPage() {
  const current = await requireCurrentWorkspace();
  const [options, purchases] = await Promise.all([
    listPurchaseOptions(current.workspace.id),
    listPurchases(current.workspace.id),
  ]);

  const postedTotal = purchases.filter((purchase) => ["POSTED", "PAID"].includes(purchase.status)).reduce((sum, purchase) => sum + purchase.total, 0n);

  return (
    <WorkspaceShell title="خرید" eyebrow="خرید، انبار و بدهی تأمین‌کننده">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">تعداد اسناد</div><div className="mt-3 text-xl font-black">{new Intl.NumberFormat("fa-IR").format(purchases.length)}</div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">خرید ثبت مالی‌شده</div><div className="mt-3 text-xl font-black">{money(postedTotal)}</div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">تأمین‌کنندگان فعال</div><div className="mt-3 text-xl font-black">{new Intl.NumberFormat("fa-IR").format(options.suppliers.length)}</div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold text-slate-500">انبارهای فعال</div><div className="mt-3 text-xl font-black">{new Intl.NumberFormat("fa-IR").format(options.warehouses.length)}</div></article>
      </section>

      <section className="mt-5">
        <div className="mb-3"><div className="text-xs font-black text-[#0b8d85]">ثبت خرید واقعی</div><h2 className="mt-1 text-xl font-black">فاکتور جدید</h2></div>
        <PurchaseForm suppliers={options.suppliers} warehouses={options.warehouses} items={options.items} />
      </section>

      <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5"><div className="text-xs font-black text-[#0b8d85]">اسناد خرید</div><h2 className="mt-1 text-xl font-black">چرخه پیش‌نویس تا ثبت مالی</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-right text-xs">
            <thead className="bg-slate-50 text-slate-500"><tr>{["شماره", "تأمین‌کننده", "انبار", "مبلغ", "وضعیت", "تاریخ", "عملیات"].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}</tr></thead>
            <tbody>
              {purchases.length === 0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">هنوز خریدی ثبت نشده است.</td></tr> : purchases.map((purchase) => (
                <tr key={purchase.id} className="border-t border-slate-100">
                  <td className="px-4 py-4 font-black">{purchase.invoiceNumber}</td><td className="px-4 py-4">{purchase.supplier.name}</td><td className="px-4 py-4">{purchase.warehouse.name}</td><td className="px-4 py-4 font-black">{money(purchase.total)}</td><td className="px-4 py-4">{statusLabel[purchase.status] ?? purchase.status}</td><td className="px-4 py-4">{new Intl.DateTimeFormat("fa-IR").format(purchase.issuedAt)}</td>
                  <td className="px-4 py-4"><div className="flex flex-wrap gap-2">
                    {purchase.status === "DRAFT" ? <form action={async () => { "use server"; await submitPurchaseAction(purchase.id); }}><button className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-black">ارسال</button></form> : null}
                    {purchase.status === "SUBMITTED" ? <form action={async () => { "use server"; await approvePurchaseAction(purchase.id); }}><button className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-black">تأیید</button></form> : null}
                    {purchase.status === "APPROVED" ? <form action={async () => { "use server"; await postPurchaseAction(purchase.id); }}><button className="rounded-lg bg-[#102845] px-2.5 py-1.5 font-black text-white">ثبت مالی</button></form> : null}
                    {["POSTED", "PAID"].includes(purchase.status) ? <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 font-black text-emerald-700">دفتر و انبار ثبت شد</span> : null}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </WorkspaceShell>
  );
}
