import { HELIUS_API_KEY, HELIUS_API_URL, HELIUS_RPC_URL } from "./constants";
import { ASSET_LIST } from "./assets";
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
    const asset = ASSET_LIST.find((a) => a.mint === token.mint);
    if (!asset) continue; // skip unknown assets

    const humanAmount = token.amount / 10 ** token.decimals;
    if (humanAmount < 0.01) continue; // skip dust

    const price = prices[token.mint] || (asset.category === "stablecoin" ? 1.0 : 0);
    balances.push({
      mint: token.mint,
      symbol: asset.symbol,
      name: asset.name,
      amount: humanAmount,
      amountRaw: token.amount.toString(),
      decimals: token.decimals,
      usdValue: humanAmount * price,
      logoUrl: asset.logoUrl,
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
