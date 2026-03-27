# StableFlow Terminal — Product Requirements Document

> **Read CLAUDE.md first for project context and coding standards.**

---

## Table of Contents

1. [Setup](#1-setup)
2. [Stablecoin Registry](#2-stablecoin-registry)
3. [TypeScript Types](#3-typescript-types)
4. [Library Functions (API Wrappers)](#4-library-functions)
5. [Providers](#5-providers)
6. [Hooks](#6-hooks)
7. [Theme & Globals](#7-theme--globals)
8. [Layout Components](#8-layout-components)
9. [Panel Components](#9-panel-components)
10. [App Entry Points](#10-app-entry-points)
11. [Acceptance Criteria](#11-acceptance-criteria)

---

## 1. Setup

Run `setup.sh` first. It creates the Next.js project and installs all dependencies. After running it:

1. Copy `CLAUDE.md` to the stableflow project root
2. Copy this file to `docs/PRD.md`
3. Add a real Helius API key to `.env.local` (get free at https://dev.helius.xyz/dashboard/app)

**Important**: After setup, you need to import the react-mosaic CSS. Add this to `src/app/globals.css`:
```css
@import 'react-mosaic-component/react-mosaic-component.css';
```

Also add Google Fonts to `src/app/layout.tsx` metadata or via `<link>` in the `<head>`:
- JetBrains Mono (monospace, for numbers)
- Space Grotesk (sans-serif, for labels/headings)

Use `next/font/google` for this:
```typescript
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
```

Apply to `<body className={`${jetbrains.variable} ${spaceGrotesk.variable}`}>`.

---

## 2. Stablecoin Registry

**File: `src/lib/stablecoins.ts`**

This is the single source of truth for all stablecoin metadata. Every other file imports from here.

```typescript
export interface StablecoinInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  issuer: string;
  type: "fiat-backed" | "yield-bearing" | "cdp" | "synthetic" | "euro-backed";
  pythFeedId: string | null;
  logoUrl: string;
  coingeckoId: string | null;
}

export const STABLECOINS: Record<string, StablecoinInfo> = {
  USDC: {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    issuer: "Circle",
    type: "fiat-backed",
    pythFeedId: "eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    coingeckoId: "usd-coin",
  },
  USDT: {
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    issuer: "Tether",
    type: "fiat-backed",
    pythFeedId: "2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    coingeckoId: "tether",
  },
  PYUSD: {
    mint: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    name: "PayPal USD",
    symbol: "PYUSD",
    decimals: 6,
    issuer: "Paxos (PayPal)",
    type: "fiat-backed",
    pythFeedId: null,
    logoUrl: "https://raw.githubusercontent.com/nicephysics/PayPal-icon/main/pyusd.png",
    coingeckoId: "paypal-usd",
  },
  USDY: {
    mint: "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6",
    name: "Ondo US Dollar Yield",
    symbol: "USDY",
    decimals: 6,
    issuer: "Ondo Finance",
    type: "yield-bearing",
    pythFeedId: null,
    logoUrl: "https://assets.ondo.finance/tokens/usdy.svg",
    coingeckoId: "ondo-us-dollar-yield",
  },
  USDH: {
    mint: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
    name: "Hubble USD",
    symbol: "USDH",
    decimals: 6,
    issuer: "Hubble Protocol",
    type: "cdp",
    pythFeedId: null,
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX/usdh.svg",
    coingeckoId: "usdh",
  },
  EURC: {
    mint: "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr",
    name: "Euro Coin",
    symbol: "EURC",
    decimals: 6,
    issuer: "Circle",
    type: "euro-backed",
    pythFeedId: null,
    logoUrl: "https://www.circle.com/hubfs/Brand/EURC/EURC-icon.svg",
    coingeckoId: "euro-coin",
  },
  FDUSD: {
    mint: "G3h8NqauGrzRFfJPbMfUEpJZNARGhFBYRMgrgCFJPuCf",
    name: "First Digital USD",
    symbol: "FDUSD",
    decimals: 6,
    issuer: "First Digital Labs",
    type: "fiat-backed",
    pythFeedId: null,
    logoUrl: "https://assets.coingecko.com/coins/images/31079/standard/firstdigitalusd.jpg",
    coingeckoId: "first-digital-usd",
  },
};

// Derived lists for convenience
export const STABLECOIN_LIST = Object.values(STABLECOINS);
export const STABLECOIN_MINTS = STABLECOIN_LIST.map((s) => s.mint);

export function getStablecoinByMint(mint: string): StablecoinInfo | undefined {
  return STABLECOIN_LIST.find((s) => s.mint === mint);
}

export function getStablecoinBySymbol(symbol: string): StablecoinInfo | undefined {
  return STABLECOINS[symbol.toUpperCase()];
}
```

---

## 3. TypeScript Types

**File: `src/types/index.ts`**

```typescript
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
  source: "jupiter" | "pyth";
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
```

---

## 4. Library Functions

### 4.1 Constants

**File: `src/lib/constants.ts`**

```typescript
export const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || "";
export const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
export const HELIUS_API_URL = `https://api.helius.xyz`;
export const JUPITER_PRICE_URL = "https://api.jup.ag/price/v2";
export const JUPITER_QUOTE_URL = "https://api.jup.ag/swap/v1/quote";
export const JUPITER_SWAP_URL = "https://api.jup.ag/swap/v1/swap";
export const PYTH_HERMES_URL = "https://hermes.pyth.network";
export const DEFILLAMA_YIELDS_URL = "https://yields.llama.fi/pools";
export const SOLANA_NETWORK = "mainnet-beta";

// Polling intervals (milliseconds)
export const PRICE_POLL_INTERVAL = 10_000; // 10 seconds
export const BALANCE_POLL_INTERVAL = 30_000; // 30 seconds
export const DEPTH_POLL_INTERVAL = 60_000; // 60 seconds
export const YIELD_POLL_INTERVAL = 300_000; // 5 minutes
export const SLOT_POLL_INTERVAL = 2_000; // 2 seconds
```

### 4.2 Formatters

**File: `src/lib/format.ts`**

```typescript
export function formatUSD(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return formatUSD(value);
}

export function formatAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatPegDeviation(price: number): {
  text: string;
  color: "safe" | "warning" | "danger";
} {
  const deviation = (price - 1.0) * 100;
  const absDeviation = Math.abs(deviation);
  let color: "safe" | "warning" | "danger" = "safe";
  if (absDeviation > 0.5) color = "danger";
  else if (absDeviation > 0.1) color = "warning";
  return {
    text: formatPercent(deviation, 3),
    color,
  };
}

export function formatTokenAmount(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}
```

### 4.3 Jupiter API

**File: `src/lib/jupiter.ts`**

```typescript
import { JUPITER_PRICE_URL, JUPITER_QUOTE_URL, JUPITER_SWAP_URL } from "./constants";
import type { JupiterQuote } from "@/types";

/**
 * Fetch real-time prices for multiple tokens from Jupiter.
 * Returns a map of mint address → USD price.
 */
export async function fetchJupiterPrices(
  mints: string[]
): Promise<Record<string, number>> {
  const url = `${JUPITER_PRICE_URL}?ids=${mints.join(",")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Jupiter price API error: ${res.status}`);
  const data = await res.json();

  const prices: Record<string, number> = {};
  for (const [mint, info] of Object.entries(data.data || {})) {
    const priceInfo = info as { price: string };
    prices[mint] = parseFloat(priceInfo.price);
  }
  return prices;
}

/**
 * Get a swap quote from Jupiter.
 * amount is in LAMPORTS (smallest unit). For USDC with 6 decimals, $1000 = 1000000000.
 */
export async function fetchJupiterQuote(
  inputMint: string,
  outputMint: string,
  amountLamports: string,
  slippageBps: number = 50
): Promise<JupiterQuote> {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amountLamports,
    slippageBps: slippageBps.toString(),
    restrictIntermediateTokens: "true",
  });
  const res = await fetch(`${JUPITER_QUOTE_URL}?${params}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jupiter quote error: ${res.status} — ${text}`);
  }
  return res.json();
}

/**
 * Get the swap transaction bytes from Jupiter.
 * Returns base64-encoded transaction ready for wallet signing.
 */
export async function fetchJupiterSwapTransaction(
  quoteResponse: JupiterQuote,
  userPublicKey: string
): Promise<string> {
  const res = await fetch(JUPITER_SWAP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      dynamicSlippage: true,
      prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          maxLamports: 1_000_000,
          priorityLevel: "medium",
        },
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jupiter swap error: ${res.status} — ${text}`);
  }
  const data = await res.json();
  return data.swapTransaction; // base64
}

/**
 * Fetch liquidity depth for a stablecoin pair at multiple USD tiers.
 * Returns slippage/impact data at $1K, $10K, $100K, $1M.
 */
export async function fetchLiquidityDepth(
  inputMint: string,
  outputMint: string,
  inputDecimals: number = 6
) {
  const tiers = [1_000, 10_000, 100_000, 1_000_000];

  const results = await Promise.allSettled(
    tiers.map(async (usdAmount) => {
      const lamports = (usdAmount * 10 ** inputDecimals).toString();
      const quote = await fetchJupiterQuote(inputMint, outputMint, lamports);
      const outAmount = parseInt(quote.outAmount) / 10 ** inputDecimals;
      return {
        inputAmount: usdAmount,
        outputAmount: outAmount,
        priceImpactPercent: parseFloat(quote.priceImpactPct) * 100,
        effectiveRate: outAmount / usdAmount,
        route: quote.routePlan?.[0]?.swapInfo?.label || "Unknown",
      };
    })
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return {
      inputAmount: tiers[i],
      outputAmount: null,
      priceImpactPercent: null,
      effectiveRate: null,
      route: null,
      error: result.reason?.message || "Failed",
    };
  });
}
```

### 4.4 Helius API

**File: `src/lib/helius.ts`**

```typescript
import { HELIUS_API_KEY, HELIUS_API_URL, HELIUS_RPC_URL } from "./constants";
import { STABLECOIN_LIST } from "./stablecoins";
import type { TokenBalance } from "@/types";

/**
 * Fetch all token balances for a wallet, filtered to known stablecoins.
 * Returns human-readable amounts with USD values.
 */
export async function fetchStablecoinBalances(
  walletAddress: string,
  prices: Record<string, number>
): Promise<TokenBalance[]> {
  const res = await fetch(
    `${HELIUS_API_URL}/v0/addresses/${walletAddress}/balances?api-key=${HELIUS_API_KEY}`
  );
  if (!res.ok) throw new Error(`Helius balances error: ${res.status}`);
  const data = await res.json();

  // data.tokens is an array of { mint, amount, decimals }
  const tokens: Array<{ mint: string; amount: number; decimals: number }> =
    data.tokens || [];

  const balances: TokenBalance[] = [];

  for (const token of tokens) {
    const stablecoin = STABLECOIN_LIST.find((s) => s.mint === token.mint);
    if (!stablecoin) continue; // skip non-stablecoins

    const humanAmount = token.amount / 10 ** token.decimals;
    if (humanAmount < 0.01) continue; // skip dust

    const price = prices[token.mint] || 1.0;
    balances.push({
      mint: token.mint,
      symbol: stablecoin.symbol,
      name: stablecoin.name,
      amount: humanAmount,
      amountRaw: token.amount.toString(),
      decimals: token.decimals,
      usdValue: humanAmount * price,
      logoUrl: stablecoin.logoUrl,
    });
  }

  // Sort by USD value descending
  balances.sort((a, b) => b.usdValue - a.usdValue);
  return balances;
}

/**
 * Fetch the current Solana slot number.
 */
export async function fetchCurrentSlot(): Promise<number> {
  const res = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getSlot",
      params: [{ commitment: "confirmed" }],
    }),
  });
  const data = await res.json();
  return data.result;
}

/**
 * Fetch SOL balance for a wallet (for display in status bar).
 */
export async function fetchSolBalance(walletAddress: string): Promise<number> {
  const res = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [walletAddress],
    }),
  });
  const data = await res.json();
  return (data.result?.value || 0) / 1e9; // lamports to SOL
}
```

### 4.5 Pyth Oracle

**File: `src/lib/pyth.ts`**

```typescript
import { PYTH_HERMES_URL } from "./constants";
import { STABLECOIN_LIST } from "./stablecoins";

interface PythPriceResult {
  feedId: string;
  price: number;
  confidence: number;
  timestamp: number;
}

/**
 * Fetch latest oracle prices from Pyth Hermes for stablecoins that have feed IDs.
 */
export async function fetchPythPrices(): Promise<PythPriceResult[]> {
  const feedIds = STABLECOIN_LIST
    .filter((s) => s.pythFeedId !== null)
    .map((s) => s.pythFeedId!);

  if (feedIds.length === 0) return [];

  const params = feedIds.map((id) => `ids[]=${id}`).join("&");
  const res = await fetch(`${PYTH_HERMES_URL}/v2/updates/price/latest?${params}`);
  if (!res.ok) throw new Error(`Pyth Hermes error: ${res.status}`);
  const data = await res.json();

  return (data.parsed || []).map((p: any) => ({
    feedId: p.id,
    price: parseInt(p.price.price) * 10 ** p.price.expo,
    confidence: parseInt(p.price.conf) * 10 ** p.price.expo,
    timestamp: p.price.publish_time,
  }));
}
```

### 4.6 DefiLlama Yields

**File: `src/lib/defillama.ts`**

```typescript
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
```

---

## 5. Providers

### 5.1 Wallet Provider

**File: `src/providers/WalletProvider.tsx`**

```typescript
"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { HELIUS_RPC_URL } from "@/lib/constants";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={HELIUS_RPC_URL}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
```

### 5.2 Query Provider

**File: `src/providers/QueryProvider.tsx`**

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5_000, // 5 seconds before considered stale
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

### 5.3 Combined Providers

**File: `src/providers/Providers.tsx`**

```typescript
"use client";

import { WalletProvider } from "./WalletProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WalletProvider>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--bg-panel)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
            },
          }}
        />
      </WalletProvider>
    </QueryProvider>
  );
}
```

---

## 6. Hooks

### 6.1 useStablecoinPrices

**File: `src/hooks/useStablecoinPrices.ts`**

```typescript
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
```

### 6.2 useTokenBalances

**File: `src/hooks/useTokenBalances.ts`**

```typescript
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
```

### 6.3 useLiquidityDepth

**File: `src/hooks/useLiquidityDepth.ts`**

```typescript
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
```

### 6.4 useYields

**File: `src/hooks/useYields.ts`**

```typescript
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
```

### 6.5 useJupiterSwap

**File: `src/hooks/useJupiterSwap.ts`**

```typescript
"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import {
  fetchJupiterQuote,
  fetchJupiterSwapTransaction,
} from "@/lib/jupiter";
import { STABLECOINS } from "@/lib/stablecoins";
import type { JupiterQuote, SwapState } from "@/types";
import { toast } from "sonner";

export function useJupiterSwap() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [state, setState] = useState<SwapState>({
    status: "idle",
    quote: null,
    txSignature: null,
    error: null,
  });

  const getQuote = useCallback(
    async (
      inputSymbol: string,
      outputSymbol: string,
      amountHuman: number
    ): Promise<JupiterQuote | null> => {
      const input = STABLECOINS[inputSymbol];
      const output = STABLECOINS[outputSymbol];
      if (!input || !output) return null;

      setState((s) => ({ ...s, status: "quoting", error: null }));
      try {
        const amountLamports = Math.floor(
          amountHuman * 10 ** input.decimals
        ).toString();
        const quote = await fetchJupiterQuote(input.mint, output.mint, amountLamports);
        setState((s) => ({ ...s, status: "idle", quote }));
        return quote;
      } catch (err: any) {
        setState((s) => ({
          ...s,
          status: "error",
          error: err.message || "Quote failed",
        }));
        return null;
      }
    },
    []
  );

  const executeSwap = useCallback(
    async (quote: JupiterQuote) => {
      if (!publicKey || !signTransaction) {
        toast.error("Wallet not connected");
        return null;
      }

      setState((s) => ({ ...s, status: "signing", error: null }));
      try {
        // Get swap transaction
        const swapTxBase64 = await fetchJupiterSwapTransaction(
          quote,
          publicKey.toBase58()
        );

        // Deserialize and sign
        const txBuf = Buffer.from(swapTxBase64, "base64");
        const tx = VersionedTransaction.deserialize(txBuf);

        setState((s) => ({ ...s, status: "signing" }));
        const signedTx = await signTransaction(tx);

        setState((s) => ({ ...s, status: "confirming" }));
        const txid = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: true,
          maxRetries: 2,
        });

        // Confirm
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          signature: txid,
        });

        setState({
          status: "success",
          quote,
          txSignature: txid,
          error: null,
        });

        toast.success("Swap successful!", {
          description: `TX: ${txid.slice(0, 8)}...`,
          action: {
            label: "View",
            onClick: () =>
              window.open(`https://solscan.io/tx/${txid}`, "_blank"),
          },
        });

        return txid;
      } catch (err: any) {
        const msg = err.message || "Swap failed";
        setState((s) => ({ ...s, status: "error", error: msg }));
        toast.error("Swap failed", { description: msg });
        return null;
      }
    },
    [publicKey, signTransaction, connection]
  );

  const reset = useCallback(() => {
    setState({ status: "idle", quote: null, txSignature: null, error: null });
  }, []);

  return { state, getQuote, executeSwap, reset };
}
```

### 6.6 useSolanaSlot

**File: `src/hooks/useSolanaSlot.ts`**

```typescript
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
```

---

## 7. Theme & Globals

**File: `src/app/globals.css`**

This replaces the default globals.css entirely. It must include the react-mosaic import and terminal dark theme.

```css
@import "tailwindcss";
@import "react-mosaic-component/react-mosaic-component.css";

/* ===== Terminal Dark Theme ===== */
:root {
  --bg-primary: #08080c;
  --bg-secondary: #0e0e14;
  --bg-panel: #13131b;
  --bg-panel-header: #1a1a25;
  --bg-input: #1a1a25;
  --bg-hover: #22222e;

  --border-color: #2a2a3a;
  --border-active: #3a3a5a;

  --text-primary: #e4e4ef;
  --text-secondary: #8888a0;
  --text-muted: #55556a;

  --accent-green: #00ff88;
  --accent-red: #ff4466;
  --accent-amber: #ffaa00;
  --accent-cyan: #00ccff;
  --accent-blue: #4488ff;

  --peg-safe: #00ff88;
  --peg-warning: #ffaa00;
  --peg-danger: #ff4466;

  --font-mono: var(--font-jetbrains-mono, "JetBrains Mono"), "Fira Code", monospace;
  --font-sans: var(--font-space-grotesk, "Space Grotesk"), system-ui, sans-serif;
}

/* ===== Base ===== */
body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow: hidden; /* Terminal fills viewport */
}

/* ===== Override react-mosaic default styles ===== */
.mosaic-root {
  background: var(--bg-primary) !important;
}

.mosaic-window {
  border-radius: 0 !important;
}

.mosaic-window .mosaic-window-toolbar {
  display: none !important; /* We use our own panel headers */
}

.mosaic-window .mosaic-window-body {
  background: var(--bg-panel) !important;
  border: 1px solid var(--border-color) !important;
}

.mosaic-split {
  background: var(--bg-primary) !important;
}

.mosaic-split:hover {
  background: var(--accent-cyan) !important;
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--border-active);
}

