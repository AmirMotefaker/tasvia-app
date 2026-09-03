import { WorkspaceShell } from "../../../src/components/workspace/shell";
import { requireCurrentWorkspace } from "../../../src/auth/current-workspace";
import { listChequeOptions, listCheques } from "../../../src/application/cheques/cheque-service";
import { ChequeForm } from "./cheque-form";
import { changeChequeStatusAction } from "./actions";

const label: Record<string, string> = {
  REGISTERED: "ثبت‌شده",
  DUE: "سررسیدشده",
  CLEARED: "وصول‌شده",
  BOUNCED: "برگشتی",
  CANCELLED: "لغوشده",
};

export default async function ChequesPage() {
  const current = await requireCurrentWorkspace();
  const [options, cheques] = await Promise.all([
    listChequeOptions(current.workspace.id),
    listCheques(current.workspace.id),
  ]);

  return (
    <WorkspaceShell eyebrow="اسناد دریافتنی و پرداختنی" title="مدیریت چک">
      <ChequeForm
        counterparties={options.counterparties}
        balances={options.balances.map((x) => ({
          ...x,
          outstandingAmount: x.outstandingAmount.toString(),
        }))}
      />

      <section className="mt-5 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,34,61,.04)]">
        <table className="w-full min-w-[900px] text-right text-xs">
          <thead className="bg-slate-50">
            <tr>
              {["شماره", "طرف حساب", "نوع", "مبلغ", "سررسید", "وضعیت", "عملیات"].map((x) => (
                <th key={x} className="p-4">{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cheques.length === 0 ? (
              <tr><td colSpan={7} className="p-10 text-center text-slate-500">هنوز چکی ثبت نشده است.</td></tr>
            ) : cheques.map((cheque) => (
              <tr key={cheque.id} className="border-t border-slate-100">
                <td className="p-4 font-black">{cheque.chequeNumber}</td>
                <td className="p-4">{cheque.counterparty.name}</td>
                <td className="p-4">{cheque.direction === "RECEIVED" ? "دریافتی" : "پرداختی"}</td>
                <td className="p-4">{new Intl.NumberFormat("fa-IR").format(cheque.amount)} ریال</td>
                <td className="p-4">{new Intl.DateTimeFormat("fa-IR").format(cheque.dueAt)}</td>
                <td className="p-4">{label[cheque.status]}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {cheque.status === "REGISTERED" ? (
                      <form action={async () => { "use server"; await changeChequeStatusAction(cheque.id, "DUE"); }}>
                        <button className="rounded-lg border px-2 py-1">سررسید</button>
                      </form>
                    ) : null}
                    {["REGISTERED", "DUE"].includes(cheque.status) ? (
                      <form action={async () => { "use server"; await changeChequeStatusAction(cheque.id, "CLEARED"); }}>
                        <button className="rounded-lg bg-[#102845] px-2 py-1 text-white">وصول</button>
                      </form>
                    ) : null}
                    {cheque.status === "DUE" ? (
                      <form action={async () => { "use server"; await changeChequeStatusAction(cheque.id, "BOUNCED"); }}>
                        <button className="rounded-lg border px-2 py-1">برگشت</button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </WorkspaceShell>
  );
}
