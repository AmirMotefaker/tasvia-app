import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "مقایسه تسویا و واریزا",
  description: "مقایسه شفاف دامنه محصول تسویا و واریزا بر اساس اطلاعات عمومی و وضعیت واقعی قابلیت‌های تسویا.",
  alternates: { canonical: "/compare/variza" },
};

const rows = [
  ["تمرکز محصول","تأیید خودکار پرداخت کارت‌به‌کارت","عملیات تسویه و زیرساخت مالی"],
  ["لینک پرداخت","ارائه شده","Planned"],
  ["تشخیص خودکار پرداخت","ارائه شده","Planned"],
  ["API و Webhook","ارائه شده","Planned"],
  ["QR / اعلان / Excel","ارائه شده","Planned"],
  ["Settlement workflow","تمرکز متفاوت","Preview"],
  ["Exact Money foundation","اعلام عمومی مقایسه نشده","Available"],
  ["Ledger / Journal foundation","اعلام عمومی مقایسه نشده","Available"],
  ["Financial statements foundation","اعلام عمومی مقایسه نشده","Available"],
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs font-black text-[#008f87]">آخرین بررسی: ۷ شهریور ۱۴۰۵ / 29 Aug 2026</div>
        <h1 className="mt-3 text-4xl font-black leading-[1.4]">تسویا در مقایسه با واریزا</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-[#657184]">این صفحه برای شفافیت دامنه محصولات است، نه ادعای برتری مطلق. اطلاعات واریزا از صفحات عمومی رسمی آن در تاریخ بالا استخراج شده و قابلیت‌های تسویا بر اساس وضعیت واقعی همین محصول برچسب خورده‌اند.</p>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-black/5 bg-white">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="bg-[#0f223d] text-white"><tr><th className="p-4">حوزه</th><th className="p-4">واریزا</th><th className="p-4">تسویا</th></tr></thead>
            <tbody>{rows.map(r=><tr key={r[0]} className="border-t border-black/5">{r.map((c,i)=><td key={i} className="p-4 align-top">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="mt-6 rounded-2xl bg-white p-5 text-xs leading-6 text-[#657184]">
          منابع بررسی واریزا: صفحه اصلی، Pricing، Developers و FAQ در وب‌سایت رسمی Variza. وضعیت قابلیت‌های رقبا ممکن است تغییر کند.
        </div>
        <Link href="/product" className="mt-6 inline-flex rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">مشاهده معماری محصول تسویا</Link>
      </div>
    </main>
  );
}
