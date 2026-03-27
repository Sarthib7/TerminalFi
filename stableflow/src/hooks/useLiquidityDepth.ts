"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLiquidityDepth } from "@/lib/jupiter";
import { STABLECOINS } from "@/lib/stablecoins";
import { DEPTH_POLL_INTERVAL } from "@/lib/constants";
import type { LiquidityTier } from "@/types";
import { useState } from "react";

export function useLiquidityDepth() {
  const [inputSymbol, setInputSymbol] = useState("USDC");
  const [outputSymbol, setOutputSymbol] = useState("USDT");

  const inputMint = STABLECOINS[inputSymbol]?.mint;
  const outputMint = STABLECOINS[outputSymbol]?.mint;
  const inputDecimals = STABLECOINS[inputSymbol]?.decimals ?? 6;

  const query = useQuery<LiquidityTier[]>({
    queryKey: ["liquidity-depth", inputMint, outputMint],
    queryFn: () => fetchLiquidityDepth(inputMint!, outputMint!, inputDecimals),
    enabled: !!inputMint && !!outputMint && inputMint !== outputMint,
    refetchInterval: DEPTH_POLL_INTERVAL,
  });

  return {
    ...query,
    inputSymbol,
    outputSymbol,
    setInputSymbol,
    setOutputSymbol,
  };
}
