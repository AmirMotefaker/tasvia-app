import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره تسوین",
  description: "درباره محصول تسوین و تمرکز آن بر شفافیت تسویه و عملیات مالی کسب‌وکارها.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <article className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black">درباره تسوین</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-[#5f6c7e]">
          <p>تسوین یک محصول نرم‌افزاری برای شفاف‌تر کردن فرآیند درخواست، پیگیری و گزارش‌پذیری تسویه‌های کسب‌وکاری است.</p>
          <p>هدف محصول، حذف ابهام از عملیات مالی روزمره و ایجاد یک مسیر قابل پیگیری میان درخواست، ذی‌نفع، شواهد و وضعیت است.</p>
          <p>نسخه فعلی در مرحله توسعه و پایلوت قرار دارد و قابلیت پرداخت بانکی واقعی در وب‌سایت عمومی فعال نیست.</p>
        </div>
      </article>
    </main>
  );
}
