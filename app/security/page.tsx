import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "امنیت و شفافیت",
  description: "اصول امنیت، کنترل دسترسی، audit trail و تفکیک شواهد مالی از تأیید بانکی در تسوین.",
  alternates: { canonical: "/security" },
};

const controls = [
  ["تفکیک هویت و مجوز", "ورود به سیستم به‌تنهایی مجوز مشاهده یا تغییر منابع مالی ایجاد نمی‌کند."],
  ["دسترسی مبتنی بر نقش", "مالک، مدیر، مالی و مشاهده‌گر باید سطح دسترسی متفاوت و قابل توضیح داشته باشند."],
  ["ردپای عملیاتی", "تغییر وضعیت‌ها و تصمیم‌های حساس باید قابل پیگیری و قابل حسابرسی باشند."],
  ["شواهد ≠ تأیید بانک", "رسید یا مدرک داخلی به‌تنهایی به معنی تسویه قطعی یا تأیید PSP نیست."],
  ["حداقل‌سازی داده", "فقط داده لازم برای عملیات و کنترل نگهداری می‌شود و نمایش اطلاعات حساس محدود می‌ماند."],
  ["بدون ادعای کاذب", "قابلیت‌های بانکی، پرداختی یا یکپارچه‌سازی فقط بعد از منبع معتبر و تست عملیاتی اعلام می‌شوند."],
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-14 text-[#0b1220] sm:px-6">
      <article className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="text-xs font-black text-[#008f87]">امنیت و شفافیت</div>
          <h1 className="mt-3 text-4xl font-black leading-[1.4]">اعتماد از کنترل، شواهد و مرزبندی روشن ساخته می‌شود.</h1>
          <p className="mt-5 text-base leading-8 text-[#5f6c7e]">تسوین ابتدا لایه کنترل عملیات مالی را می‌سازد. هر اتصال مالی واقعی باید بعداً روی همین مرزهای امنیتی و حسابرسی‌شونده قرار بگیرد.</p>
        </div>
        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {controls.map(([title,text]) => <div key={title} className="rounded-[26px] border border-black/5 bg-white p-6"><h2 className="font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p></div>)}
        </section>
        <div className="mt-8 rounded-[28px] border border-[#008f87]/15 bg-[#eafaf8] p-6 text-sm leading-7 text-[#315b59]">
          وضعیت فعلی محصول: محیط سایت و دمو هیچ انتقال وجه، اتصال بانکی فعال یا تأیید خودکار PSP انجام نمی‌دهد.
        </div>
      </article>
    </main>
  );
}
