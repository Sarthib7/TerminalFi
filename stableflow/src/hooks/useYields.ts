"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStablecoinYields } from "@/lib/defillama";
import { YIELD_POLL_INTERVAL } from "@/lib/constants";
import type { LendingYield } from "@/types";

export function useYields() {
  return useQuery<LendingYield[]>({
    queryKey: ["stablecoin-yields"],
    queryFn: async () => {
      console.log("[Yields] Fetching from DefiLlama...");
      const result = await fetchStablecoinYields();
      console.log(`[Yields] ✅ Fetched ${result.length} yield opportunities`);
      return result;
    },
    refetchInterval: YIELD_POLL_INTERVAL,
    retry: 2,
  });
}
