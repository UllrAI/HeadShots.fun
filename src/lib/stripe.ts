import Stripe from "stripe"
import { env } from "@/env.mjs"
import { prisma } from "@/lib/db"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
  typescript: true,
})

// commonly used Stripe related functions
export async function createCheckoutSession(
  amount: number,
  quantity: number,
  description: string,
  userId: string,
  emailAddress: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${quantity} Credits - HeadShots.fun`,
            description: description,
          },
          unit_amount: Math.round(amount * 100), // ensure amount is an integer
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${env.NEXT_PUBLIC_APP_URL}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId,
      credits: quantity.toString(),
    },
    customer_email: emailAddress, // add this line to pre-fill the customer's email address
    allow_promotion_codes: true, // add this line to enable coupon functionality
  });

  return session; // return the complete session object
}

export async function handleStripeWebhook(/* parameters */) {
  // implement the logic to handle Stripe webhooks
}

export async function handleSuccessfulPayment(sessionId: string) {
  const transaction = await prisma.stripeTransaction.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (transaction && transaction.status === 'completed') {
    return transaction; // Payment already processed
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  if (session.payment_status !== 'paid') {
    return null; // Payment not successful
  }

  const userId = session.metadata?.userId;
  const credits = parseInt(session.metadata?.credits || "0", 10);

  if (!userId || !credits) {
    throw new Error("Invalid metadata in session");
  }

  // Update transaction status
  const updatedTransaction = await prisma.stripeTransaction.update({
    where: { stripeSessionId: sessionId },
    data: { 
      status: "completed",
      stripePaymentIntentId: session.payment_intent as string || null
    },
  });

  // Update user credits
  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: { increment: credits },
    },
  });

  // Record credit transaction
  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: credits,
      type: "PURCHASE",
    },
  });

  return updatedTransaction;
}
