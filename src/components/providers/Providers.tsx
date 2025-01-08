"use client";

import { ReactNode, Suspense } from "react";
import FuelProviderWrapper from "./FuelProviderWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryParamProvider } from "use-query-params";
import NextAdapterApp from "next-query-params/app";

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
  return <FuelProviderWrapper>{children}</FuelProviderWrapper>;
};

export default Providers;
