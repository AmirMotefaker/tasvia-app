import Link from "next/link";

const rows = [
  { id: "tsv-1048", supplier: "تامین‌کننده سپهر", amount: "۳۶٬۵۰۰٬۰۰۰ ریال", status: "آماده تسویه" },
  { id: "tsv-1047", supplier: "پخش آریا", amount: "۱۸٬۲۰۰٬۰۰۰ ریال", status: "نیازمند بررسی" },
  { id: "tsv-1046", supplier: "بازرگانی روشا", amount: "۹٬۷۵۰٬۰۰۰ ریال", status: "تطبیق‌شده" },
];

export default function SettlementsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f7fb] px-3 py-4 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-extrabold text-[#008f87]">Demo Mode</div>
            <h1 className="mt-1 text-2xl font-black">تسویه‌ها</h1>
          </div>
          <Link href="/settlements/new" className="rounded-2xl bg-[#0f223d] px-4 py-3 text-xs font-extrabold text-white">درخواست جدید</Link>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <Link key={row.id} href={`/settlements/${row.id}`} className="block rounded-[22px] border border-black/5 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black">{row.supplier}</div>
                  <div className="mt-2 text-sm font-bold text-[#556174]">{row.amount}</div>
                  <div className="mt-2 text-[10px] text-[#8892a0]">شناسه {row.id}</div>
                </div>
                <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-[10px] font-extrabold text-[#304157]">{row.status}</span>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-2xl border border-black/10 px-4 text-xs font-extrabold">بازگشت به داشبورد</Link>
      </div>
    </main>
  );
}
