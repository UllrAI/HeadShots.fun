import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { replicate } from "@/lib/replicate";
import { NextResponse } from 'next/server';
import { env } from "@/env.mjs";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { prompt, negative_prompt, aspectRatio, style } = await request.json();
        const studioId = params.id;
        
        const studio = await prisma.studio.findUnique({
          where: { id: studioId },
        });
        
        if (!studio) {
          return NextResponse.json({ error: "Studio not found" }, { status: 404 });
        }
        
        const default_negative_prompt = "flaws in the eyes, flaws in the face, flaws, lowres, non-HDRi, low quality, worst quality,artifacts noise, text, watermark, glitch, deformed, mutated, ugly, disfigured, hands, low resolution, partially rendered objects,  deformed or partially rendered eyes, deformed, deformed eyeballs, cross-eyed,blurry,border, picture frame";
        const final_prompt = prompt.replace(`{prompt}`, `a ${studio.type} `) + `,headshot of a ${studio.type} `;
        console.log("final_prompt", final_prompt);

        // Set width and height based on aspectRatio
        let width, height;
        switch (aspectRatio) {
            case "Portrait":
                width = 768;
                height = 1024;
                break;
            case "Landscape":
                width = 1024;
                height = 768;
                break;
            case "Square":
                width = 768;
                height = 768;
                break;
            default:
                return NextResponse.json({ error: "Invalid aspect ratio" }, { status: 400 });
        }

        const input = {
            main_face_image: studio.images[0],
            ...(studio.images.length > 1 && { auxiliary_face_image1: studio.images[1] }),
            ...(studio.images.length > 2 && { auxiliary_face_image2: studio.images[2] }),
            ...(studio.images.length > 3 && { auxiliary_face_image3: studio.images[3] }),
            prompt: final_prompt,
            negative_prompt: negative_prompt || default_negative_prompt,
            cfg_scale: 1.2,
            num_steps: 4,
            image_width: width,
            image_height: height,
            identity_scale: 0.8,
            generation_mode: "fidelity",
            num_samples: 1,
            output_format: "png"
        };
        
        const webhookUrl = `${env.NEXT_PUBLIC_APP_URL}/api/webhooks/replicate`;
        console.log("webhookUrl", webhookUrl);
        const prediction = await prisma.prediction.create({
            data: {
                studioId,
                style: style,
                status: "pending",
            },
        });

        try {
            //Using the new version of https://replicate.com/visoar/headshots.fun
            const output = await replicate.predictions.create({
                version: "5826f6bb95918f0c468b12eb0ea982aab7f0a8e08cd8365bff0a7f951da20661",
                input: input,
                webhook: `${webhookUrl}?predictionId=${prediction.id}`,
                webhook_events_filter: ["completed"]
            });

            // Update the prediction with the pId
            await prisma.prediction.update({
                where: { id: prediction.id },
                data: { 
                    pId: output.id,
                    status: "processing"
                },
            });

            return NextResponse.json({ success: true, predictionId: prediction.id });
        } catch (replicateError) {
            console.error("Error creating Replicate prediction:", replicateError);
            
            // Update prediction status to 'failed'
            await prisma.prediction.update({
                where: { id: prediction.id },
                data: { status: "failed" },
            });

            return NextResponse.json({ error: "Failed to create prediction" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in shoot route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

