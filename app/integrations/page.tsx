import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "یکپارچه‌سازی‌ها",
  description: "Roadmap یکپارچه‌سازی‌های تسویا برای API، Webhook، اعلان‌ها، QR و فروشگاه‌ها.",
  alternates: { canonical: "/integrations" },
};

export default function Page() {
  const planned = ["API عمومی","Webhook امضاشده","اعلان پیامکی","اعلان پیام‌رسان","QR","خروجی Excel","WooCommerce","اتصال‌های مالی"];
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full bg-[#fff4d8] px-3 py-2 text-xs font-black text-[#8a6500]">ROADMAP</span>
        <h1 className="mt-5 text-4xl font-black">یکپارچه‌سازی‌های تسویا</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#5f6c7e]">این صفحه نقشه راه است؛ موارد زیر هنوز به‌عنوان قابلیت Production اعلام نمی‌شوند.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {planned.map(x=><div key={x} className="rounded-2xl border border-black/5 bg-white p-4 text-sm font-black">{x}<div className="mt-2 text-[10px] text-[#9a7410]">PLANNED</div></div>)}
        </div>
      </div>
    </main>
  );
}
