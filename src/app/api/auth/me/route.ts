import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("OutsideJWT");

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
