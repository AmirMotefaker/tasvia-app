import Link from "next/link";

const items = [
  ["/app", "نمای کلی"],
  ["/app/settlements", "تسویه‌ها"],
  ["/app/suppliers", "تأمین‌کنندگان"],
  ["/app/reconciliation", "مغایرت‌گیری"],
  ["/app/reports", "گزارش‌ها"],
];

export function WorkspaceNav() {
  return (
    <nav aria-label="ناوبری محیط کاری" className="flex gap-2 overflow-x-auto pb-1">
      {items.map(([href,label]) => (
        <Link key={href} href={href} className="whitespace-nowrap rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-[#344154] hover:border-[#008f87]/40">
          {label}
        </Link>
      ))}
    </nav>
  );
}
