import type { Metadata } from "next";
import { orbitron, satoshi } from "./fonts";
import "./globals.css";
import FeedbackWidget from "@/components/ui/feedbackWidget/FeedbackWidget";

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
    <html lang="en">
      <body className={`${orbitron.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
