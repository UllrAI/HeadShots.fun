import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Add this line to make the route dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const skip = (page - 1) * pageSize;

    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          amount: true,
          type: true,
          createdAt: true,
        },
      }),
      prisma.creditTransaction.count({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json({ transactions, total });
  } catch (error) {
    console.error("Error fetching credit transactions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}