import Link from "next/link";

const controls = [
  ["سامانه مودیان", "صف ارسال صورتحساب الکترونیکی با idempotency، وضعیت ارسال و مرجع پذیرش/رد."],
  ["استعلام‌های رسمی", "قرارداد استعلام هویت، شبا، کارت و کدپستی؛ اتصال Provider واقعی فقط پس از دریافت دسترسی رسمی."],
  ["کارتخوان و POS", "ثبت ترمینال، Provider، حساب بانکی مقصد و وضعیت فعال‌بودن برای تطبیق خزانه."],
  ["تأییدهای چندمرحله‌ای", "کنترل عملیات حساس بر اساس نقش، نوع عملیات و حداقل تعداد تأیید."],
  ["پشتیبان‌گیری و بازیابی", "Manifest نسخه‌دار، checksum و الزام رمزنگاری برای داده‌های مالی و مدارک."],
  ["فارسی و انگلیسی", "زیرساخت locale محصول با فارسی به‌عنوان زبان پیش‌فرض و انگلیسی برای تجربه بین‌المللی."],
] as const;

export default function PlatformControlsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8" dir="rtl">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">کنترل‌های پلتفرم و انطباق</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">اتصال، انطباق و امنیت عملیاتی تسوین</h1>
        <p className="mt-4 max-w-3xl leading-8 text-slate-600">این بخش مرز امن اتصال تسوین به سرویس‌های رسمی و زیرساخت‌های بیرونی است. هیچ عملیات بانکی، مالیاتی یا استعلام واقعی بدون Provider معتبر و مجوز محیط عملیاتی انجام نمی‌شود.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {controls.map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="flex flex-wrap gap-3">
        <Link href="/app/operations-controls" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">کنترل‌های عملیاتی</Link>
        <Link href="/app/commercial-controls" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800">کنترل‌های تجاری</Link>
        <Link href="/app" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800">بازگشت به داشبورد</Link>
      </section>
    </main>
  );
}
