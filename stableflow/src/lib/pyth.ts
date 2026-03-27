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
