import axios from "axios";
import { BackendUrl } from "../constants";
import { clientAxios } from "@/utils/common";

export async function getBaseAssetPrice(address: string) {
  const response = await clientAxios.get(
    `${BackendUrl}/assets/price/${address}`
  );
  const data = await response.data.data;
  console.log("data::", data);
  return data;
}

export async function getBaseAssetSupply(address: string) {
  const response = await clientAxios.get(
    `${BackendUrl}/assets/supply/${address}`
  );
  const data = await response.data.data;
  console.log("data::", data);
  return data;
}
