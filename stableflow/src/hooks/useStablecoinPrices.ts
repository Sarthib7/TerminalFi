"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJupiterPrices } from "@/lib/jupiter";
import { fetchPythPrices } from "@/lib/pyth";
import { STABLECOIN_LIST, STABLECOIN_MINTS } from "@/lib/stablecoins";
import { PRICE_POLL_INTERVAL } from "@/lib/constants";
import type { StablecoinPrice } from "@/types";

export function useStablecoinPrices() {
  return useQuery<StablecoinPrice[]>({
    queryKey: ["stablecoin-prices"],
    queryFn: async () => {
      // Fetch from Jupiter (primary source for all stablecoins)
      const jupiterPrices = await fetchJupiterPrices(STABLECOIN_MINTS);

      // Fetch from Pyth (higher quality for USDC/USDT, includes confidence)
      let pythPrices: Awaited<ReturnType<typeof fetchPythPrices>> = [];
      try {
        pythPrices = await fetchPythPrices();
      } catch {
        // Pyth is optional — Jupiter is the fallback
      }

      // Build pythFeedId → price map
      const pythMap = new Map(pythPrices.map((p) => [p.feedId, p]));

      return STABLECOIN_LIST.map((stablecoin) => {
        // Prefer Pyth for stablecoins that have a feed ID
        const pythData = stablecoin.pythFeedId
          ? pythMap.get(stablecoin.pythFeedId)
          : undefined;

        const price = pythData?.price ?? jupiterPrices[stablecoin.mint] ?? 1.0;

        // For yield-bearing stablecoins (USDY), the peg target isn't $1.00
        const pegTarget = stablecoin.type === "yield-bearing" ? price : 1.0;
        const pegDeviation =
          stablecoin.type === "yield-bearing" ? 0 : price - 1.0;

        return {
          mint: stablecoin.mint,
          symbol: stablecoin.symbol,
          price,
          pegDeviation,
          pegDeviationPercent:
            stablecoin.type === "yield-bearing"
              ? 0
              : (price - 1.0) * 100,
          confidence: pythData?.confidence,
          source: pythData ? ("pyth" as const) : ("jupiter" as const),
          updatedAt: Date.now(),
        };
      });
    },
    refetchInterval: PRICE_POLL_INTERVAL,
  });
}

/**
 * Helper hook that returns a simple mint → price map for other hooks to consume.
 */
export function usePriceMap(): Record<string, number> {
  const { data } = useStablecoinPrices();
  if (!data) return {};
  return Object.fromEntries(data.map((p) => [p.mint, p.price]));
}
