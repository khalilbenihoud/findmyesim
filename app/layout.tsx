import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eSIM Comparator - Compare International eSIM Offers",
  description: "Compare international eSIM offers based on country, price, duration, and data volume",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

