"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchStablecoinBalances } from "@/lib/helius";
import { usePriceMap } from "./useStablecoinPrices";
import { BALANCE_POLL_INTERVAL } from "@/lib/constants";
import type { TokenBalance } from "@/types";

export function useTokenBalances() {
  const { publicKey } = useWallet();
  const prices = usePriceMap();

  return useQuery<TokenBalance[]>({
    queryKey: ["token-balances", publicKey?.toBase58(), prices],
    queryFn: async () => {
      if (!publicKey) return [];
      return fetchStablecoinBalances(publicKey.toBase58(), prices);
    },
    enabled: !!publicKey && Object.keys(prices).length > 0,
    refetchInterval: BALANCE_POLL_INTERVAL,
  });
}
