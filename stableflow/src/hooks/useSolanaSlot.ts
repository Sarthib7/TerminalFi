"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentSlot } from "@/lib/helius";
import { SLOT_POLL_INTERVAL } from "@/lib/constants";

export function useSolanaSlot() {
  return useQuery<number>({
    queryKey: ["solana-slot"],
    queryFn: fetchCurrentSlot,
    refetchInterval: SLOT_POLL_INTERVAL,
  });
}
