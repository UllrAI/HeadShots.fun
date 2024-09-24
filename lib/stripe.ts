import Stripe from "stripe"
import { env } from "@/env.mjs"
import { prisma } from "@/lib/db"  // 修改这一行

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
  typescript: true,
})

// 添加一些常用的Stripe相关函数
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
            name: `${quantity} Credits of HeadShots.fun`,
            description: description,
          },
          unit_amount: Math.round(amount * 100), // 确保金额是整数
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
    customer_email: emailAddress, // 添加这一行来预填充客户的电子邮件地址
  });

  return session; // 返回完整的 session 对象
}

export async function handleStripeWebhook(/* 参数 */) {
  // 实现处理Stripe webhook的逻辑
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

// ... 其他可能需要的Stripe相关函数
