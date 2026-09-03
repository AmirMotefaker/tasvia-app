import Link from "next/link";
import { WorkspaceShell } from "../../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../../src/auth/current-workspace";
import { buildWorkspaceFinancialProjection } from "../../../../src/application/accounting/workspace-projection";

function money(value: bigint) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

export default async function FinancialReportsPage() {
  const current = await requireCurrentWorkspace();
  const projection = await buildWorkspaceFinancialProjection(current.workspace.id);

  const summary = [
    ["فروش ثبت‌شده", money(projection.sales)],
    ["سود/زیان خالص", money(projection.netIncome)],
    ["مانده نقد", money(projection.cash)],
    ["سرمایه در گردش", money(projection.workingCapital)],
  ];

  const reports = [
    ["سود و زیان", `درآمد ${money(projection.revenue)} · هزینه ${money(projection.expenses)} · خالص ${money(projection.netIncome)}`],
    ["نقدینگی", `مانده صندوق و بانک ${money(projection.cash)}`],
    ["مطالبات", `${money(projection.receivables)} باز · ${new Intl.NumberFormat("fa-IR").format(projection.overdueReceivables)} مورد سررسیدشده`],
    ["بدهی‌ها", `${money(projection.payables)} باز · ${new Intl.NumberFormat("fa-IR").format(projection.dueSoonPayables)} مورد در هفت روز آینده`],
  ];

  return (
    <WorkspaceShell title="گزارش‌های مالی" eyebrow="داده واقعی دفتر" actions={<Link href="/accounting/professional" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black">دفتر حرفه‌ای</Link>}>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <div className="text-xs font-bold text-slate-500">{label}</div>
            <div className="mt-3 text-xl font-black">{value}</div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
          <div className="text-xs font-black text-[#0b8d85]">صورت عملکرد</div>
          <h2 className="mt-1 text-xl font-black">درآمد و هزینه ثبت‌شده</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["درآمد", money(projection.revenue)],
              ["هزینه", money(projection.expenses)],
              ["خالص", money(projection.netIncome)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-5">
                <div className="text-xs font-bold text-slate-500">{label}</div>
                <div className="mt-2 text-base font-black">{value}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-slate-500">این ارقام فقط از خطوط اسناد POSTED همان فضای کاری محاسبه می‌شوند و شامل داده نمایشی نیستند.</p>
        </article>

        <article className="rounded-3xl bg-[#102845] p-5 text-white">
          <div className="text-xs font-black text-[#63dfd4]">کنترل مدیریتی</div>
          <h2 className="mt-2 text-xl font-black">مانده‌های باز</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/8 p-4"><div className="text-xs text-white/55">طلب</div><div className="mt-2 text-sm font-black">{money(projection.receivables)}</div></div>
            <div className="rounded-2xl bg-white/8 p-4"><div className="text-xs text-white/55">بدهی</div><div className="mt-2 text-sm font-black">{money(projection.payables)}</div></div>
            <div className="rounded-2xl bg-white/8 p-4"><div className="text-xs text-white/55">سررسید گذشته</div><div className="mt-2 text-sm font-black">{new Intl.NumberFormat("fa-IR").format(projection.overdueReceivables)} مورد</div></div>
            <div className="rounded-2xl bg-white/8 p-4"><div className="text-xs text-white/55">بدهی نزدیک سررسید</div><div className="mt-2 text-sm font-black">{new Intl.NumberFormat("fa-IR").format(projection.dueSoonPayables)} مورد</div></div>
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reports.map(([title, desc]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,34,61,.04)]">
            <h3 className="font-black">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">{desc}</p>
          </article>
        ))}
      </section>
    </WorkspaceShell>
  );
}
