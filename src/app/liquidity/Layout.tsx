"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LiquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
