"use server";

import { cookies } from "next/headers";

export async function returnToken() {
  return cookies().get("OutsideJWT");
}
