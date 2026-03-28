"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJupiterPrices } from "@/lib/jupiter";
import { fetchPythPrices } from "@/lib/pyth";
import { fetchCoinGeckoPrices } from "@/lib/coingecko";
import { ASSET_LIST, ASSET_MINTS } from "@/lib/assets";
import { PRICE_POLL_INTERVAL } from "@/lib/constants";
import type { StablecoinPrice } from "@/types";

export function useStablecoinPrices() {
  return useQuery<StablecoinPrice[]>({
    queryKey: ["stablecoin-prices"],
    queryFn: async () => {
      // Fetch from Pyth (primary source - higher quality oracle prices)
      let pythPrices: Awaited<ReturnType<typeof fetchPythPrices>> = [];
      try {
        pythPrices = await fetchPythPrices();
        console.log(`[Prices] ✅ Pyth: Fetched ${pythPrices.length} prices`);
      } catch (err) {
        console.warn("[Prices] ⚠️ Pyth fetch failed:", err);
      }

      // Build pythFeedId → price map
      const pythMap = new Map(pythPrices.map((p) => [p.feedId, p]));

      // Try Jupiter as secondary source
      let jupiterPrices: Record<string, number> = {};
      try {
        jupiterPrices = await fetchJupiterPrices(ASSET_MINTS);
        const count = Object.keys(jupiterPrices).length;
        console.log(`[Prices] ✅ Jupiter: Fetched ${count} prices`);
      } catch (err) {
        console.warn("[Prices] ⚠️ Jupiter fetch failed:", err);
      }

      // Try CoinGecko as fallback (no API key required)
      let coingeckoPrices: Record<string, number> = {};
      try {
        coingeckoPrices = await fetchCoinGeckoPrices();
        const count = Object.keys(coingeckoPrices).length;
        console.log(`[Prices] ✅ CoinGecko: Fetched ${count} prices`);
      } catch (err) {
        console.warn("[Prices] ⚠️ CoinGecko fetch failed:", err);
      }

      return ASSET_LIST.map((asset) => {
        // Prefer Pyth for assets that have a feed ID
        const pythData = asset.pythFeedId
          ? pythMap.get(asset.pythFeedId)
          : undefined;

        // Fallback chain: Pyth → Jupiter → CoinGecko → 1.0 (default for stablecoins/RWAs)
        const price = pythData?.price ?? jupiterPrices[asset.mint] ?? coingeckoPrices[asset.mint] ?? (asset.category === "stablecoin" || asset.category === "rwa" ? 1.0 : 0);

        // Peg tracking only for stablecoins
        const isStablecoin = asset.category === "stablecoin";
        const pegTarget = isStablecoin && asset.type !== "yield-bearing" ? 1.0 : price;
        const pegDeviation = isStablecoin && asset.type !== "yield-bearing" ? price - 1.0 : 0;

        return {
          mint: asset.mint,
          symbol: asset.symbol,
          price,
          pegDeviation,
          pegDeviationPercent: isStablecoin && asset.type !== "yield-bearing" ? (price - 1.0) * 100 : 0,
          confidence: pythData?.confidence,
          source: pythData ? ("pyth" as const) : jupiterPrices[asset.mint] ? ("jupiter" as const) : coingeckoPrices[asset.mint] ? ("coingecko" as const) : ("fallback" as const),
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
