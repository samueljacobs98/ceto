"use server";

import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { connectDB, Vessel } from "@/lib/db";
import { parseSortBy } from "@/lib/utils";
import { validateGetVessels } from "@/lib/validate";

export async function GET(req: Request) {
  const validationOutcome = validateGetVessels(req);
  if (!validationOutcome.success) {
    return new Response(JSON.stringify(validationOutcome.error), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { sortBy, pageNumber, pageSize, ...filters } = validationOutcome.data;

  await connectDB();

  const limit = pageSize || DEFAULT_PAGE_SIZE;
  const skip = pageNumber ? (pageNumber - 1) * limit : 0;

  const sort = parseSortBy(sortBy);

  const query: Record<string, string | { $regex: string; $options: string }> = {
    status: "Active",
  };

  for (const key of Object.keys(filters) as (keyof typeof filters)[]) {
    const value = filters[key];
    if (value) {
      query[key] = { $regex: `^${value}`, $options: "i" };
    }
  }

  const [activeVessels, total] = await Promise.all([
    Vessel.find(query)
      .sort(sort || {})
      .skip(skip)
      .limit(limit)
      .lean(),
    Vessel.countDocuments(query),
  ]);

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
}
