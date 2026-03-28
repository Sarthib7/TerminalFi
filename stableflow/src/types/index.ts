// Token balance from wallet
export interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  amount: number; // human-readable (already divided by decimals)
  amountRaw: string; // raw lamports as string
  decimals: number;
  usdValue: number;
  logoUrl: string;
}

// Stablecoin price data
export interface StablecoinPrice {
  mint: string;
  symbol: string;
  price: number; // e.g. 0.9998
  pegDeviation: number; // e.g. -0.0002 (price - 1.0, or price - peg target)
  pegDeviationPercent: number; // e.g. -0.02
  confidence?: number; // Pyth confidence interval
  source: "jupiter" | "pyth" | "coingecko" | "fallback";
  updatedAt: number; // unix timestamp
}

// Liquidity depth tier
export interface LiquidityTier {
  inputAmount: number; // USD value, e.g. 1000
  outputAmount: number | null;
  priceImpactPercent: number | null;
  effectiveRate: number | null; // output/input
  route: string | null;
  error?: string;
}

// Lending yield
export interface LendingYield {
  protocol: string; // e.g. "Kamino"
  symbol: string; // e.g. "USDC"
  apy: number; // percentage, e.g. 5.23
  apyBase: number; // base APY without rewards
  apyReward: number; // reward token APY
  tvl: number; // USD TVL
  pool: string; // DefiLlama pool ID
}

// Jupiter quote response (simplified)
export interface JupiterQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  slippageBps: number;
}

// Swap execution state
export interface SwapState {
  status: "idle" | "quoting" | "signing" | "confirming" | "success" | "error";
  quote: JupiterQuote | null;
  txSignature: string | null;
  error: string | null;
}

// Panel types for the mosaic layout
export type PanelId = "portfolio" | "peg-monitor" | "liquidity" | "yield" | "swap";

export interface PanelConfig {
  id: PanelId;
  title: string;
  icon: string; // lucide icon name
}
