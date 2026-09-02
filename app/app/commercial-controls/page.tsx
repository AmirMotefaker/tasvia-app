import Link from "next/link";
import { WorkspaceShell } from "../../../src/components/workspace/shell";

const capabilities = [
  ["چندارزی", "ثبت مبلغ با ارز منبع، نرخ صریح و اثر تسعیر بدون محاسبات اعشاری شناور."],
  ["فروش اقساطی", "تقسیم دقیق مبلغ به اقساط، سررسید، مانده و پیگیری پرداخت هر قسط."],
  ["سطوح قیمت", "قیمت عمده، همکار، ویژه و سیاست‌های اختصاصی مشتری روی یک قیمت پایه."],
  ["تخفیف هوشمند", "قواعد درصدی و مبلغ ثابت با حداقل خرید، بازه زمانی و سقف امن."],
  ["پورسانت فروش", "محاسبه پورسانت بازاریاب بر مبنای فروش ناخالص یا خالص پس از تخفیف."],
  ["بارکد", "شناسه امن کالا برای چاپ، اسکن و اتصال به عملیات انبار و فروش."],
  ["بانک و چک", "خزانه، دریافت و پرداخت، سررسید چک و مغایرت‌گیری روی دفتر واقعی."],
] as const;

export default function CommercialControlsPage() {
  return (
    <WorkspaceShell title="کنترل‌های تجاری" eyebrow="فروش حرفه‌ای" actions={<Link href="/app/sales" className="rounded-xl bg-[#102845] px-3 py-2 text-xs font-black text-white">فروش و فاکتور</Link>}>
      <section className="rounded-[26px] bg-[#102845] p-5 text-white sm:p-7">
        <h2 className="text-2xl font-black">قیمت، ارز، تخفیف و اقساط روی یک حقیقت مالی.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">تمام کنترل‌های تجاری باید روی همان سند، مانده و دفتر حسابداری کار کنند؛ بدون لایه نمایشی جدا و بدون اقدام مالی برگشت‌ناپذیر خودکار.</p>
      </section>
      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {capabilities.map(([title, description]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-black">{title}</h2><span className="rounded-full bg-[#e8faf7] px-2.5 py-1 text-[10px] font-black text-[#007f78]">هسته فعال</span></div><p className="mt-3 text-sm leading-7 text-[#657184]">{description}</p></article>)}
      </section>
      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">دقت مالی</div><p className="mt-2 text-sm leading-7 text-[#657184]">پول با واحد صحیح نگهداری می‌شود تا اختلاف اعشاری در قیمت، تخفیف و اقساط ایجاد نشود.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">کنترل انسانی</div><p className="mt-2 text-sm leading-7 text-[#657184]">اتوماسیون پیشنهاد می‌دهد؛ عملیات حساس همچنان Approval می‌خواهد.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-black text-[#0b8d85]">اتصال عملیاتی</div><p className="mt-2 text-sm leading-7 text-[#657184]">کنترل‌ها به فروش، انبار و خزانه متصل‌اند و از مسیرهای همان Workspace استفاده می‌کنند.</p></article>
      </section>
    </WorkspaceShell>
  );
}
