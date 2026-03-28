import { ASSET_LIST } from "./assets";

interface CoinGeckoPrice {
  usd: number;
  usd_market_cap?: number;
  usd_24h_vol?: number;
  usd_24h_change?: number;
}

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  circulating_supply: number;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

/**
 * Fetch prices from CoinGecko Simple Price API
 * No API key required for basic usage (50 calls/min)
 */
export async function fetchCoinGeckoPrices(): Promise<Record<string, number>> {
  // Get all assets with CoinGecko IDs
  const assetsWithCG = ASSET_LIST.filter((a) => a.coingeckoId);
  if (assetsWithCG.length === 0) return {};

  const ids = assetsWithCG.map((a) => a.coingeckoId).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`CoinGecko API error: ${res.status}`);
    }
    const data = await res.json() as Record<string, CoinGeckoPrice>;

    // Map CoinGecko ID back to mint address
    const prices: Record<string, number> = {};
    for (const asset of assetsWithCG) {
      const cgData = data[asset.coingeckoId!];
      if (cgData?.usd) {
        prices[asset.mint] = cgData.usd;
      }
    }

    return prices;
  } catch (error) {
    console.warn("[CoinGecko] Fetch failed:", error);
    return {};
  }
}

/**
 * Fetch detailed market data from CoinGecko
 * Includes 24h volume, market cap, price changes, sparklines
 */
export async function fetchCoinGeckoMarketData(): Promise<Record<string, CoinGeckoMarketData>> {
  const assetsWithCG = ASSET_LIST.filter((a) => a.coingeckoId);
  if (assetsWithCG.length === 0) return {};

  const ids = assetsWithCG.map((a) => a.coingeckoId).join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=7d`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`CoinGecko markets API error: ${res.status}`);
    }
    const data = await res.json() as CoinGeckoMarketData[];

    // Map by CoinGecko ID
    const marketData: Record<string, CoinGeckoMarketData> = {};
    for (const item of data) {
      marketData[item.id] = item;
    }

    return marketData;
  } catch (error) {
    console.warn("[CoinGecko] Market data fetch failed:", error);
    return {};
  }
}

/**
 * Fetch trending coins (for news/trending section)
 */
export async function fetchTrendingCoins() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
    if (!res.ok) throw new Error(`CoinGecko trending error: ${res.status}`);
    const data = await res.json();
    return data.coins || [];
  } catch (error) {
    console.warn("[CoinGecko] Trending fetch failed:", error);
    return [];
  }
}

/**
 * Fetch global market data (total market cap, volume, dominance)
 */
export async function fetchGlobalMarketData() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/global");
    if (!res.ok) throw new Error(`CoinGecko global error: ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn("[CoinGecko] Global data fetch failed:", error);
    return null;
  }
}
