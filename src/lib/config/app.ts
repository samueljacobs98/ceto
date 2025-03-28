import { z } from "zod";

const schema = z.object({
  baseURL: z.string(),
});

const config = schema.parse({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default config;
