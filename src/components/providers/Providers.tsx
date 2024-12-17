"use client";

import { ReactNode } from "react";
import FuelProviderWrapper from "./FuelProviderWrapper";

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  return <FuelProviderWrapper>{children}</FuelProviderWrapper>;
};

export default Providers;
