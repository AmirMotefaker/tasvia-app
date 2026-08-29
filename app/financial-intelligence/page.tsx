import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "هوشمندی مالی",
  description: "بنیان هوشمندی مالی، دفتر کل، ژورنال و صورت‌های مالی در معماری تسویا.",
  alternates: { canonical: "/financial-intelligence" },
};

export default function Page() {
  const items = [
    ["AVAILABLE","محاسبات دقیق Money","محاسبات مبالغ ریالی بر پایه integer/bigint و تست‌های ایمنی مالی."],
    ["AVAILABLE","دفتر کل و ژورنال","بنیان Ledger و Double-entry Journal در دامنه مالی."],
    ["AVAILABLE","صورت‌های مالی","بنیان Trial Balance، Balance Sheet، Income Statement و Cash Flow Summary."],
    ["PREVIEW","Accounting Intelligence","لایه توضیح و تحلیل روی داده‌های مالی در حال توسعه محصولی است."],
  ];
  return (
    <main className="min-h-screen bg-[#0f223d] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-xs font-black text-[#63dfd4]">Tasvia Financial Intelligence</div>
        <h1 className="mt-3 text-4xl font-black leading-[1.4]">از وضعیت تسویه تا تصویر مالی قابل توضیح</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map(([status,title,text])=>(
            <section key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-[10px] font-black text-[#63dfd4]">{status}</div>
              <h2 className="mt-2 text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
