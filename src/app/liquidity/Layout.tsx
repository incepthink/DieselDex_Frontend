"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { getResponse } from "../swap/Layout";

export default function LiquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // useEffect(() => {
  //   (async () => {
  //     const { isAuthenticated, error } = await getResponse();

  //     if (error || !isAuthenticated) {
  //       router.push("/login");
  //       return;
  //     }

  //     setIsSuccess(true);
  //   })();
  // }, [router]);

  // if (!isSuccess) {
  //   return (
  //     <main className='w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[#FAF7F0] to-[#F7D4C3]'>
  //       <p className='text-4xl font-semibold text-[#e16b31]'>LOADING...</p>
  //     </main>
  //   );
  // }

  return <main>{children}</main>;
}
