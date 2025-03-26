import { InferSchemaType } from "mongoose";
import { VesselSchema } from "./db/models";

export type Vessel = InferSchemaType<typeof VesselSchema>;
