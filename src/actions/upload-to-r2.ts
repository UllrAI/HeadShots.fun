import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from "@/env.mjs";

const s3Client = new S3Client({
    region: 'auto',
    endpoint: env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

export async function uploadToR2(imageUrl: string, fileName: string): Promise<string> {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();

    await s3Client.send(
        new PutObjectCommand({
            Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: `results/${fileName}`,
            Body: Buffer.from(arrayBuffer),
            ContentType: 'image/png',
        })
    );

    return `${env.CLOUDFLARE_R2_PUBLIC_URL}/results/${fileName}`;
}
