import { env } from "@/env.mjs"
import Replicate from "replicate"

export const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
})
