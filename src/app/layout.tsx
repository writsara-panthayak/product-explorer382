import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "รายการสินค้า",
  description: "ใบงาน React Hook Form, Zod และ External API",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
