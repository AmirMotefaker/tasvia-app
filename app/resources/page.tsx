import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata={title:"مرکز منابع",description:"راهنماهای تسوین درباره عملیات تسویه، کنترل داخلی، شواهد مالی و مغایرت‌گیری.",alternates:{canonical:"/resources"}};
const guides=[
["راهنمای چرخه تسویه","از ثبت درخواست تا بررسی وضعیت و نگهداری ردپای عملیاتی.","/settlement-management"],
["مغایرت‌گیری چیست؟","چطور موارد ناسازگار را از تأیید قطعی بانکی جدا کنیم.","/reconciliation"],
["مدیریت تأمین‌کنندگان","زمینه همکاری، شواهد و سابقه عملیات هر ذی‌نفع.","/suppliers"],
["امنیت و شفافیت","مرز هویت، مجوز، audit trail و ادعاهای مالی.","/security"],
["هوشمندی مالی","چطور تحلیل را از اجرای عملیات مالی جدا نگه داریم.","/financial-intelligence"],
["تسوین در برابر واریزا","مقایسه مستند دامنه محصول و وضعیت قابلیت‌ها.","/compare/variza"]
];
export default function Page(){return <main className="min-h-screen bg-[#f4f7fb] px-4 py-14 text-[#0b1220] sm:px-6"><div className="mx-auto max-w-6xl"><div className="max-w-3xl"><div className="text-xs font-black text-[#008f87]">دانش عملیاتی</div><h1 className="mt-3 text-4xl font-black">مرکز منابع تسوین</h1><p className="mt-4 text-base leading-8 text-[#5f6c7e]">محتوای ساختاریافته برای تصمیم‌گیری بهتر در عملیات تسویه و کنترل مالی؛ با تفکیک روشن بین شواهد داخلی و تأیید منابع مالی معتبر.</p></div><section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{guides.map(([a,b,h])=><Link key={a} href={h} className="group rounded-[26px] border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"><div className="text-lg font-black">{a}</div><p className="mt-3 text-sm leading-7 text-[#657184]">{b}</p><div className="mt-5 text-xs font-black text-[#008f87]">مطالعه ←</div></Link>)}</section><div className="mt-6 rounded-[28px] bg-[#0f223d] p-6 text-white sm:flex sm:items-center sm:justify-between"><div><div className="font-black">پاسخ کوتاه می‌خواهید؟</div><p className="mt-2 text-sm text-white/60">FAQ وضعیت محصول و مهم‌ترین مرزهای عملیاتی را یکجا توضیح می‌دهد.</p></div><Link href="/faq" className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#0f223d] sm:mt-0">سوالات متداول</Link></div></div></main>}
