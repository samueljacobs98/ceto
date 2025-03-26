import { Schema, model, models } from "mongoose";

export const VesselSchema = new Schema(
  {
    name: { type: String },
    internalName: { type: String },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["Active", "Inactive"] },
    particulars: {
      flag: { type: String, required: true },
    },
    imoNumber: { type: String, required: true },
    capacity: { type: Number },
  },
  { timestamps: true }
);

export const Vessel = models.Vessel || model("Vessel", VesselSchema);
