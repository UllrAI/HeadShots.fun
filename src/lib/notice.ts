import { env } from "@/env.mjs";

type NoticePayload = any;

export async function sendNotice(payload: NoticePayload): Promise<void> {
  if (!env.NOTICE_WEBHOOK_URL) {
    console.warn('NOTICE_WEBHOOK_URL is not set.');
    return;
  } else {
    console.log(env.NOTICE_WEBHOOK_URL);
    // your code here
  }
}
