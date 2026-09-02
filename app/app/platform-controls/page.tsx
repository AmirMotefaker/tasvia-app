import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const controls = [
  ["سامانه مودیان", "صف ارسال صورتحساب الکترونیکی با idempotency، وضعیت ارسال و مرجع پذیرش یا رد."],
  ["استعلام‌های رسمی", "هویت، شبا، کارت و کدپستی با Provider رسمی و مجوز محیط عملیاتی."],
  ["کارتخوان و POS", "ثبت ترمینال، Provider، حساب بانکی مقصد و وضعیت فعال برای تطبیق خزانه."],
  ["تأییدهای چندمرحله‌ای", "کنترل عملیات حساس بر اساس نقش، نوع عملیات و حداقل تعداد تأیید."],
  ["پشتیبان‌گیری و بازیابی", "Manifest نسخه‌دار، checksum و الزام رمزنگاری برای داده‌های مالی و مدارک."],
  ["فارسی و انگلیسی", "زیرساخت locale محصول با فارسی به‌عنوان زبان پیش‌فرض و انگلیسی برای تجربه بین‌المللی."],
] as const;

export default function PlatformControlsPage() {
  return (
    <WorkspaceShell title="تنظیمات و اتصال" eyebrow="انطباق و امنیت" actions={<Link href="/app/operations-controls" className="rounded-xl bg-[#102845] px-3 py-2 text-xs font-black text-white">عملیات</Link>}>
      <section className="rounded-[26px] bg-[#102845] p-5 text-white sm:p-7"><h2 className="text-2xl font-black">مرز امن اتصال تسوین به سرویس‌های رسمی.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">هیچ عملیات بانکی، مالیاتی یا استعلام واقعی بدون Provider معتبر، credential سالم و مجوز Production فعال نمی‌شود.</p></section>
      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{controls.map(([title, description]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-black">{title}</h2><span className="rounded-full bg-[#eef3f8] px-2.5 py-1 text-[10px] font-black text-[#536176]">محافظت‌شده</span></div><p className="mt-3 text-sm leading-7 text-[#657184]">{description}</p></article>)}</section>
    </WorkspaceShell>
  );
}
