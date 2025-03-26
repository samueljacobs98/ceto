import mongoose from "mongoose";
import config from "../config";

// @ts-expect-error - TS7017
let cached = global.mongoose;

if (!cached) {
  // @ts-expect-error - TS7017
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(config.mongodb.connectionString, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
