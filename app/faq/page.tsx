import type { Metadata } from "next";

const faq = [
  ["تسویا چیست؟","تسویا یک محصول در حال توسعه برای مدیریت شفاف جریان تسویه و عملیات مالی کسب‌وکارهاست."],
  ["آیا تسویا الان پول جابه‌جا می‌کند؟","خیر. نسخه عمومی فعلی انتقال وجه واقعی یا اتصال فعال بانکی/PSP انجام نمی‌دهد."],
  ["تفاوت Available، Preview و Planned چیست؟","Available یعنی foundation پیاده و تست شده؛ Preview یعنی تجربه یا foundation غیرProduction؛ Planned یعنی فقط Roadmap."],
  ["آیا API تسویا منتشر شده است؟","خیر. API و Webhook عمومی در Roadmap قرار دارند و هنوز Production نیستند."],
  ["تمرکز اصلی تسویا چیست؟","مدیریت چرخه تسویه، شواهد، تاریخچه، حسابرسی و لایه‌های مالی مرتبط؛ نه صرفاً تشخیص یک پرداخت."],
];

export const metadata: Metadata = {
  title: "سوالات متداول",
  description: "پاسخ به سوالات متداول درباره تسویا، وضعیت محصول و قابلیت‌های آن.",
  alternates: { canonical: "/faq" },
};

export default function Page() {
  const schema = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))};
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-12 text-[#0b1220] sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black">سوالات متداول تسویا</h1>
        <div className="mt-8 space-y-3">{faq.map(([q,a])=><details key={q} className="rounded-2xl bg-white p-5"><summary className="cursor-pointer font-black">{q}</summary><p className="mt-3 text-sm leading-7 text-[#657184]">{a}</p></details>)}</div>
      </div>
    </main>
  );
}
