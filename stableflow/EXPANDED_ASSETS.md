# StableFlow Terminal - Expanded to All Assets

## ✅ What's Done

### 1. Comprehensive Asset Coverage
Expanded from **4 stablecoins** to **15+ assets** including:

#### Stablecoins (4)
- USDC (Circle)
- USDT (Tether)
- PYUSD (PayPal)
- EURC (Circle Euro)

#### RWAs - Real World Assets (3)
- **USDY** - Ondo US Dollar Yield (Treasury bonds)
- **OUSG** - Ondo Short-Term US Government Bonds
- **BUIDL** - BlackRock USD Institutional Digital Liquidity

#### Yield-Bearing Assets (3)
- **jitoSOL** - Jito Staked SOL (MEV rewards)
- **mSOL** - Marinade Staked SOL
- **bNSOL** - Binance Staked SOL

#### Wrapped Assets (2)
- **WBTC** - Wrapped Bitcoin
- **WETH** - Wrapped Ethereum

#### Crypto Assets (3)
- **SOL** - Solana
- **JUP** - Jupiter DEX token
- **JTO** - Jito governance token
- **PYTH** - Pyth Network oracle token

### 2. Asset Monitor Panel (formerly Peg Monitor)
**New Features**:
- **Category Filter** dropdown:
  - All Assets (15)
  - Stablecoins (4)
  - RWAs (3)
  - Yield (3)
  - Wrapped (2)
  - Crypto (4)

- **Category Badges**: Color-coded labels
  - 🟨 **RWA** - Amber
  - 🟢 **YIELD** - Green
  - 🔵 **CRYPTO** - Cyan

- **Smart Price Formatting**:
  - < $1: Shows 6 decimals
  - $1-$100: Shows 4 decimals
  - > $100: Compact format ($1.2K, $45.5M)

- **Real-Time Sparklines**: 20-point price history for every asset

### 3. All Panels Updated
- ✅ Asset Monitor (shows all 15 assets)
- ✅ Live Liquidity (works with any asset pair)
- ✅ Portfolio (shows all held assets)
- ✅ Yields (stablecoins only)
- ✅ Swap (supports all assets)

## 📊 Asset Data Structure

```typescript
export interface AssetInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  issuer: string;
  category: "stablecoin" | "rwa" | "yield-bearing" | "wrapped-asset" | "crypto";
  type: string;
  pythFeedId: string | null;
  logoUrl: string;
  coingeckoId: string | null;
  description?: string;
}
```

## 🔧 API Integration Status

### Working ✅
- **Pyth Oracle**: USDC, USDT, SOL, WBTC, WETH (5 assets)
- **DefiLlama**: Yield data for stablecoins
- **Helius**: Wallet balances for all assets

### Needs Configuration ⚠️
- **Jupiter Price API**: Requires API key for remaining 10 assets
  - You have the key: `c0acc9cf-c7f5-4d01-a466-a4f3735e7cbd`
  - Issue: Getting "Route not found" error
  - Possible cause: API endpoint changed or key needs activation

## 🚀 How to Test

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Open Browser Console (F12)
Look for:
```
[Prices] ✅ Pyth: Fetched 5 prices
[Prices] ⚠️ Jupiter fetch failed (may require API key)
```

### 3. Test Asset Monitor Panel
- Click dropdown: "All Assets (15)"
- Select "RWAs (3)" - should show USDY, OUSG, BUIDL
- Select "Yield (3)" - should show jitoSOL, mSOL, bNSOL
- Select "Crypto (4)" - should show SOL, JUP, JTO, PYTH

### 4. Test Price Sources
Assets with **real prices** from Pyth:
- USDC → ~$1.0000
- USDT → ~$1.0001
- SOL → ~$180 (check current price)
- WBTC → ~$96,000 (check current price)
- WETH → ~$3,600 (check current price)

Assets with **fallback prices** (need Jupiter):
- USDY, OUSG, BUIDL → $1.00 default
- jitoSOL, mSOL, bNSOL → $0.00 (need Jupiter)
- JUP, JTO, PYTH → $0.00 (need Jupiter)

## 🐛 Jupiter API Issue

### Problem
```bash
curl "https://api.jup.ag/price/v2?ids=EPj..." \
  -H "x-api-key: c0acc9cf-c7f5-4d01-a466-a4f3735e7cbd"

Response: {"message":"Route not found"}
```

### Possible Solutions

#### Option 1: Check Jupiter Docs
- Visit: https://station.jup.ag/docs/apis/price-api
- Verify correct endpoint format
- Check if API v2 still exists or moved to v6

#### Option 2: Try Alternative Endpoints
```bash
# Try v6 (quote API includes prices)
curl "https://quote-api.jup.ag/v6/quote?inputMint=...&outputMint=...&amount=1000000"

# Or try v4
curl "https://price.jup.ag/v4/price?ids=EPj..."
```

#### Option 3: Use CoinGecko as Backup
All assets have `coingeckoId` - can fetch from:
```
https://api.coingecko.com/api/v3/simple/price?ids=solana,jupiter-exchange-solana&vs_currencies=usd
```

## 📝 Files Created/Modified

### New Files
- `src/lib/assets.ts` - Comprehensive asset registry (15 assets)

### Modified Files
- `src/hooks/useStablecoinPrices.ts` - Now fetches all assets
- `src/components/panels/PegMonitorPanel.tsx` - Now "Asset Monitor" with filters
- `src/components/panels/LiveLiquidityPanel.tsx` - Works with all assets
- `src/hooks/useLiquidityDepth.ts` - Asset-aware
- `src/lib/helius.ts` - Tracks all assets in wallet

## 🎯 Next Steps

### Immediate (Fix Jupiter)
1. Check Jupiter API docs for correct v2 endpoint
2. Try v6 quote API as alternative
3. Or implement CoinGecko backup

### Enhancement (Bloomberg Look)
Per your feedback about terminal aesthetics:
- Add more Bloomberg-style elements
- Improve data density
- Add more charts/visualizations
- Enhance color scheme

## 🔍 Testing Commands

```bash
# Test Jupiter API directly
curl -H "x-api-key: c0acc9cf-c7f5-4d01-a466-a4f3735e7cbd" \
  "https://api.jup.ag/price/v2?ids=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

# Check if key is active at Jupiter station
# Visit: https://station.jup.ag/api-keys

# Test Pyth (should work)
curl "https://hermes.pyth.network/v2/updates/price/latest?ids[]=eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"
```

## 📊 Current Coverage

| Category | Assets | Price Source | Status |
|----------|--------|--------------|--------|
| Stablecoins | 4 | Pyth (2), Jupiter (2) | ⚠️ Partial |
| RWAs | 3 | Jupiter | ❌ Need API fix |
| Yield-bearing | 3 | Jupiter | ❌ Need API fix |
| Wrapped | 2 | Pyth | ✅ Working |
| Crypto | 4 | Pyth (1), Jupiter (3) | ⚠️ Partial |
| **Total** | **16** | **5 working** | **31% coverage** |

## 💡 Quick Win

Add CoinGecko backup to get 100% coverage:
```typescript
// src/lib/coingecko.ts
export async function fetchCoinGeckoPrices(ids: string[]) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`;
  const res = await fetch(url);
  return await res.json();
}
```

Then in `useStablecoinPrices`:
```typescript
// Fallback chain: Pyth → Jupiter → CoinGecko → $1.00
```

---

**Status**: ✅ Build passing, 15+ assets added, ready to test
**Next**: Fix Jupiter API or add CoinGecko backup for 100% coverage
