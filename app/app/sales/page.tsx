import Link from "next/link";

const quickActions = [
  ["فاکتور فروش جدید", "مشتری، کالا یا خدمت، تخفیف، مالیات و سررسید را در یک مسیر ثبت کنید."],
  ["پول گرفتم", "دریافت مشتری را ثبت و مستقیماً به طلب‌های باز تخصیص دهید."],
  ["برگشت از فروش", "Credit Note کنترل‌شده بسازید و طلب، درآمد و مالیات را اصلاح کنید."],
];

const states = [
  ["پیش‌نویس", "آماده ویرایش قبل از صدور"],
  ["صادرشده", "طلب مشتری و سند حسابداری ایجاد شده"],
  ["تسویه جزئی", "بخشی از مبلغ دریافت شده"],
  ["تسویه‌شده", "مانده دریافتنی صفر"],
  ["برگشت‌خورده", "اصلاح کامل با سند برگشت"],
];

export default function SalesPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col gap-5 border-b border-black/5 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black text-[#008f87]">فروش و دریافت</div>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">فاکتور فروش، بدون پیچیدگی حسابداری</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657184]">شما فروش را ثبت می‌کنید؛ تسوین پشت صحنه طلب مشتری، مالیات، سند حسابداری و وضعیت تسویه را کنترل می‌کند.</p>
          </div>
          <Link href="/app" className="text-sm font-black text-[#007d75]">بازگشت به میزکار</Link>
        </header>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {quickActions.map(([title, description], index) => (
            <article key={title} className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_14px_45px_rgba(15,34,61,.05)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e5f8f5] text-sm font-black text-[#007d75]">{index + 1}</div>
              <h2 className="mt-5 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#657184]">{description}</p>
            </article>
          ))}
        </div>

        <section className="mt-7 overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_14px_45px_rgba(15,34,61,.05)]">
          <div className="border-b border-black/5 p-6">
            <div className="text-xs font-black text-[#008f87]">چرخه فاکتور</div>
            <h2 className="mt-2 text-2xl font-black">هر فاکتور یک وضعیت روشن دارد</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5">
            {states.map(([title, description]) => (
              <div key={title} className="border-b border-black/5 p-5 last:border-b-0 sm:border-l lg:border-b-0">
                <div className="font-black">{title}</div>
                <div className="mt-2 text-xs leading-6 text-[#738094]">{description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-[30px] bg-[#0f223d] p-6 text-white sm:p-8">
          <div className="text-xs font-black text-[#63dfd4]">حسابداری خودکار</div>
          <h2 className="mt-3 text-2xl font-black">فاکتور صادر می‌شود؛ ثبت حسابداری از قلم نمی‌افتد.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">صدور فاکتور، حساب دریافتنی مشتری و سند درآمد/مالیات را ایجاد می‌کند. دریافت وجه به طلب تخصیص می‌یابد و برگشت از فروش نیز مانده طلب و سند مربوط را اصلاح می‌کند.</p>
        </section>
      </section>
    </main>
  );
}
