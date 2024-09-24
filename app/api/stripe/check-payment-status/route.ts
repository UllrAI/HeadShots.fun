import { handleSuccessfulPayment } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const transaction = await handleSuccessfulPayment(sessionId);
    return NextResponse.json({ status: transaction ? 'completed' : 'pending' });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Error processing payment" }, { status: 500 });
  }
}