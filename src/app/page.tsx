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
      <main className="py-6 px-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Vessel Data</h1>
          <p className="text-base text-muted-foreground">
            Explore live vessel data
          </p>
        </div>
        <DataTable />
      </main>
    </HydrationBoundary>
  );
}
