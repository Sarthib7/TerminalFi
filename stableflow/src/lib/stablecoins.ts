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
