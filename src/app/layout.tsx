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
      <body
        style={{ backgroundImage: "url('/images/main-bg.jpg')" }}
        className={`bg-center bg-cover bg-fixed ${orbitron.variable} antialiased`}
      >
        <div>{children}</div>
      </body>
    </html>
  );
}
