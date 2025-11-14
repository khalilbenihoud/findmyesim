import type { Metadata, Viewport } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-epilogue",
});

export const metadata: Metadata = {
  title: "eSIM Comparator - Compare International eSIM Offers",
  description: "Compare international eSIM offers based on country, price, duration, and data volume",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={epilogue.variable}>
      <body className={`${epilogue.className} antialiased`}>
        <div className="flex h-screen flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

