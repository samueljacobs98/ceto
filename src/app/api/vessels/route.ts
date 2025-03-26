import { Vessel } from "@/lib/models";
import { connectDB } from "@/lib/db";

export async function GET(): Promise<Response> {
  await connectDB();

  const activeVessels = await Vessel.find({ status: "Active" });

  return new Response(JSON.stringify(activeVessels), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
