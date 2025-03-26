import { z } from "zod";

const schema = z.object({
  connectionString: z.string(),
});

const config = schema.parse({
  connectionString: process.env.MONGODB_CONNECTION_STRING,
});

export default config;
