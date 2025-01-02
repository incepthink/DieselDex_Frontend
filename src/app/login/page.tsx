"use client";

import LayoutWrapper from "@/components/common/LayoutWrapper";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const payload = {
      password: e.currentTarget.password.value,
    };

    try {
      const { data } = await axios.post("/api/auth/login", payload);
      alert(JSON.stringify("Login Successfull"));
      setLoading(false);

      Cookies.set("OutsideJWT", data.token, { expires: data.expiresIn });

      router.push("/");
      return;
    } catch (e) {
      const error = e as AxiosError;
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <LayoutWrapper>
      <div className='w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[#FAF7F0] to-[#F7D4C3]'>
        <div className='border-[#e16b31] border-2 rounded-md p-3'>
          <form onSubmit={handleSubmit}>
            <input
              type='password'
              name='password'
              id=''
              placeholder='Password'
              className='w-64 py-2 px-4 mr-3 rounded-sm'
              required
            />
            <button
              type='submit'
              className='bg-[#e16b31] text-white py-2 px-4 rounded-sm disabled:opacity-85'
              disabled={loading}
            >
              {loading ? "Loading.." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </LayoutWrapper>
  );
}
