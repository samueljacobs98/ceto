import axios from "axios";
import { Vessel, VesselParams } from "../types";

export async function getVesselData(params: VesselParams): Promise<{
  activeVessels: Vessel[];
  meta: { total: number; limit: number };
}> {
  const response = await axios.get<{
    activeVessels: Vessel[];
    meta: { total: number; limit: number };
  }>("/api/vessels", {
    params: { ...params },
  });

  return response.data;
}
