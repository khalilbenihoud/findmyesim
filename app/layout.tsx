import type { Metadata, Viewport } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}

