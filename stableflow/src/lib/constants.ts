export const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || "";
export const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
export const HELIUS_API_URL = `https://api.helius.xyz`;
export const JUPITER_API_KEY = process.env.NEXT_PUBLIC_JUPITER_API_KEY || "";
export const JUPITER_PRICE_URL = "https://api.jup.ag/price/v2";
export const JUPITER_QUOTE_URL = "https://quote-api.jup.ag/v6/quote";
export const JUPITER_SWAP_URL = "https://quote-api.jup.ag/v6/swap";
export const PYTH_HERMES_URL = "https://hermes.pyth.network";
export const DEFILLAMA_YIELDS_URL = "https://yields.llama.fi/pools";
export const SOLANA_NETWORK = "mainnet-beta";

// Polling intervals (milliseconds)
export const PRICE_POLL_INTERVAL = 10_000; // 10 seconds
export const BALANCE_POLL_INTERVAL = 30_000; // 30 seconds
export const DEPTH_POLL_INTERVAL = 60_000; // 60 seconds
export const YIELD_POLL_INTERVAL = 300_000; // 5 minutes
export const SLOT_POLL_INTERVAL = 2_000; // 2 seconds
