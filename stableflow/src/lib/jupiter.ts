import { JUPITER_PRICE_URL, JUPITER_QUOTE_URL, JUPITER_SWAP_URL, JUPITER_API_KEY } from "./constants";
import type { JupiterQuote } from "@/types";

/**
 * Helper to build headers for Jupiter API requests
 */
function getJupiterHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (JUPITER_API_KEY) {
    headers["x-api-key"] = JUPITER_API_KEY;
  }
  return headers;
}

/**
 * Fetch real-time prices for multiple tokens from Jupiter.
 * Returns a map of mint address → USD price.
 */
export async function fetchJupiterPrices(
  mints: string[]
): Promise<Record<string, number>> {
  const url = `${JUPITER_PRICE_URL}?ids=${mints.join(",")}`;
  const res = await fetch(url, {
    headers: getJupiterHeaders(),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Jupiter price API error: ${res.status} - ${errorText}`);
  }
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
  const res = await fetch(`${JUPITER_QUOTE_URL}?${params}`, {
    headers: getJupiterHeaders(),
  });
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
    headers: getJupiterHeaders(),
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
