"use server";

import { calculateSpecificPercentile } from "@/lib/request/percentile";
import { searchParamsCache } from "./search-params";
import { mock } from "./api/mock";
import { filterData, percentileData, sortData } from "./api/helpers";
export const dynamic = "force-dynamic";
export async function __fetch(query: any) {
  const search = searchParamsCache.parse(query);

  // Simulate a database query
  // await new Promise((resolve) => setTimeout(resolve, 500));

  const totalData = mock;
  const filteredData = filterData(totalData, search);
  const sortedData = sortData(filteredData, search.sort);
  const withPercentileData = percentileData(sortedData);

  // FIXME: this is fugly
  const totalFilters = totalData.reduce((prev, curr) => {
    for (const key in curr) {
      const value = curr[key as keyof typeof curr];
      const prevValue = prev[key as keyof typeof prev] || [];
      if (Array.isArray(value)) {
        prev[key as keyof typeof prev] = [
          // @ts-ignore
          ...new Set([...prevValue, ...value]),
        ];
      } else {
        // @ts-ignore
        prev[key as keyof typeof prev] = [...new Set([...prevValue, value])];
      }
    }
    return prev;
  }, {} as Record<string, (number | string | boolean | Date)[]>);

  const latencies = withPercentileData.map(({ latency }) => latency);

  const currentPercentiles = {
    50: calculateSpecificPercentile(latencies, 50),
    75: calculateSpecificPercentile(latencies, 75),
    90: calculateSpecificPercentile(latencies, 90),
    95: calculateSpecificPercentile(latencies, 95),
    99: calculateSpecificPercentile(latencies, 99),
  };

  return {
    data: withPercentileData.slice(search.start, search.start + search.size),
    meta: {
      totalRowCount: totalData.length,
      filterRowCount: filteredData.length,
      totalFilters,
      currentPercentiles,
    },
  };
}
