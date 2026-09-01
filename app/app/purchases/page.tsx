import Link from "next/link";

const quickActions = [
  ["فاکتور خرید جدید", "تأمین‌کننده، کالا یا خدمت، مالیات و سررسید را ثبت کنید."],
  ["پول دادم", "پرداخت را به بدهی‌های باز تأمین‌کننده تخصیص دهید."],
  ["برگشت از خرید", "اصلاح خرید و موجودی یا هزینه را با سابقه قابل حسابرسی ثبت کنید."],
];

const capabilities = [
  ["تأمین‌کنندگان", "مانده، سررسید، گردش حساب و اطلاعات تماس"],
  ["بدهی‌ها", "باز، سررسیدگذشته، تسویه جزئی و تسویه کامل"],
  ["ورود انبار", "خرید کالا مستقیماً گردش موجودی ایجاد می‌کند"],
  ["خدمات و هزینه", "خرید خدمت بدون ایجاد موجودی به حساب هزینه متصل می‌شود"],
  ["مالیات خرید", "مالیات ورودی به‌صورت مستقل در سند خرید ثبت می‌شود"],
  ["گزارش سررسید", "بدهی جاری، ۱ تا ۳۰، ۳۱ تا ۶۰، ۶۱ تا ۹۰ و بیش از ۹۰ روز"],
];

export default function PurchasesPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]" dir="rtl">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col gap-5 border-b border-black/5 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black text-[#008f87]">خرید و پرداخت</div>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">خرید، انبار و بدهی تأمین‌کننده در یک جریان</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657184]">فاکتور خرید را ثبت کنید؛ تسوین تشخیص می‌دهد کالا وارد انبار شود یا خدمت به هزینه برود و هم‌زمان بدهی و سند حسابداری را می‌سازد.</p>
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

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(([title, description]) => (
            <article key={title} className="rounded-[24px] border border-black/5 bg-white p-5">
              <h2 className="font-black">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#657184]">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-7 rounded-[30px] bg-[#0f223d] p-6 text-white sm:p-8">
          <div className="text-xs font-black text-[#63dfd4]">کنترل خودکار</div>
          <h2 className="mt-3 text-2xl font-black">هر خرید باید در سه دفتر با هم سازگار بماند.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">دفتر بدهی تأمین‌کننده، دفتر موجودی یا هزینه و دفتر حسابداری باید از یک رویداد واحد ساخته شوند. پرداخت نیز فقط از مسیر تخصیص کنترل‌شده، مانده بدهی را کاهش می‌دهد.</p>
        </section>
      </section>
    </main>
  );
}
