"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLiquidityDepth } from "@/lib/jupiter";
import { ASSETS } from "@/lib/assets";
import { DEPTH_POLL_INTERVAL } from "@/lib/constants";
import type { LiquidityTier } from "@/types";
import { useState } from "react";

export function useLiquidityDepth() {
  const [inputSymbol, setInputSymbol] = useState("USDC");
  const [outputSymbol, setOutputSymbol] = useState("USDT");

  const inputMint = ASSETS[inputSymbol]?.mint;
  const outputMint = ASSETS[outputSymbol]?.mint;
  const inputDecimals = ASSETS[inputSymbol]?.decimals ?? 6;

  const query = useQuery<LiquidityTier[]>({
    queryKey: ["liquidity-depth", inputMint, outputMint],
    queryFn: async () => {
      console.log(`[Liquidity] Fetching depth for ${inputSymbol} → ${outputSymbol}`);
      const result = await fetchLiquidityDepth(inputMint!, outputMint!, inputDecimals);
      console.log(`[Liquidity] ✅ Fetched ${result.length} tiers`);
      return result;
    },
    enabled: !!inputMint && !!outputMint && inputMint !== outputMint,
    refetchInterval: DEPTH_POLL_INTERVAL,
    retry: 1,
  });

  return {
    ...query,
    inputSymbol,
    outputSymbol,
    setInputSymbol,
    setOutputSymbol,
  };
}
