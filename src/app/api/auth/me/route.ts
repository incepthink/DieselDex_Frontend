import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

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
    const verified = verify(token, secret);

    //@ts-expect-error json
    if (verified.password === process.env.PASSWORD) {
      return new NextResponse(
        JSON.stringify({ isAuthenticated: true, error: null }),
        {
          status: 200,
        }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          isAuthenticated: false,
          error: "Authentication Failed",
        }),
        { status: 401 }
      );
    }
  } catch (e) {
    return new NextResponse(
      JSON.stringify({ isAuthenticated: false, error: "something went wrong" }),
      { status: 400 }
    );
  }
}
