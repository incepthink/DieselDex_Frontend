import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = cookies();

  const token = cookieStore.get("OutsideJWT");

  if (!token) {
    return new NextResponse(
      JSON.stringify({
        isAuthenticated: false,
        error: "Authentication Failed",
      }),
      { status: 401 }
    );
  }

  const secret = process.env.JWT_SECRET || "";

  try {
    verify(token.value, secret);

    return new NextResponse(
      JSON.stringify({ isAuthenticated: true, error: null }),
      {
        status: 200,
      }
    );
  } catch (e) {
    return new NextResponse(
      JSON.stringify({ isAuthenticated: false, error: "something went wrong" }),
      { status: 400 }
    );
  }
}
