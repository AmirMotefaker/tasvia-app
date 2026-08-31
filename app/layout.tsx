import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "../src/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "تسوین | زیرساخت شفاف تسویه و عملیات مالی کسب‌وکارها",
    template: "%s | تسوین",
  },
  description:
    "تسوین یک پلتفرم برای مدیریت شفاف درخواست‌های تسویه، وضعیت پرداخت، شواهد مالی، تطبیق و گزارش‌پذیری کسب‌وکارها است.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: "تسوین",
    title: "تسوین | زیرساخت شفاف تسویه و عملیات مالی کسب‌وکارها",
    description:
      "مدیریت شفاف جریان تسویه، وضعیت پرداخت، شواهد مالی و گزارش‌پذیری برای کسب‌وکارها.",
  },
  twitter: {
    card: "summary_large_image",
    title: "تسوین | زیرساخت شفاف تسویه و عملیات مالی کسب‌وکارها",
    description:
      "مدیریت شفاف جریان تسویه، وضعیت پرداخت و گزارش‌پذیری برای کسب‌وکارها.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
