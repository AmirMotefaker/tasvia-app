import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "امنیت و شفافیت",
  description: "اصول امنیت، شفافیت و تفکیک شواهد مالی از تأیید بانکی در تسویا.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <article className="mx-auto max-w-4xl">
        <div className="text-xs font-black text-[#008f87]">امنیت و شفافیت</div>
        <h1 className="mt-3 text-4xl font-black leading-[1.4]">شفافیت عملیاتی قبل از اتوماسیون مالی</h1>
        <div className="mt-8 space-y-5 text-base leading-8 text-[#5f6c7e]">
          <p>تسویا در وضعیت فعلی یک محیط محصول و دمو است و هیچ جابه‌جایی پول یا اتصال فعال بانکی انجام نمی‌دهد.</p>
          <p>رسیدها و مدارک در طراحی محصول به‌عنوان شواهد نگهداری می‌شوند. وجود رسید به‌تنهایی به معنی تأیید قطعی بانک یا PSP نیست.</p>
          <p>هر قابلیت مالی واقعی باید به منبع معتبر، audit trail و سیاست‌های روشن کنترل دسترسی متصل باشد.</p>
        </div>
      </article>
    </main>
  );
}
