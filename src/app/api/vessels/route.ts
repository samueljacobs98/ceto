"use server";

import { queryVesselData } from "@/lib/db/queries";
import { validateGetVessels } from "@/lib/validate";

export async function GET(req: Request) {
  try {
    const validationOutcome = validateGetVessels(req);
    if (!validationOutcome.success) {
      return new Response(JSON.stringify(validationOutcome.error), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const [activeVessels, total, limit] = await queryVesselData(
      validationOutcome.data
    );

    return new Response(
      JSON.stringify({
        activeVessels: activeVessels.map((vessel) => ({
          id: `${vessel._id}`,
          ...vessel,
        })),
        meta: { total, limit },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
