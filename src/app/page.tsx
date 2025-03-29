import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/api/query-client";
import { getVesselData } from "@/lib/api/requests";
import { VesselParams } from "@/lib/types";

import { CopyUrl } from "@/components/features/copy-url";
import { DataTable } from "@/components/features/data-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<VesselParams>;
}) {
  const queryClient = getQueryClient();

  const vesselParams = await searchParams;
  const vesselParamsKey = vesselParams.toString();

  await queryClient.prefetchQuery({
    queryKey: ["vessels", vesselParamsKey],
    queryFn: () => getVesselData(vesselParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="py-6 px-4">
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <h1 className="text-3xl font-bold">Vessel Data</h1>
            <CopyUrl />
          </div>
          <p className="text-base text-muted-foreground">
            Explore live vessel data
          </p>
        </div>
        <DataTable />
      </main>
    </HydrationBoundary>
  );
}
