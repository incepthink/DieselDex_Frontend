import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const MAX_AGE = 24 * 60 * 60;

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body || !body.password) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide a password" }),
      { status: 400 }
    );
  }

  const { password } = body;

  if (password !== process.env.PASSWORD) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication Failed" }),
      { status: 401 }
    );
  }

  const secret = process.env.JWT_SECRET || "";

  const token = sign(
    {
      password,
    },
    secret,
    {
      expiresIn: MAX_AGE,
    }
  );

  const serialized = serialize("OutsideJWT", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });

  const response = {
    status: "success",
  };

  return new NextResponse(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": serialized },
  });
}
