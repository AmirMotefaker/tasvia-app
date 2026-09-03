import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { buildTreasuryProjection } from "../../../src/application/accounting/treasury-projection";
import { listSettlementOptions } from "../../../src/application/settlements/settlement-service";
import { TreasurySettlementForm } from "./settlement-form";

function money(value: bigint) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

function date(value: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
  }).format(value);
}

export default async function TreasuryWorkspacePage() {
  const current = await requireCurrentWorkspace();

  const [projection, settlements] = await Promise.all([
    buildTreasuryProjection(current.workspace.id),
    listSettlementOptions(current.workspace.id),
  ]);

  const total = projection.accounts.reduce(
    (sum, account) => sum + account.balance,
    0n,
  );

  const receivableTotal = settlements.receivables.reduce(
    (sum, balance) => sum + balance.outstandingAmount,
    0n,
  );

  const payableTotal = settlements.payables.reduce(
    (sum, balance) => sum + balance.outstandingAmount,
    0n,
  );

  return (
    <WorkspaceShell
      eyebrow="خزانه، وصول و پرداخت"
      title="خزانه‌داری"
      actions={
        <Link
          href="/app/reconciliation"
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black"
        >
          مغایرت‌گیری
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-black text-slate-500">
            کل نقد و بانک
          </div>
          <div className="mt-4 text-xl font-black">{money(total)}</div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-black text-slate-500">
            مطالبات باز
          </div>
          <div className="mt-4 text-xl font-black">
            {money(receivableTotal)}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-black text-slate-500">
            بدهی باز
          </div>
          <div className="mt-4 text-xl font-black">
            {money(payableTotal)}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-black text-slate-500">
            مانده‌های باز
          </div>
          <div className="mt-4 text-xl font-black">
            {new Intl.NumberFormat("fa-IR").format(
              settlements.receivables.length +
                settlements.payables.length,
            )}
          </div>
        </article>
      </section>

      <section className="mt-5">
        <div className="mb-3">
          <div className="text-xs font-black text-[#0b8d85]">
            تسویه واقعی
          </div>
          <h2 className="mt-1 text-xl font-black">
            دریافت و پرداخت تخصیص‌یافته
          </h2>
        </div>

        <TreasurySettlementForm
          receivables={settlements.receivables.map((balance) => ({
            ...balance,
            outstandingAmount: balance.outstandingAmount.toString(),
            dueAt: balance.dueAt.toISOString(),
          }))}
          payables={settlements.payables.map((balance) => ({
            ...balance,
            outstandingAmount: balance.outstandingAmount.toString(),
            dueAt: balance.dueAt.toISOString(),
          }))}
          treasuryAccounts={settlements.treasuryAccounts}
        />
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projection.accounts.map((account) => (
          <article
            key={account.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-slate-500">
                {account.name}
              </span>
              <span className="rounded-lg bg-[#eef8f7] px-2 py-1 text-[10px] font-black text-[#0b8d85]">
                {account.code}
              </span>
            </div>
            <div className="mt-4 text-xl font-black">
              {money(account.balance)}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <div className="text-xs font-black text-[#0b8d85]">
            آخرین گردش‌ها
          </div>
          <h2 className="mt-1 font-black">
            تراکنش‌های واقعی خزانه
          </h2>
        </div>

        {projection.recentMovements.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            هنوز گردش خزانه‌ای ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3">نوع</th>
                  <th className="px-5 py-3">حساب</th>
                  <th className="px-5 py-3">شرح / مرجع</th>
                  <th className="px-5 py-3">مبلغ</th>
                  <th className="px-5 py-3">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {projection.recentMovements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4 font-black">
                      {movement.direction === "IN"
                        ? "ورودی"
                        : "خروجی"}
                    </td>
                    <td className="px-5 py-4">
                      {movement.accountName}
                    </td>
                    <td className="px-5 py-4">
                      {movement.description}
                      {movement.reference
                        ? ` · ${movement.reference}`
                        : ""}
                    </td>
                    <td className="px-5 py-4 font-black">
                      {money(movement.amount)}
                    </td>
                    <td className="px-5 py-4">
                      {date(movement.occurredAt)}
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
