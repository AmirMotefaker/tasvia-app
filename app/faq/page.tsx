import type { Metadata } from "next";
const faq=[
["تسویا چیست؟","تسویا یک محصول در حال توسعه برای مدیریت شفاف گردش‌کار تسویه، شواهد مالی، ذی‌نفعان، مغایرت‌گیری و گزارش عملیاتی کسب‌وکارهاست."],
["آیا تسویا اکنون پول جابه‌جا می‌کند؟","خیر. نسخه عمومی فعلی انتقال وجه واقعی یا اتصال فعال بانکی و PSP انجام نمی‌دهد."],
["رسید در تسویا به معنی تأیید پرداخت است؟","خیر. رسید و مدرک، شواهد عملیاتی هستند. تأیید قطعی پرداخت باید از منبع معتبر بانکی یا PSP دریافت شود."],
["چه نقش‌هایی در محیط کاری در نظر گرفته شده‌اند؟","مدل دسترسی محصول برای نقش‌های مالک، مدیر، مالی و مشاهده‌گر طراحی شده تا مجوزها از هویت کاربر جدا باشند."],
["مغایرت‌گیری چه کاری انجام می‌دهد؟","موارد ناسازگار یا فاقد شواهد کافی را برای بررسی و ثبت نتیجه در یک صف عملیاتی قرار می‌دهد؛ این قابلیت جای تأیید بانکی را نمی‌گیرد."],
["قیمت تسویا چقدر است؟","تعرفه عمومی هنوز نهایی نشده است. در مرحله دسترسی اولیه، دامنه پایلوت و نیاز عملیاتی ابتدا مشخص می‌شود."],
["API و Webhook عمومی وجود دارد؟","هنوز نه. یکپارچه‌سازی عمومی زمانی عرضه می‌شود که قرارداد داده، امنیت، احراز هویت و رفتار خطا برای استفاده Production آماده باشد."],
["تفاوت قابلیت آماده و برنامه توسعه چیست؟","در سایت، قابلیت‌های پیاده‌شده از موارد در حال تکمیل یا برنامه توسعه جدا نگه داشته می‌شوند تا وضعیت محصول بیش از واقعیت نمایش داده نشود."]
];
export const metadata: Metadata={title:"سوالات متداول",description:"پاسخ‌های روشن درباره تسویا، امنیت، تسویه، مغایرت‌گیری، قیمت‌گذاری و وضعیت قابلیت‌ها.",alternates:{canonical:"/faq"}};
export default function Page(){const schema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))};return <main className="min-h-screen bg-[#f4f7fb] px-4 py-14 text-[#0b1220] sm:px-6"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><div className="mx-auto max-w-5xl"><div className="max-w-3xl"><div className="text-xs font-black text-[#008f87]">راهنمای سریع</div><h1 className="mt-3 text-4xl font-black">سوالات متداول تسویا</h1><p className="mt-4 text-base leading-8 text-[#5f6c7e]">پاسخ‌های کوتاه، دقیق و بدون ادعای قابلیت‌هایی که هنوز Production نشده‌اند.</p></div><div className="mt-8 grid gap-3">{faq.map(([q,a])=><details key={q} className="group rounded-2xl border border-black/5 bg-white p-5"><summary className="cursor-pointer list-none font-black">{q}<span className="float-left text-[#008f87] group-open:rotate-45">＋</span></summary><p className="mt-4 max-w-3xl text-sm leading-7 text-[#657184]">{a}</p></details>)}</div></div></main>}
