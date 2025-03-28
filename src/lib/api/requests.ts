import axios from "axios";

import { Vessel, VesselParams } from "../types";

const serverClient = axios.create({
  baseURL: "http://localhost:3000",
});

export async function getVesselData({
  flag,
  ...params
}: VesselParams): Promise<{
  activeVessels: Vessel[];
  meta: { total: number; limit: number };
}> {
  const response = await serverClient.get<{
    activeVessels: Vessel[];
    meta: { total: number; limit: number };
  }>("/api/vessels", {
    params: { ...params, ["particulars.flag"]: flag || undefined },
  });

  return response.data;
}
