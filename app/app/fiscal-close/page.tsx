import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { fiscalCloseReadiness, listFiscalPeriods } from "../../../src/application/accounting/fiscal-close-service";
import { closeFiscalPeriodAction, reopenFiscalPeriodAction } from "./actions";

export default async function FiscalClosePage() {
  const current = await requireCurrentWorkspace();
  const periods = await listFiscalPeriods(current.workspace.id);
  const readiness = await Promise.all(periods.map((p) => fiscalCloseReadiness(current.workspace.id, p.id)));

  return (
    <WorkspaceShell eyebrow="کنترل پایان دوره" title="بستن دوره مالی">
      <section className="space-y-4">
        {readiness.map((r) => (
          <article key={r.period.id} className="rounded-3xl border bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-black">{r.period.name}</h2>
                <div className="mt-2 text-xs text-slate-500">
                  {new Intl.DateTimeFormat("fa-IR").format(r.period.startsAt)} تا {new Intl.DateTimeFormat("fa-IR").format(r.period.endsAt)}
                </div>
              </div>
              <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black">
                {r.period.status === "OPEN" ? "باز" : "بسته"}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 text-xs">سند پیش‌نویس: <b>{r.blockers.draftJournals}</b></div>
              <div className="rounded-xl bg-slate-50 p-4 text-xs">مطالبات باز: <b>{r.warnings.openReceivables}</b></div>
              <div className="rounded-xl bg-slate-50 p-4 text-xs">بدهی باز: <b>{r.warnings.openPayables}</b></div>
            </div>

            {r.period.status === "OPEN" ? (
              <form className="mt-4" action={async()=>{"use server";await closeFiscalPeriodAction(r.period.id)}}>
                <button
                  disabled={!r.canClose}
                  className="rounded-xl bg-[#102845] px-4 py-3 text-xs font-black text-white disabled:opacity-40"
                >
                  بستن قطعی دوره
                </button>
              </form>
            ) : (
              <form
                className="mt-4 flex flex-col gap-3 md:flex-row"
                action={reopenFiscalPeriodAction.bind(null, r.period.id)}
              >
                <input
                  name="reason"
                  required
                  minLength={10}
                  placeholder="دلیل بازگشایی دوره مالی"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs"
                />
                <button className="rounded-xl border border-slate-300 px-4 py-3 text-xs font-black">
                  بازگشایی کنترل‌شده
                </button>
              </form>
            )}
          </article>
        ))}
      </section>
    </WorkspaceShell>
  );
}
