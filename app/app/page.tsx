import type { Metadata } from "next";
import Link from "next/link";
import { WorkspaceShell } from "../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../src/auth/current-workspace";
import { buildWorkspaceFinancialProjection } from "../../src/application/accounting/workspace-projection";

export const metadata: Metadata = {
  title: "داشبورد مالی تسوین",
  description: "مرکز فرمان مالی تسوین برای فروش، خرید، نقدینگی، مطالبات، بدهی‌ها، موجودی و گزارش‌ها.",
  robots: { index: false, follow: false },
};

const quickActions = [
  ["فاکتور فروش", "/app/sales"],
  ["ثبت خرید", "/app/purchases"],
  ["دریافت / پرداخت", "/app/treasury"],
  ["چک‌ها", "/app/cheques"],
];

function money(value: bigint) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

function date(value: Date) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(value);
}

export default async function WorkspacePage() {
  const current = await requireCurrentWorkspace();
  const projection = await buildWorkspaceFinancialProjection(current.workspace.id);

  const metrics = [
    ["فروش ثبت‌شده", money(projection.sales), "از اسناد POSTED فروش"],
    ["دریافتنی", money(projection.receivables), "مطالبات باز مشتریان"],
    ["پرداختنی", money(projection.payables), "بدهی باز تأمین‌کنندگان"],
    ["موجودی نقد", money(projection.cash), "صندوق و بانک از دفتر واقعی"],
  ];

  return (
    <WorkspaceShell
      eyebrow="مرکز فرمان مالی"
      title="داشبورد"
      actions={<Link href="/app/sales" className="rounded-xl bg-[#102845] px-4 py-2.5 text-xs font-black text-white">فروش جدید +</Link>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([title, value, note]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <div className="text-xs font-black text-[#64748b]">{title}</div>
            <div className="mt-4 text-xl font-black text-[#102845]">{value}</div>
            <div className="mt-2 text-[11px] font-bold text-[#8290a4]">{note}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)] sm:p-6">
          <div className="text-xs font-black text-[#0b8d85]">تصویر مالی واقعی</div>
          <h2 className="mt-1 text-lg font-black text-[#102845]">خلاصه دفتر فضای کاری</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["درآمد", money(projection.revenue)],
              ["هزینه", money(projection.expenses)],
              ["سود/زیان خالص", money(projection.netIncome)],
              ["سرمایه در گردش", money(projection.workingCapital)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#f8fafc] p-4">
                <div className="text-xs font-bold text-[#8190a3]">{label}</div>
                <div className="mt-2 text-base font-black text-[#102845]">{value}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)] sm:p-6">
          <div className="text-xs font-black text-[#0b8d85]">اقدام سریع</div>
          <h2 className="mt-1 text-lg font-black text-[#102845]">کارهای پرتکرار</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickActions.map(([label, href]) => (
              <Link key={href} href={href} className="flex min-h-24 flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 transition hover:border-[#63dfd4] hover:bg-[#f0fbfa]">
                <span className="text-sm font-black text-[#102845]">{label}</span>
                <span className="text-xs font-black text-[#0b8d85]">شروع ←</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_.75fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div><div className="text-xs font-black text-[#0b8d85]">آخرین عملیات</div><h2 className="mt-1 font-black text-[#102845]">اسناد ثبت‌شده فضای کاری</h2></div>
            <Link href="/app/reports/financial" className="text-xs font-black text-[#0b8d85]">مشاهده گزارش‌ها</Link>
          </div>
          {projection.recentJournals.length === 0 ? (
            <div className="p-6 text-sm text-[#8190a3]">هنوز سند مالی ثبت‌شده‌ای در این فضای کاری وجود ندارد.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-right text-xs">
                <thead className="bg-[#f8fafc] text-[#6c798c]"><tr><th className="px-5 py-3">شرح</th><th className="px-5 py-3">مرجع</th><th className="px-5 py-3">وضعیت</th><th className="px-5 py-3">تاریخ</th></tr></thead>
                <tbody>
                  {projection.recentJournals.map((journal) => (
                    <tr key={journal.id} className="border-t border-slate-100">
                      <td className="px-5 py-4 font-black text-[#26354a]">{journal.description}</td>
                      <td className="px-5 py-4 text-[#8190a3]">{journal.sourceDocumentId ?? "—"}</td>
                      <td className="px-5 py-4"><span className="rounded-lg bg-[#eef8f7] px-2 py-1 font-black text-[#0b8d85]">ثبت قطعی</span></td>
                      <td className="px-5 py-4 text-[#8190a3]">{date(journal.occurredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)] sm:p-6">
          <div className="text-xs font-black text-[#0b8d85]">کنترل مالی</div>
          <h2 className="mt-1 text-lg font-black text-[#102845]">نیازمند توجه</h2>
          <div className="mt-5 space-y-3">
            {[
              ["مطالبات سررسیدشده", `${new Intl.NumberFormat("fa-IR").format(projection.overdueReceivables)} مورد`],
              ["بدهی‌های هفت روز آینده", `${new Intl.NumberFormat("fa-IR").format(projection.dueSoonPayables)} مورد`],
            ].map(([title, value]) => (
              <div key={title} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div className="text-sm font-black text-[#26354a]">{title}</div>
                <span className="rounded-lg bg-[#f5f7fa] px-2.5 py-1.5 text-[10px] font-black text-[#6f7d90]">{value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </WorkspaceShell>
  );
}
