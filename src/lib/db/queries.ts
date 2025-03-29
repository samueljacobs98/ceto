import { DEFAULT_PAGE_SIZE } from "../constants";
import { VesselParams } from "../types";
import { parseSortBy } from "../utils";
import { connectDB } from "./connect-db";
import { Vessel } from "./models";

export async function queryVesselData({
  sortBy,
  pageNumber,
  pageSize,
  ...filters
}: VesselParams) {
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

  const result = await Promise.all([
    Vessel.find(query)
      .sort(sort || {})
      .skip(skip)
      .limit(limit)
      .lean(),
    Vessel.countDocuments(query),
  ]);

  return [...result, limit] as const;
}
