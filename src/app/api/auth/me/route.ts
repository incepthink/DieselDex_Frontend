import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body || !body.cookie) {
    return new NextResponse(
      JSON.stringify({
        isAuthenticated: false,
        error: "Authentication Failed",
      }),
      { status: 401 }
    );
  }
  const secret = process.env.JWT_SECRET || "";
const cookie = body.cookie
  console.log(body.cookie, 'cookie fron');
  
  try {
    verify(cookie, secret);
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