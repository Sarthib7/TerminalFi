import { DEFILLAMA_YIELDS_URL } from "./constants";
import type { LendingYield } from "@/types";

// Known protocol name mappings from DefiLlama
const PROTOCOL_DISPLAY_NAMES: Record<string, string> = {
  "kamino-lend": "Kamino",
  "marginfi": "MarginFi",
  "drift": "Drift",
  "save": "Save (Solend)",
  "solend": "Save (Solend)",
  "mango-v4": "Mango",
};

/**
 * Fetch stablecoin lending yields on Solana from DefiLlama.
 * Returns filtered, sorted array of lending opportunities.
 */
export async function fetchStablecoinYields(): Promise<LendingYield[]> {
  const res = await fetch(DEFILLAMA_YIELDS_URL);
  if (!res.ok) throw new Error(`DefiLlama yields error: ${res.status}`);
  const data = await res.json();

  const stableSymbols = ["USDC", "USDT", "PYUSD"];

  const pools = (data.data || [])
    .filter(
      (pool: any) =>
        pool.chain === "Solana" &&
        stableSymbols.includes(pool.symbol) &&
        (pool.category === "Lending" || pool.category === "Yield") &&
        pool.tvlUsd > 500_000 && // min $500K TVL for relevance
        pool.apy > 0
    )
    .map((pool: any) => ({
      protocol: PROTOCOL_DISPLAY_NAMES[pool.project] || pool.project,
      symbol: pool.symbol,
      apy: pool.apy || 0,
      apyBase: pool.apyBase || 0,
      apyReward: pool.apyReward || 0,
      tvl: pool.tvlUsd || 0,
      pool: pool.pool,
    }))
    .sort((a: LendingYield, b: LendingYield) => b.apy - a.apy);

  return pools;
}
