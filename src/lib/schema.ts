import { z } from "zod";

import { sortByOptions } from "./constants";

export const getVesselsSchema = z.object({
  sortBy: z.enum(sortByOptions).nullish(),
  pageNumber: z.coerce.number().nullish(),
  pageSize: z.coerce.number().nullish(),
  imoNumber: z.string().nullish(),
  name: z.string().nullish(),
  internalName: z.string().nullish(),
  flag: z.string().nullish(),
  // tags: z.array(z.string()).optional(),
});
