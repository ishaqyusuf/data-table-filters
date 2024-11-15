"use server";

import { calculateSpecificPercentile } from "@/lib/request/percentile";
import { searchParamsCache } from "./search-params";
import { mock } from "./api/mock";
import { filterData, percentileData, sortData } from "./api/helpers";
import { unstable_noStore } from "next/cache";
import { action2 } from "./action2";

export async function __fetch(search: any) {
  //   const search = searchParamsCache.parse(query);
  // Simulate a database query
  // await new Promise((resolve) => setTimeout(resolve, 500));
  // unstable_noStore();
  return await action2(search);
}
