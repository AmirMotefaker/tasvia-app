import Link from "next/link";
import Image from "next/image";

const features = [
  ["درخواست تسویه", "فرآیند درخواست و بررسی تسویه را از پیام‌ها و فایل‌های پراکنده به یک مسیر قابل پیگیری منتقل کنید."],
  ["شواهد و تطبیق", "رسیدها و شواهد به‌عنوان مدرک عملیات نگهداری می‌شوند و با وضعیت‌های قابل حسابرسی همراه هستند."],
  ["دید مالی", "تصویر یکپارچه‌ای از وضعیت درخواست‌ها، مبالغ، ذی‌نفعان و تاریخچه عملیات داشته باشید."],
];

const steps = [
  "ایجاد یا انتخاب کسب‌وکار",
  "ثبت ذی‌نفع و مبلغ",
  "بررسی جزئیات و شواهد",
  "تأیید وضعیت در یک مسیر قابل پیگیری",
];

const audiences = ["کافه و رستوران", "فروشگاه و خرده‌فروشی", "کسب‌وکار چندشعبه‌ای", "تیم‌های مالی و عملیاتی"];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tasvia",
  alternateName: "تسویا",
  url: "https://tasvia.ir",
  logo: "https://tasvia.ir/brand/tasvia-avatar.svg",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "تسویا",
  alternateName: "Tasvia",
  url: "https://tasvia.ir",
  inLanguage: "fa-IR",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0b1220]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f4f7fb]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="صفحه اصلی تسویا">
            <Image src="/brand/tasvia-avatar.svg" alt="لوگوی تسویا" width={40} height={40} priority className="rounded-2xl" />
            <div>
              <div className="font-black">تسویا</div>
              <div className="text-[10px] text-[#6e7888]">Tasvia</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-bold text-[#4f5c6f] md:flex">
            <Link href="/product">محصول</Link>
            <Link href="/solutions">راهکارها</Link>
            <Link href="/security">امنیت و شفافیت</Link>
            <Link href="/pricing">تعرفه</Link>
            <Link href="/about">درباره تسویا</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/demo" className="rounded-2xl border border-black/10 px-4 py-2.5 text-xs font-extrabold">مشاهده دمو</Link>
            <Link href="/contact" className="hidden rounded-2xl bg-[#0f223d] px-4 py-2.5 text-xs font-extrabold text-white sm:inline-flex">درخواست دسترسی</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-24">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#00a99d]/20 bg-[#eafaf8] px-3 py-2 text-xs font-black text-[#007d75]">
            زیرساخت شفاف عملیات مالی کسب‌وکارها
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.35] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            تسویه کسب‌وکار را از یک فرایند پراکنده به یک جریان قابل پیگیری تبدیل کنید.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f6c7e] sm:text-lg">
            تسویا برای مدیریت درخواست‌های تسویه، وضعیت پرداخت، شواهد مالی، تطبیق و گزارش‌پذیری طراحی شده است؛ با تمرکز بر شفافیت عملیاتی و تجربه‌ای ساده برای تیم‌های مالی و صاحبان کسب‌وکار.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="min-h-12 rounded-2xl bg-[#0f223d] px-6 py-3.5 text-center text-sm font-black text-white">درخواست دسترسی اولیه</Link>
            <Link href="/demo" className="min-h-12 rounded-2xl border border-black/10 bg-white px-6 py-3.5 text-center text-sm font-black">مشاهده جریان دمو</Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {audiences.map((item) => (
              <span key={item} className="rounded-full border border-black/5 bg-white px-3 py-2 text-xs font-bold text-[#586577]">{item}</span>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-[#0f223d] p-5 text-white shadow-[0_30px_80px_rgba(15,34,61,0.18)] sm:p-7">
          <div className="text-xs font-black text-[#63dfd4]">نمونه تجربه تسویا</div>
          <div className="mt-3 text-2xl font-black">مسیر شفاف یک تسویه</div>
          <div className="mt-6 space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-[#0f223d]">{index + 1}</div>
                <div className="pt-1 text-sm font-bold text-white/90">{step}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-[#132b4b] p-4 text-xs leading-6 text-white/70">
            نسخه دمو هیچ انتقال وجه، اتصال بانکی یا عملیات واقعی پرداخت انجام نمی‌دهد.
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {features.map(([title, text]) => (
            <article key={title} className="rounded-[24px] border border-black/5 bg-[#f8fafc] p-5">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#657184]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs font-black text-[#008f87]">چرا تسویا؟</div>
            <h2 className="mt-3 text-3xl font-black leading-[1.45]">برای وقتی که پیام، رسید، اکسل و پیگیری دستی دیگر کافی نیست.</h2>
          </div>
          <div className="space-y-4 text-sm leading-8 text-[#5f6c7e]">
            <p>هدف تسویا این است که عملیات مالی روزمره کسب‌وکارها قابل مشاهده، قابل پیگیری و قابل توضیح باشد. هر وضعیت باید دلیل و تاریخچه مشخص داشته باشد.</p>
            <p>ما درباره «تأیید بانکی» یا «تسویه قطعی» ادعای خودکار نمی‌کنیم مگر زمانی که یک منبع معتبر پرداخت یا بانکی آن را تأیید کند. این تفکیک برای اعتماد و حسابرسی ضروری است.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#eef3f8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-black text-[#008f87]">فراتر از تأیید یک پرداخت</div>
            <h2 className="mt-3 text-3xl font-black leading-[1.45]">تسویا برای کل عملیات تسویه و تصویر مالی اطراف آن ساخته می‌شود.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/settlement-management" className="rounded-3xl bg-white p-5"><div className="text-[10px] font-black text-[#008f87]">در حال تکمیل</div><div className="mt-2 font-black">مدیریت تسویه</div></Link>
            <Link href="/financial-intelligence" className="rounded-3xl bg-white p-5"><div className="text-[10px] font-black text-[#008f87]">هسته محصول</div><div className="mt-2 font-black">هوشمندی مالی</div></Link>
            <Link href="/integrations" className="rounded-3xl bg-white p-5"><div className="text-[10px] font-black text-[#9a7410]">برنامه توسعه</div><div className="mt-2 font-black">یکپارچه‌سازی‌ها</div></Link>
            <Link href="/compare/variza" className="rounded-3xl bg-white p-5"><div className="text-[10px] font-black text-[#596678]">مقایسه شفاف</div><div className="mt-2 font-black">مقایسه با واریزا</div></Link>
          </div>
        </div>
      </section>
      <section className="bg-[#0f223d] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="text-xs font-black text-[#63dfd4]">دسترسی اولیه تسویا</div>
            <h2 className="mt-2 text-2xl font-black">برای پایلوت و همکاری محصول با ما در ارتباط باشید.</h2>
          </div>
          <Link href="/contact" className="rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-black text-[#0f223d]">شروع گفتگو</Link>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <div className="font-black">تسویا</div>
            <p className="mt-2 max-w-xl text-xs leading-6 text-[#758094]">زیرساخت مدیریت شفاف درخواست‌های تسویه و عملیات مالی کسب‌وکارها.</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold text-[#596678]">
            <Link href="/product">محصول</Link>
            <Link href="/security">امنیت</Link>
            <Link href="/pricing">تعرفه</Link>
            <Link href="/about">درباره</Link>
            <Link href="/developers">توسعه‌دهندگان</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">تماس</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
