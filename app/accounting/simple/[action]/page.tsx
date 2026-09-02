import Link from "next/link";
import { notFound } from "next/navigation";
import { SIMPLE_ACCOUNTING_ACTIONS, simpleActionBySlug } from "../../../../src/domain/accounting/simple-actions";

export function generateStaticParams() {
  return Object.values(SIMPLE_ACCOUNTING_ACTIONS).map((action) => ({ action: action.slug }));
}

export default async function SimpleAccountingActionPage({ params }: { params: Promise<{ action: string }> }) {
  const { action: slug } = await params;
  const action = simpleActionBySlug(slug);
  if (!action) notFound();

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
        <Link href="/accounting/simple" className="text-sm font-black text-[#007d75]">بازگشت به حسابداری ساده</Link>
        <div className="mt-6 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_18px_60px_rgba(15,34,61,.06)] sm:p-8">
          <div className="text-xs font-black text-[#008f87]">ثبت هدایت‌شده</div>
          <h1 className="mt-2 text-3xl font-black">{action.label}</h1>
          <p className="mt-3 text-sm leading-7 text-[#657184]">{action.description}</p>

          <div className="mt-8 space-y-3">
            {action.requiredInputs.length ? action.requiredInputs.map((input, index) => (
              <div key={input} className="flex items-center gap-4 rounded-2xl bg-[#f7f9fc] p-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0f223d] text-xs font-black text-white">{index + 1}</span>
                <div>
                  <div className="text-sm font-black">{input}</div>
                  <div className="mt-1 text-xs leading-6 text-[#657184]">این مقدار در لایه کاربردی به قرارداد واقعی حسابداری متصل می‌شود.</div>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl bg-[#f7f9fc] p-4 text-sm leading-7 text-[#657184]">این بخش ورودی ثبت ندارد و از گزارش واقعی مطالبات و بدهی‌ها ساخته می‌شود.</div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-[#bfe9e4] bg-[#effbf9] p-4">
            <div className="text-xs font-black text-[#007d75]">اثر حسابداری</div>
            <div className="mt-2 text-sm font-black">{action.accountingEffect}</div>
            <p className="mt-2 text-xs leading-6 text-[#55716f]">تسوین ثبت مالی را فقط از مسیر قراردادهای متوازن، قابل حسابرسی و متعلق به همان فضای کاری انجام می‌دهد.</p>
          </div>

          <button type="button" disabled className="mt-6 min-h-12 w-full cursor-not-allowed rounded-2xl bg-[#0f223d]/45 px-5 py-3 text-sm font-black text-white">
            ثبت نهایی پس از اتصال Application Layer فعال می‌شود
          </button>
        </div>
      </section>
    </main>
  );
}
