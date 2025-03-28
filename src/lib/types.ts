import { InferSchemaType } from "mongoose";

import { VesselSchema } from "./db/models";

type Nullish<T> = T | null | undefined;

export type Vessel = InferSchemaType<typeof VesselSchema> & { id: string };

export type VesselParams = {
  sortBy?: Nullish<string>;
  page?: number;
  pageSize?: Nullish<number>;
  imoNumber?: Nullish<string>;
  name?: Nullish<string>;
  internalName?: Nullish<string>;
  flag?: Nullish<string>;
  //   tags: Nullish<string>[];
};
