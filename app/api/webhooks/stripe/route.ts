import Stripe from 'stripe';
import { headers } from "next/headers";
import { stripe, handleSuccessfulPayment } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { env } from "@/env.mjs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await handleSuccessfulPayment(session.id);
    } catch (error) {
      console.error("Error processing successful payment:", error);
      return NextResponse.json({ error: "Error processing payment" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
