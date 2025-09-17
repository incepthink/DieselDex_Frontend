"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function LiquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
      <GoogleAnalytics gaId="G-LEDP7GJQXL" />
    </>
  );
}
