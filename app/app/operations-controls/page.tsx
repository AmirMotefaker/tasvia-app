import Link from "next/link";

const capabilities = [
  ["آرشیو مدارک", "ضمیمه امن فاکتور، رسید، چک و قرارداد با هش محتوای قابل ردیابی.", "Preview"],
  ["پیامک و اعلان‌ها", "قرارداد چندکاناله برای سررسید، پرداخت، کمبود موجودی و مغایرت؛ ارسال واقعی فقط با Provider مجاز.", "Preview"],
  ["فرم‌ساز", "فیلدهای سفارشی کنترل‌شده برای فرایندهای داخلی بدون تغییر هسته حسابداری.", "Preview"],
  ["بستن سال مالی", "Gate سخت‌گیرانه برای اسناد ثبت‌نشده، مغایرت‌های بحرانی و حساب سود و زیان انباشته.", "Preview"],
  ["تجمیع اسناد", "تجمیع کنترل‌شده خطوط هم‌حساب بدون از بین‌بردن Traceability اسناد منبع.", "Preview"],
  ["تولید و BOM", "محاسبه بهای مواد اولیه با واحدهای پول صحیح و مرز روشن برای ثبت تولید.", "Preview"],
  ["فروشگاه آنلاین", "Envelope استاندارد برای WooCommerce، Shopify و API اختصاصی با شناسه سفارش idempotent.", "Preview"],
] as const;

export default function OperationsControlsPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[30px] bg-[#0f223d] p-6 text-white sm:p-8">
          <div className="text-xs font-black text-[#63dfd4]">کنترل‌های عملیاتی پیشرفته</div>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">عملیات حرفه‌ای بدون شکستن حقیقت حسابداری.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/70">
            آرشیو، اعلان، فرم‌های سفارشی، بستن سال، تجمیع اسناد، تولید و اتصال فروشگاه روی یک اصل مشترک ساخته می‌شوند: هر خروجی مالی باید قابل ردیابی، قابل کنترل و قابل بازبینی باشد.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {capabilities.map(([title, description, status]) => (
            <article key={title} className="rounded-[26px] border border-black/5 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black">{title}</h2>
                <span className="rounded-full bg-[#eafaf8] px-2.5 py-1 text-[10px] font-black text-[#246d67]">{status}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app/commercial-controls" className="rounded-2xl bg-[#0f223d] px-5 py-3 text-sm font-black text-white">کنترل‌های تجاری</Link>
          <Link href="/app/treasury" className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-black">خزانه و چک</Link>
          <Link href="/app/reports/financial" className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-black">گزارش‌های مالی</Link>
        </div>
      </section>
    </main>
  );
}
