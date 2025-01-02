"use server";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

interface response {
  isAuthenticated: boolean;
  error: AxiosError | null | string;
}

export async function getResponse(): Promise<response> {
  try {
    const token = cookies().get("OutsideJWT");

    if (!token) {
      return {
        isAuthenticated: false,
        error: "No token",
      };
    }

    const { data } = await axios.get("/api/auth/me", {
      params: {
        isCustom: true,
      },
      headers: {
        Cookie: `${token};`,
      },
    });

    return {
      isAuthenticated: data.isAuthenticated,
      error: null,
    };
  } catch (e) {
    const error = e as AxiosError;

    return {
      isAuthenticated: false,
      error,
    };
  }
}
