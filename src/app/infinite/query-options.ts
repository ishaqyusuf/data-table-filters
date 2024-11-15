import type { MakeArray } from "@/types";
import { ColumnSchema } from "./schema";
import { SearchParamsType, searchParamsSerializer } from "./search-params";
import { infiniteQueryOptions, keepPreviousData } from "@tanstack/react-query";
import { Percentile } from "@/lib/request/percentile";

export type InfiniteQueryMeta = {
  totalRowCount: number;
  filterRowCount: number;
  totalFilters: MakeArray<ColumnSchema>;
  currentPercentiles: Record<Percentile, number>;
};

export const dataOptions = (search: SearchParamsType, action: any) => {
  return infiniteQueryOptions({
    queryKey: ["data-table", searchParamsSerializer({ ...search, uuid: null })], // remove uuid as it would otherwise retrigger a fetch
    queryFn: async ({ pageParam = 0 }) => {
      console.log("QUERYING>>>>>");
      const start = (pageParam as number) * search.size;
      const serialize = searchParamsSerializer({ ...search, start });
      const response = await action({ ...search, start });
      return response;
      // const response = await fetch(`/infinite/api${serialize}`);
      // console.log(response);
      // return response.json() as Promise<{
      //   data: ColumnSchema[];
      //   meta: InfiniteQueryMeta;
      // }>;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
