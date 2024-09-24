import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { replicate } from "@/lib/replicate";
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { predictionDbId, pId } = await request.json(); // 添加 pId
        const studioId = params.id;
        
        const studio = await prisma.studio.findUnique({
          where: { id: studioId },
        });
        
        if (!studio) {
          return NextResponse.json({ error: "Studio not found" }, { status: 404 });
        }

        // 请求 predictions 结果
        const output = await replicate.predictions.get(pId as string); 
        
        // 检查 output.status 和 output.output
        if (output.status === "succeeded" && output.output && output.output.length > 0) {
            await prisma.prediction.update({
                where: { id: predictionDbId }, 
                data: { 
                    imageUrl: output.output[0],
                    status: "completed"
                },
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
            // 处理中的状态
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
        
        // 返回更新后的预测信息
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

