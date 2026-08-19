import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سوقكم",
  description: "منصة جزائرية للبيع والشراء",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}