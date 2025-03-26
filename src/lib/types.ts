import { InferSchemaType } from "mongoose";
import { VesselSchema } from "./models";

export type Vessel = InferSchemaType<typeof VesselSchema>;
