import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ credits: user.credits });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, type, userId } = await request.json();

  if (typeof amount !== 'number' || !['PURCHASE', 'USAGE', 'REFUND'].includes(type)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // 确保 amount 始终为正数
  const absoluteAmount = Math.abs(amount);

  const targetUserId = userId || session.user.id;

  // Check if the user is an admin when trying to modify another user's credits
  if (userId && userId !== session.user.id) {
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { credits: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const newCredits = user.credits + (type === 'USAGE' ? -absoluteAmount : absoluteAmount);

  if (newCredits < 0) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { credits: newCredits },
  });

  await prisma.creditTransaction.create({
    data: {
      userId: targetUserId,
      amount: absoluteAmount,
      type,
    },
  });

  return NextResponse.json({ credits: updatedUser.credits });
}
