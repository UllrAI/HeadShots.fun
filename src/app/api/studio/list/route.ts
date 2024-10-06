import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const userStudios = await prisma.studio.findMany({
            where: { userId: currentUser.id },
            include: {
                predictions: {
                    select: {
                        id: true,
                        createdAt: true,
                        imageUrl: true,
                        status: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        return NextResponse.json(userStudios);
    } catch (error) {
        console.error("Error fetching studios:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}