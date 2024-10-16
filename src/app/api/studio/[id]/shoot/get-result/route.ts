import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { replicate } from "@/lib/replicate";
import { NextResponse } from 'next/server';
import { uploadToR2 } from "@/actions/upload-to-r2";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { predictionDbId, pId } = await request.json();
        const studioId = params.id;
        
        const studio = await prisma.studio.findUnique({
          where: { id: studioId },
        });
        
        if (!studio) {
          return NextResponse.json({ error: "Studio not found" }, { status: 404 });
        }

        // Request predictions results
        const output = await replicate.predictions.get(pId as string); 
        
        if (output.status === "succeeded" && output.output && output.output.length > 0) {
            const originalImageUrl = output.output[0];
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;
            const newImageUrl = await uploadToR2(originalImageUrl, fileName);

            await prisma.prediction.update({
                where: { id: predictionDbId }, 
                data: { 
                    imageUrl: newImageUrl,
                    status: "completed"
                },
            });

            return NextResponse.json({ 
                success: true, 
                predictionId: predictionDbId, 
                pId: pId,
                imageUrl: newImageUrl,
                status: output.status
            });
        } else if (output.status === "failed") {
            console.log("Prediction failed");
            await prisma.prediction.update({
                where: { id: predictionDbId }, 
                data: { 
                    status: "failed"
                },
            });
        } else {
            // Processing status
            console.log("Prediction is still processing");
            await prisma.prediction.update({
                where: { id: predictionDbId }, 
                data: { 
                    status: "processing"
                },
            });
            return NextResponse.json({ 
                success: true, 
                predictionId: predictionDbId, 
                pId: pId,
                status: "processing"
            });
        }
        
        // Returns updated forecast information
        return NextResponse.json({ 
            success: true, 
            predictionId: predictionDbId, 
            pId: pId,
            imageUrl: output.output[0],
            status: output.status
        });
    } catch (error) {
        console.error("Error in shoot route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
