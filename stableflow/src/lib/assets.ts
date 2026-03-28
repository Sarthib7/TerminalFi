export interface AssetInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  issuer: string;
  category: "stablecoin" | "rwa" | "yield-bearing" | "wrapped-asset" | "crypto";
  type: "fiat-backed" | "yield-bearing" | "cdp" | "synthetic" | "euro-backed" | "treasury" | "real-estate" | "commodity" | "wrapped" | "native";
  pythFeedId: string | null;
  logoUrl: string;
  coingeckoId: string | null;
  description?: string;
}

// Comprehensive asset list for terminal
export const ASSETS: Record<string, AssetInfo> = {
  // === STABLECOINS ===
  USDC: {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    issuer: "Circle",
    category: "stablecoin",
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
    category: "stablecoin",
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
    category: "stablecoin",
    type: "fiat-backed",
    pythFeedId: null,
    logoUrl: "https://raw.githubusercontent.com/nicephysics/PayPal-icon/main/pyusd.png",
    coingeckoId: "paypal-usd",
  },
  EURC: {
    mint: "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr",
    name: "Euro Coin",
    symbol: "EURC",
    decimals: 6,
    issuer: "Circle",
    category: "stablecoin",
    type: "euro-backed",
    pythFeedId: null,
    logoUrl: "https://www.circle.com/hubfs/Brand/EURC/EURC-icon.svg",
    coingeckoId: "euro-coin",
  },

  // === RWAs (Real World Assets) ===
  USDY: {
    mint: "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6",
    name: "Ondo US Dollar Yield",
    symbol: "USDY",
    decimals: 6,
    issuer: "Ondo Finance",
    category: "rwa",
    type: "treasury",
    pythFeedId: null,
    logoUrl: "https://assets.ondo.finance/tokens/usdy.svg",
    coingeckoId: "ondo-us-dollar-yield",
    description: "Tokenized US Treasury bonds",
  },
  OUSG: {
    mint: "4MRpHDCgZkaoZAVF7hVvbKf5V4wkbvHrxVhYmXSc8cPx",
    name: "Ondo Short-Term US Government Bonds",
    symbol: "OUSG",
    decimals: 6,
    issuer: "Ondo Finance",
    category: "rwa",
    type: "treasury",
    pythFeedId: null,
    logoUrl: "https://assets.ondo.finance/tokens/ousg.svg",
    coingeckoId: null,
    description: "Short-term US Government bonds",
  },
  BUIDL: {
    mint: "GyWgeqpy5GueU2YbkE8xqUeVEokCMMCEeUrfbtMw6phr",
    name: "BlackRock USD Institutional Digital Liquidity",
    symbol: "BUIDL",
    decimals: 6,
    issuer: "BlackRock",
    category: "rwa",
    type: "treasury",
    pythFeedId: null,
    logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    coingeckoId: null,
    description: "Institutional treasury fund",
  },

  // === WRAPPED ASSETS & CRYPTO ===
  SOL: {
    mint: "So11111111111111111111111111111111111111112",
    name: "Wrapped SOL",
    symbol: "SOL",
    decimals: 9,
    issuer: "Solana",
    category: "crypto",
    type: "native",
    pythFeedId: "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    coingeckoId: "solana",
  },
  WBTC: {
    mint: "qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL",
    name: "Wrapped Bitcoin (Sollet)",
    symbol: "WBTC",
    decimals: 8,
    issuer: "Sollet",
    category: "wrapped-asset",
    type: "wrapped",
    pythFeedId: "c9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL/logo.png",
    coingeckoId: "wrapped-bitcoin",
  },
  WETH: {
    mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    name: "Wrapped Ethereum (Sollet)",
    symbol: "WETH",
    decimals: 8,
    issuer: "Sollet",
    category: "wrapped-asset",
    type: "wrapped",
    pythFeedId: "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png",
    coingeckoId: "ethereum",
  },

  // === YIELD-BEARING ASSETS ===
  JITOSOL: {
    mint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    name: "Jito Staked SOL",
    symbol: "jitoSOL",
    decimals: 9,
    issuer: "Jito",
    category: "yield-bearing",
    type: "yield-bearing",
    pythFeedId: null,
    logoUrl: "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
    coingeckoId: "jito-staked-sol",
    description: "Liquid staked SOL with MEV rewards",
  },
  MSOL: {
    mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    name: "Marinade Staked SOL",
    symbol: "mSOL",
    decimals: 9,
    issuer: "Marinade",
    category: "yield-bearing",
    type: "yield-bearing",
    pythFeedId: null,
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
    coingeckoId: "marinade-staked-sol",
    description: "Liquid staked SOL",
  },
  BNSOL: {
    mint: "BNso1VUJnh4zcfpZa6986Ea66P6TCp59hZA5GJJYeHJ",
    name: "Binance Staked SOL",
    symbol: "bNSOL",
    decimals: 9,
    issuer: "Binance",
    category: "yield-bearing",
    type: "yield-bearing",
    pythFeedId: null,
    logoUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BNso1VUJnh4zcfpZa6986Ea66P6TCp59hZA5GJJYeHJ/logo.png",
    coingeckoId: "binance-staked-sol",
    description: "Binance liquid staked SOL",
  },

  // === DeFi & Governance ===
  JUP: {
    mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    name: "Jupiter",
    symbol: "JUP",
    decimals: 6,
    issuer: "Jupiter",
    category: "crypto",
    type: "native",
    pythFeedId: null,
    logoUrl: "https://static.jup.ag/jup/icon.png",
    coingeckoId: "jupiter-exchange-solana",
    description: "Jupiter DEX governance token",
  },
  JTO: {
    mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
    name: "Jito",
    symbol: "JTO",
    decimals: 9,
    issuer: "Jito",
    category: "crypto",
    type: "native",
    pythFeedId: null,
    logoUrl: "https://storage.googleapis.com/token-metadata/JTO-256.png",
    coingeckoId: "jito-governance-token",
    description: "Jito governance token",
  },
  PYTH: {
    mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    name: "Pyth Network",
    symbol: "PYTH",
    decimals: 6,
    issuer: "Pyth",
    category: "crypto",
    type: "native",
    pythFeedId: null,
    logoUrl: "https://pyth.network/token.svg",
    coingeckoId: "pyth-network",
    description: "Oracle network token",
  },
};

// Derived lists
export const ASSET_LIST = Object.values(ASSETS);
export const ASSET_MINTS = ASSET_LIST.map((a) => a.mint);

// Category filters
export const STABLECOINS = ASSET_LIST.filter((a) => a.category === "stablecoin");
export const RWAS = ASSET_LIST.filter((a) => a.category === "rwa");
export const YIELD_BEARING = ASSET_LIST.filter((a) => a.category === "yield-bearing");
export const WRAPPED_ASSETS = ASSET_LIST.filter((a) => a.category === "wrapped-asset");
export const CRYPTO_ASSETS = ASSET_LIST.filter((a) => a.category === "crypto");

// Helper functions
export function getAssetByMint(mint: string): AssetInfo | undefined {
  return ASSET_LIST.find((a) => a.mint === mint);
}

export function getAssetBySymbol(symbol: string): AssetInfo | undefined {
  return ASSETS[symbol.toUpperCase()];
}

export function getAssetsByCategory(category: AssetInfo["category"]): AssetInfo[] {
  return ASSET_LIST.filter((a) => a.category === category);
}
