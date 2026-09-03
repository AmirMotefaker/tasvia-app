import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SIMPLE_ACCOUNTING_ACTIONS, simpleActionBySlug } from "../../../../src/domain/accounting/simple-actions";
import { auth } from "../../../../src/lib/auth";
import { resolveFirstActiveWorkspaceMembership } from "../../../../src/domain/workspace/repository";
import { listOpenBalances } from "../../../../src/infrastructure/accounting/open-balance-repository";
import { listSimpleWorkflowOptions, type SimplePersistedAction } from "../../../../src/application/accounting/simple-workflow-persistence";
import { SimpleActionForm, type SimpleActionOption } from "./simple-action-form";

export function generateStaticParams() {
  return Object.values(SIMPLE_ACCOUNTING_ACTIONS).map((action) => ({ action: action.slug }));
}

function formatRials(value: bigint): string {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

export default async function SimpleAccountingActionPage({ params }: { params: Promise<{ action: string }> }) {
  const { action: slug } = await params;
  const action = simpleActionBySlug(slug);
  if (!action) notFound();

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user?.id) redirect(`/sign-in?next=/accounting/simple/${slug}`);
  const membership = await resolveFirstActiveWorkspaceMembership(session.user.id);
  if (!membership) redirect("/accounting/simple");

  const writable = new Set<SimplePersistedAction>(["sale", "purchase", "receipt", "payment", "expense"]);
  const isBalances = slug === "balances";
  let options: SimpleActionOption[] = [];

  if (writable.has(slug as SimplePersistedAction)) {
    const data = await listSimpleWorkflowOptions(membership.workspace.id, slug as SimplePersistedAction);
    options = data.counterparties.length
      ? data.counterparties.map((counterparty) => ({ id: counterparty.id, label: counterparty.name }))
      : data.openBalances.map((balance) => ({
          id: balance.id,
          label: balance.counterpartyName,
          meta: `${new Intl.NumberFormat("fa-IR").format(BigInt(balance.outstandingAmount))} ریال`,
        }));
  }

  const balances = isBalances ? await listOpenBalances(membership.workspace.id) : [];
  const receivables = balances.filter((balance) => balance.type === "RECEIVABLE");
  const payables = balances.filter((balance) => balance.type === "PAYABLE");
  const receivableTotal = receivables.reduce((sum, item) => sum + item.outstandingAmount, 0n);
  const payableTotal = payables.reduce((sum, item) => sum + item.outstandingAmount, 0n);

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/accounting/simple" className="text-sm font-black text-[#007d75]">بازگشت به حسابداری ساده</Link>
          <span className="rounded-full bg-[#eafaf8] px-3 py-1.5 text-[11px] font-black text-[#246d67]">{membership.workspace.name}</span>
        </div>

        <div className="mt-6 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(15,34,61,.06)] sm:p-8">
          <div className="text-xs font-black text-[#008f87]">{isBalances ? "مانده‌های واقعی Workspace" : "ثبت هدایت‌شده و متوازن"}</div>
          <h1 className="mt-2 text-3xl font-black">{action.label}</h1>
          <p className="mt-3 text-sm leading-7 text-[#657184]">{action.description}</p>

          {isBalances ? (
            <>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl bg-[#effbf9] p-5">
                  <div className="text-xs font-black text-[#007d75]">مطالبات باز</div>
                  <div className="mt-2 text-2xl font-black">{formatRials(receivableTotal)}</div>
                  <div className="mt-2 text-xs text-[#55716f]">{new Intl.NumberFormat("fa-IR").format(receivables.length)} مانده باز</div>
                </article>
                <article className="rounded-3xl bg-[#fff7ed] p-5">
                  <div className="text-xs font-black text-[#a65a12]">بدهی‌های باز</div>
                  <div className="mt-2 text-2xl font-black">{formatRials(payableTotal)}</div>
                  <div className="mt-2 text-xs text-[#765b43]">{new Intl.NumberFormat("fa-IR").format(payables.length)} مانده باز</div>
                </article>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
                <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-[#f7f9fc] px-4 py-3 text-xs font-black text-[#687487]">
                  <span>طرف حساب</span><span>نوع</span><span>مانده</span>
                </div>
                {balances.length ? balances.map((balance) => (
                  <div key={balance.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-slate-100 px-4 py-4 text-sm">
                    <div><div className="font-black">{balance.counterparty.name}</div><div className="mt-1 text-[11px] text-[#7a8698]">سررسید {new Intl.DateTimeFormat("fa-IR").format(balance.dueAt)}</div></div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${balance.type === "RECEIVABLE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{balance.type === "RECEIVABLE" ? "طلب" : "بدهی"}</span>
                    <span className="font-black tabular-nums">{formatRials(balance.outstandingAmount)}</span>
                  </div>
                )) : <div className="px-5 py-10 text-center text-sm text-[#738094]">مانده باز ثبت‌شده‌ای وجود ندارد.</div>}
              </div>
            </>
          ) : writable.has(slug as SimplePersistedAction) ? (
            <SimpleActionForm action={slug as SimplePersistedAction} options={options} />
          ) : (
            <div className="mt-7 rounded-2xl bg-[#f7f9fc] p-5 text-sm leading-7 text-[#657184]">این عملیات در جریان دیگری مدیریت می‌شود.</div>
          )}

          <div className="mt-7 rounded-2xl border border-[#bfe9e4] bg-[#effbf9] p-4">
            <div className="text-xs font-black text-[#007d75]">اثر حسابداری</div>
            <div className="mt-2 text-sm font-black">{action.accountingEffect}</div>
            <p className="mt-2 text-xs leading-6 text-[#55716f]">تمام ثبت‌ها به همان Workspace، دوره مالی و دفتر حسابداری مشترک متصل می‌شوند؛ حقیقت مالی موازی ساخته نمی‌شود.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
