import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { auth } from "@/auth";
import { env } from "@/env.mjs";

const CLOUDFLARE_R2_ENDPOINT = env.CLOUDFLARE_R2_ENDPOINT;
const CLOUDFLARE_R2_ACCESS_KEY_ID = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_R2_BUCKET_NAME = env.CLOUDFLARE_R2_BUCKET_NAME;
const CLOUDFLARE_R2_PUBLIC_URL = env.CLOUDFLARE_R2_PUBLIC_URL;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

// 定义一个新的接口来扩展 NextRequest
interface AuthenticatedRequest extends NextRequest {
    auth: {
        user: any; // 你可能想要使用更具体的用户类型
    } | null;
}

export const POST = auth(async (req: AuthenticatedRequest) => {
    if (!req.auth || !req.auth.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        // Generate a unique filename using timestamp and a random string
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uniqueId}.${fileExtension}`;

        const buffer = await file.arrayBuffer();

        const uploadResult = await s3Client.send(
            new PutObjectCommand({
                Bucket: CLOUDFLARE_R2_BUCKET_NAME,
                Key: fileName,
                Body: Buffer.from(buffer),
                ContentType: file.type,
            })
        );

        const url = `${CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`;
        return NextResponse.json({ url });
    } catch (error) {
        return new NextResponse(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
});