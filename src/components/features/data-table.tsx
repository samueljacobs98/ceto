"use client";

import {
  ChangeEvent,
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useDeferredValue,
  useMemo,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  FilterIcon,
  RotateCcwIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getVesselData } from "@/lib/api/requests";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { Nullish, Vessel, VesselParams } from "@/lib/types";
import { cn, parseToInteger } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DataTableContext = createContext<
  | {
      data:
        | {
            activeVessels: Vessel[];
            meta: {
              total: number;
              limit: number;
            };
          }
        | undefined;
      sortBy: Nullish<string>;
      filters: Omit<VesselParams, "sortBy">;
      pagesCount: number;
      canGetPreviousPage: boolean;
      canGetNextPage: boolean;
      handleFilter: (
        key: keyof Omit<VesselParams, "sortBy">
      ) => (e: ChangeEvent<HTMLInputElement> | string) => void;
      handleSortBy: (sortByKey: string) => () => void;
      handleReset: () => void;
      getPreviousPage: () => void;
      getNextPage: () => void;
    }
  | undefined
>(undefined);

function DataTableProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback(
    (
      name: string,
      value: string,
      searchParams: URLSearchParams = new URLSearchParams()
    ) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params;
    },
    []
  );

  const deleteSearchParam = useCallback(
    (name: string, searchParams: URLSearchParams) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name);

      return params;
    },
    []
  );

  const { sortBy, ...derivedFilters } = useMemo<VesselParams>(() => {
    const sortBy = searchParams.get("sortBy");

    const pageNumber = parseToInteger(searchParams.get("pageNumber"), 1);
    const pageSize = parseToInteger(
      searchParams.get("pageSize"),
      DEFAULT_PAGE_SIZE
    );
    const imoNumber = searchParams.get("imoNumber");
    const name = searchParams.get("name");
    const internalName = searchParams.get("internalName");
    const flag = searchParams.get("particulars.flag");
    // const tags = searchParams.getAll("tags");

    return {
      sortBy,
      pageNumber,
      pageSize,
      imoNumber,
      name,
      internalName,
      flag,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState({ ...derivedFilters });

  const requestData = useDeferredValue({ sortBy, ...derivedFilters });
  const { data } = useQuery({
    queryKey: ["vessels"],
    queryFn: () => getVesselData(requestData),
  });

  const pagesCount = useMemo(
    () =>
      data?.meta.total
        ? Math.ceil(data.meta.total / (filters?.pageSize || 1))
        : 1,
    [data?.meta.total, filters?.pageSize]
  );

  const canGetPreviousPage = useMemo(
    () => Boolean(filters?.pageNumber && filters.pageNumber > 1),
    [filters?.pageNumber]
  );

  const canGetNextPage = useMemo(() => {
    return Boolean(filters?.pageNumber && filters.pageNumber < pagesCount);
  }, [filters?.pageNumber, pagesCount]);

  const updatePage = (pageNumber: number) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
    router.push(
      pathname +
        "?" +
        updateSearchParams(
          "pageNumber",
          `${pageNumber}`,
          searchParams
        ).toString()
    );
  };

  const getPreviousPage = () => {
    const page = Math.max(1, (filters?.pageNumber || 1) - 1);
    updatePage(page);
  };

  const getNextPage = () => {
    const nextPage = (filters?.pageNumber || 1) + 1;
    const page = Math.min(pagesCount, nextPage);
    updatePage(page);
  };

  const handleFilter =
    (key: keyof typeof filters) =>
    (e: ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === "string" ? e : e.target.value;
      const resetPageSearchParams = updateSearchParams(
        "pageNumber",
        "1",
        searchParams
      );

      if (!value.trim()) {
        setFilters((prev) => ({ ...prev, [key]: undefined, page: 1 }));
        router.push(
          pathname +
            "?" +
            deleteSearchParam(key, resetPageSearchParams).toString()
        );
        return;
      }

      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
      router.push(
        pathname +
          "?" +
          updateSearchParams(key, value, resetPageSearchParams).toString()
      );
    };

  const handleSortBy = (sortByKey: string) => () => {
    const resetPageSearchParams = updateSearchParams("pageNumber", "1");
    setFilters((prev) => ({ ...prev, pageNumber: 1 }));

    if (sortBy?.startsWith(sortByKey) && sortBy.endsWith("desc")) {
      router.push(
        pathname + "?" + deleteSearchParam("sortBy", resetPageSearchParams)
      );
      return;
    }

    const direction = sortBy?.startsWith(sortByKey) ? "desc" : "asc";

    router.push(
      pathname +
        "?" +
        updateSearchParams(
          "sortBy",
          `${sortByKey}:${direction}`,
          resetPageSearchParams
        )
    );
  };

  const handleReset = () => {
    const resetPageSearchParams = updateSearchParams("pageNumber", "1");
    const searchParams = filters.pageSize
      ? updateSearchParams(
          "pageSize",
          `${filters.pageSize}`,
          resetPageSearchParams
        )
      : resetPageSearchParams;

    setFilters(({ pageSize }) => ({ pageNumber: 1, pageSize }));
    router.push(pathname + "?" + searchParams.toString());
  };

  return (
    <DataTableContext.Provider
      value={{
        data,
        sortBy,
        filters,
        pagesCount,
        canGetPreviousPage,
        canGetNextPage,
        handleFilter,
        handleSortBy,
        handleReset,
        getPreviousPage,
        getNextPage,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
}

function useDataTableContext() {
  const context = useContext(DataTableContext);

  if (context === undefined) {
    throw new Error(
      "useDataTableContext must be used within a DataTableProvider"
    );
  }

  return context;
}

export function DataTable() {
  return (
    <DataTableProvider>
      <div className="w-full">
        <DataTableToolbar />
        <div className="rounded-md border">
          <Table>
            <DataTableHeader />
            <DataTableBody />
          </Table>
        </div>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
}

function DataTableToolbar() {
  const { filters, handleFilter, handleReset } = useDataTableContext();

  return (
    <div className="flex gap-x-2 items-center justify-end py-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <FilterIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-4" sideOffset={10}>
          <ul className="space-y-4">
            <li className="space-y-2">
              <Label htmlFor="imoNumber" className="font-semibold pl-2">
                IMO Number
              </Label>
              <Input
                id="imoNumber"
                value={filters.imoNumber ?? ""}
                onChange={handleFilter("imoNumber")}
                placeholder="9803637"
              />
            </li>
            <li className="space-y-2">
              <Label htmlFor="name" className="font-semibold pl-2">
                Name
              </Label>
              <Input
                id="name"
                value={filters.name ?? ""}
                onChange={handleFilter("name")}
                placeholder="SD Tempest"
              />
            </li>
            <li className="space-y-2">
              <Label htmlFor="internalName" className="font-semibold pl-2">
                Internal Name
              </Label>
              <Input
                id="internalName"
                value={filters.internalName ?? ""}
                onChange={handleFilter("internalName")}
                placeholder="Serco1"
              />
            </li>
            <li className="space-y-2">
              <Label htmlFor="flag" className="font-semibold pl-2">
                Flag
              </Label>
              <Input
                id="flag"
                value={filters["particulars.flag"] ?? ""}
                onChange={handleFilter("particulars.flag")}
                placeholder="GB"
              />
            </li>
            {/* TODO: tags */}
          </ul>
        </PopoverContent>
      </Popover>
      <Button
        onClick={handleReset}
        variant="outline"
        size="icon"
        className="rounded-full size-8"
      >
        <RotateCcwIcon />
      </Button>
    </div>
  );
}

function DataTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <DataTableSortButton sortByKey="imoNumber">
            IMO Number
          </DataTableSortButton>
        </TableHead>
        <TableHead>
          <DataTableSortButton sortByKey="name">Name</DataTableSortButton>
        </TableHead>
        <TableHead>
          <DataTableSortButton sortByKey="internalName">
            Internal Name
          </DataTableSortButton>
        </TableHead>
        <TableHead>
          <DataTableSortButton sortByKey="particulars.flag">
            Flag
          </DataTableSortButton>
        </TableHead>
        <TableHead>Tags</TableHead>
      </TableRow>
    </TableHeader>
  );
}

function DataTableSortButton({
  sortByKey,
  className,
  children,
  ...props
}: ComponentProps<typeof Button> & { sortByKey: string }) {
  const { sortBy, handleSortBy } = useDataTableContext();

  return (
    <Button
      variant="ghost"
      onClick={handleSortBy(sortByKey)}
      className={cn("pl-2", className)}
      {...props}
    >
      {children}
      {sortBy?.startsWith(sortByKey) ? (
        sortBy.endsWith("asc") ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

function DataTableBody() {
  const { data, filters } = useDataTableContext();

  return (
    <TableBody>
      {data?.activeVessels.length ? (
        <>
          {data?.activeVessels.map(
            ({ id, imoNumber, name, internalName, particulars, tags }) => (
              <TableRow key={id}>
                <TableCell>{imoNumber}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{internalName}</TableCell>
                <TableCell>{particulars?.flag}</TableCell>
                <TableCell>{tags?.join(", ")}</TableCell>
              </TableRow>
            )
          )}
          {data?.activeVessels.length <
            (filters?.pageSize ?? DEFAULT_PAGE_SIZE) && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No more results.
              </TableCell>
            </TableRow>
          )}
        </>
      ) : (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

function DataTablePagination() {
  const {
    filters,
    pagesCount,
    getPreviousPage,
    canGetPreviousPage,
    getNextPage,
    canGetNextPage,
    handleFilter,
  } = useDataTableContext();

  return (
    <div className="grid grid-cols-3 items-center justify-between space-x-2 py-4">
      <div></div>
      <div className="flex gap-x-2 justify-self-center">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {filters?.pageNumber || 1} of {pagesCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getPreviousPage}
            disabled={!canGetPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={getNextPage}
            disabled={!canGetNextPage}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 justify-self-end">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${filters.pageSize}`}
          onValueChange={handleFilter("pageSize")}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 20, 30, 40].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
