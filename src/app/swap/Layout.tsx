// import { returnToken } from "@/components/auth";
import React, { useEffect, useState } from "react";

export default function SwapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
