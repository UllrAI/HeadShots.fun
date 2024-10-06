import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { env } from "@/env.mjs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/pricing?error=missing_session_id", env.NEXT_PUBLIC_APP_URL));
  }

  // 直接重定向到支付状态页面
  return NextResponse.redirect(new URL(`/payment-status?session_id=${sessionId}`, env.NEXT_PUBLIC_APP_URL));
}