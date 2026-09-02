import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const capabilities = [
  ["آرشیو مدارک", "ضمیمه امن فاکتور، رسید، چک و قرارداد با هش محتوای قابل ردیابی."],
  ["پیامک و اعلان‌ها", "قرارداد چندکاناله برای سررسید، پرداخت، کمبود موجودی و مغایرت؛ ارسال واقعی فقط با Provider مجاز."],
  ["فرم‌ساز", "فیلدهای سفارشی کنترل‌شده برای فرایندهای داخلی بدون تغییر هسته حسابداری."],
  ["بستن سال مالی", "Gate سخت‌گیرانه برای اسناد ثبت‌نشده، مغایرت‌های بحرانی و حساب سود و زیان انباشته."],
  ["تجمیع اسناد", "تجمیع کنترل‌شده خطوط هم‌حساب بدون از بین‌بردن Traceability اسناد منبع."],
  ["تولید و BOM", "محاسبه بهای مواد اولیه با واحدهای پول صحیح و مرز روشن برای ثبت تولید."],
  ["فروشگاه آنلاین", "Envelope استاندارد برای WooCommerce، Shopify و API اختصاصی با شناسه سفارش idempotent."],
] as const;

export default function OperationsControlsPage() {
  return (
    <WorkspaceShell title="کنترل‌های عملیاتی" eyebrow="عملیات پیشرفته" actions={<Link href="/app/reports/financial" className="rounded-xl bg-[#102845] px-3 py-2 text-xs font-black text-white">گزارش‌ها</Link>}>
      <section className="rounded-[26px] bg-[#102845] p-5 text-white sm:p-7"><h2 className="text-2xl font-black">عملیات پیشرفته بدون شکستن Traceability.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">آرشیو، اعلان، فرم، بستن سال، تجمیع، تولید و فروشگاه آنلاین باید همگی قابل کنترل، قابل Audit و متصل به حقیقت حسابداری باشند.</p></section>
      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{capabilities.map(([title, description]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-black">{title}</h2><span className="rounded-full bg-[#fff7df] px-2.5 py-1 text-[10px] font-black text-[#8f6a00]">کنترل‌شده</span></div><p className="mt-3 text-sm leading-7 text-[#657184]">{description}</p></article>)}</section>
    </WorkspaceShell>
  );
}
