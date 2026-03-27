"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStablecoinYields } from "@/lib/defillama";
import { YIELD_POLL_INTERVAL } from "@/lib/constants";
import type { LendingYield } from "@/types";

export function useYields() {
  return useQuery<LendingYield[]>({
    queryKey: ["stablecoin-yields"],
    queryFn: fetchStablecoinYields,
    refetchInterval: YIELD_POLL_INTERVAL,
  });
}
