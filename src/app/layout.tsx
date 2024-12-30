import type { Metadata } from "next";
import { satoshi } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diesel Dex",
  description: "The Fast and Secure Dex on Fuel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${satoshi.variable} font-satoshi antialiased`}>
        {children}
      </body>
    </html>
  );
}
