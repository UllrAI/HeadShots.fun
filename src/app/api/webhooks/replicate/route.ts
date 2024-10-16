import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";
import { uploadToR2 } from "@/actions/upload-to-r2";

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const predictionId = searchParams.get('predictionId');

        if (!predictionId) {
            return NextResponse.json({ error: "Missing predictionId" }, { status: 400 });
        }

        const body = await request.json();
        const output = body.output;

        if (!output || !Array.isArray(output) || output.length === 0) {
            return NextResponse.json({ error: "Invalid output" }, { status: 400 });
        }

        const imageUrl = output[0];
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;
        const newImageUrl = await uploadToR2(imageUrl, fileName);

        await prisma.prediction.update({
            where: { id: predictionId },
            data: {
                status: "completed",
                imageUrl: newImageUrl,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in Replicate webhook:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
