import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tasvia — Financial Operations Preview",
  description:
    "Tasvia product preview for transparent settlement, cash-flow visibility and financial intelligence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
