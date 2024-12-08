import { Roboto } from "next/font/google";
import localFont from "next/font/local";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const satoshi = localFont({
  src: "./Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "100 300 400 500 700 900",
});