/* ===== Number flash animation ===== */
@keyframes flash-green {
  0% { color: var(--accent-green); }
  100% { color: var(--text-primary); }
}

@keyframes flash-red {
  0% { color: var(--accent-red); }
  100% { color: var(--text-primary); }
}

.flash-up {
  animation: flash-green 1s ease-out;
}

.flash-down {
  animation: flash-red 1s ease-out;
}

/* ===== Wallet adapter style overrides ===== */
.wallet-adapter-button {
  background: var(--bg-input) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-primary) !important;
  font-family: var(--font-mono) !important;
  font-size: 12px !important;
  height: 32px !important;
  padding: 0 12px !important;
  border-radius: 4px !important;
}

.wallet-adapter-button:hover {
  background: var(--bg-hover) !important;
  border-color: var(--border-active) !important;
}

.wallet-adapter-modal-wrapper {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
}
```

---

## 8. Layout Components

### 8.1 PanelHeader

**File: `src/components/layout/PanelHeader.tsx`**

A reusable compact header bar for each panel. Every panel component should use this at the top.

```typescript
"use client";

import { LucideIcon } from "lucide-react";

interface PanelHeaderProps {
  title: string;
  icon: LucideIcon;
  children?: React.ReactNode; // optional controls on the right side
}

export function PanelHeader({ title, icon: Icon, children }: PanelHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-3 py-1.5 border-b"
      style={{
        background: "var(--bg-panel-header)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: "var(--accent-cyan)" }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          {title}
        </span>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
```

### 8.2 TerminalShell, TopBar, StatusBar, CommandPalette

These are the main layout components. I'll describe what each should do — Claude Code should implement them based on the patterns above and the libraries installed:

**TopBar.tsx**: Fixed top bar, 40px height. Contains:
- Left: "StableFlow" logo text in accent-cyan, monospace
- Center: Search trigger button ("⌘K to search...") styled as dim input placeholder — clicking opens CommandPalette
- Right: SOL price (fetched via Jupiter for SOL mint `So11111111111111111111111111111111111111112`), then the wallet connect button using `<WalletMultiButton />` from `@solana/wallet-adapter-react-ui`

**StatusBar.tsx**: Fixed bottom bar, 28px height. Shows: Network name ("Mainnet"), current slot number (from `useSolanaSlot`), a green/red connection dot, and timestamp.

**CommandPalette.tsx**: Uses `cmdk` (the `Command` component). Opens with ⌘K or Ctrl+K. Lists:
- Panel names (click to focus that panel in the mosaic)
- Stablecoin names (click to show detail or set as active in liquidity panel)
- Actions: "Swap USDC→USDT", "Refresh prices", etc.

**TerminalShell.tsx**: This is the main wrapper. Renders:
```
<div className="h-screen flex flex-col">
  <TopBar />
  <div className="flex-1">
    <Mosaic<PanelId>
      renderTile={(id) => <PanelComponent id={id} />}
      initialValue={{ ... default layout ... }}
    />
  </div>
  <StatusBar />
  <CommandPalette />
</div>
```

The default mosaic layout should be:
```typescript
const DEFAULT_LAYOUT: MosaicNode<PanelId> = {
  direction: "row",
  first: {
    direction: "column",
    first: "portfolio",
    second: "yield",
    splitPercentage: 50,
  },
  second: {
    direction: "column",
    first: "peg-monitor",
    second: {
      direction: "row",
      first: "liquidity",
      second: "swap",
      splitPercentage: 50,
    },
    splitPercentage: 50,
  },
  splitPercentage: 40,
};
```

---

## 9. Panel Components

Each panel is a `"use client"` component that:
1. Uses hooks from `src/hooks/` for data
2. Renders a `<PanelHeader>` at the top
3. Handles loading/error/empty states
4. Uses monospace font for all numbers

Claude Code should implement each panel based on the hook interfaces defined in section 6 and the types in section 3. The panels should follow the visual layout shown in the CLAUDE.md file.

Key implementation notes per panel:

**PortfolioPanel**: Shows a table with columns: Logo, Symbol, Balance, USD Value. Footer row shows total. If wallet not connected, show a centered "Connect wallet to view balances" message with the wallet connect button.

**PegMonitorPanel**: Grid or table of all stablecoins. Columns: Logo, Symbol, Price, Deviation %, Status dot. The status dot color uses `formatPegDeviation()` from format.ts. For yield-bearing stablecoins like USDY, show the price but mark deviation as "N/A — yield-bearing" since they're meant to be >$1.

**LiquidityPanel**: Two dropdown selects at top (input/output stablecoin). Below, a table showing the depth tiers: $1K, $10K, $100K, $1M rows with columns: Amount, Output, Slippage %, Route. Use color coding — green for <0.05% slippage, amber for 0.05-0.5%, red for >0.5%.

**YieldPanel**: Matrix table. Rows = protocols (Kamino, MarginFi, Drift, Save, etc.). Columns = stablecoin symbols (USDC, USDT). Cell values = APY percentage. Sort by highest USDC APY by default. Include TVL as a secondary column. Highlight the best yield per stablecoin with accent-green.

**SwapPanel**: Form with: input stablecoin selector, input amount field, output stablecoin selector, quote display area (rate, price impact, route), and an execute button. The flow:
1. User selects input/output and enters amount
2. On amount change (debounced 500ms), call `getQuote()`
3. Display quote details
4. User clicks "Execute Swap" → calls `executeSwap()`
5. Button shows loading states: "Quoting..." → "Sign in wallet..." → "Confirming..." → "Done ✓"
6. On success, toast with Solscan link

---

## 10. App Entry Points

**File: `src/app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "StableFlow Terminal",
  description: "Stablecoin operations terminal for Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrains.variable} ${spaceGrotesk.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**File: `src/app/page.tsx`**

```typescript
import { TerminalShell } from "@/components/layout/TerminalShell";

export default function Home() {
  return <TerminalShell />;
}
```

---

## 11. Acceptance Criteria

### Demo Day Checklist

When all of these pass, the hackathon demo is ready:

- [ ] App loads at localhost:3000 with dark terminal aesthetic — no white/light backgrounds anywhere
- [ ] ⌘K (or Ctrl+K) opens command palette overlay with stablecoin names and panel names
- [ ] Clicking "Connect Wallet" opens Phantom/Solflare/Backpack selection modal
- [ ] After connecting wallet, Portfolio panel shows real stablecoin balances with USD values
- [ ] Peg Monitor panel shows live prices for at least 6 stablecoins with color-coded deviation
- [ ] Liquidity panel shows slippage at 4 tiers ($1K/$10K/$100K/$1M) for USDC→USDT
- [ ] Yield panel shows APYs from at least 3 protocols for USDC
- [ ] Swap panel lets you select input/output, enter amount, see quote, and execute a real swap
- [ ] After swap execution, a toast appears with transaction link to Solscan
- [ ] Panels are resizable by dragging the dividers between them
- [ ] All number values update automatically on their polling intervals
- [ ] If wallet is disconnected, portfolio shows "Connect wallet" prompt, swap shows disabled state
- [ ] No console errors in production build (`npm run build` succeeds)
- [ ] The app looks like a professional terminal, not a generic shadcn template

### Visual Quality Bar

The UI should feel like Bloomberg / Warp / Figma dark mode — NOT like a default Next.js template with shadcn components dropped in. Specifically:
- Information density is HIGH (small fonts, compact spacing, lots of data visible)
- Typography is intentional (monospace for numbers, sans for labels)
- Color usage is restrained (mostly grays, with accent colors only for meaning)
- Every panel has the same visual language (header bar, consistent padding, same border style)

---

## Appendix A: Key External Documentation

Claude Code should consult these when implementing specific features:

| Topic | URL |
|-------|-----|
| Jupiter Swap API v1 | https://dev.jup.ag/docs/swap-api |
| Jupiter Price API v2 | https://dev.jup.ag/docs/price |
| Helius Token Balances | https://docs.helius.dev/solana-apis/balances-api |
| Helius RPC Methods | https://docs.helius.dev/solana-rpc-nodes/solana-rpc-methods |
| Pyth Hermes REST API | https://hermes.pyth.network/docs |
| DefiLlama Yields API | https://defillama.com/docs/api (GET /pools) |
| react-mosaic docs | https://github.com/nomcopter/react-mosaic |
| cmdk docs | https://github.com/pacocoursey/cmdk |
| TradingView Lightweight Charts | https://tradingview.github.io/lightweight-charts/docs |
| Solana Wallet Adapter | https://github.com/anza-xyz/wallet-adapter |
| shadcn/ui components | https://ui.shadcn.com/docs/components |
| TanStack Query | https://tanstack.com/query/latest/docs |

## Appendix B: MCP Servers for Claude Code

If Claude Code has access to MCP servers, these would accelerate development:

- **Context7** or **Web Fetch MCP** — to pull live API documentation
- **GitHub MCP** — to create and manage the repository
- **File System MCP** — already available (standard Claude Code)

Claude Code does NOT need any special skills installed. All dependencies are standard npm packages.
