import { DataTable } from "@/components/features/data-table";
import { getQueryClient } from "@/lib/api/query-client";
import { getVesselData } from "@/lib/api/requests";
import { VesselParams } from "@/lib/types";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<VesselParams>;
}) {
  const queryClient = getQueryClient();

  const vesselParams = await searchParams;

  await queryClient.prefetchQuery({
    queryKey: ["vessels"],
    queryFn: () => getVesselData(vesselParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DataTable />
    </HydrationBoundary>
  );
}
