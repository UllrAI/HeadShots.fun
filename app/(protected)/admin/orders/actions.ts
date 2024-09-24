'use server';

import { prisma } from "@/lib/db";
import { handleSuccessfulPayment } from "@/lib/stripe";

export async function handleCheck(stripeSessionId: string) {
  try {
    const transaction = await handleSuccessfulPayment(stripeSessionId);
    return transaction ? "completed" : "pending";
  } catch (error) {
    console.error("Error checking Stripe session:", error);
    return "error";
  }
}

export async function getTransactions() {
  return await prisma.stripeTransaction.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}