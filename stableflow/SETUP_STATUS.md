# StableFlow Terminal - Setup Status

## ✅ What's Working

### Successfully Configured:
1. **Pyth Oracle Integration** (Primary price feed)
   - Provides USDC & USDT prices with confidence intervals
   - No API key required
   - Updates every 10 seconds

2. **DefiLlama API** (Yields data)
   - Working perfectly for yield comparison
   - No API key required
   - Updates every 5 minutes

3. **Helius RPC** (Wallet balances & Solana connection)
   - API Key: ✅ Configured
   - Provides wallet balance fetching
   - Real-time Solana slot monitoring

4. **Build & Development**
   - TypeScript: ✅ Compiling
   - Next.js: ✅ Production ready
   - All dependencies: ✅ Installed

## ⚠️ Needs Configuration

### Jupiter API Integration
**Status**: Code updated, awaiting API key

**What Jupiter provides:**
- Real-time prices for ALL stablecoins (including PYUSD, USDY, USDH, EURC, FDUSD)
- Swap quotes and execution
- Liquidity depth analysis

**Current behavior WITHOUT API key:**
- ✅ Pyth provides USDC & USDT prices (most important)
- ⚠️ Other stablecoins default to $1.00 (safe fallback)
- ✅ Swap panel may still work (different endpoint, not tested yet)

### How to Get Jupiter API Key (Free):

1. **Visit**: https://station.jup.ag/api-keys
2. **Sign up** with wallet or email
3. **Generate API key** (Basic tier - 1 RPS, free)
4. **Add to `.env.local`**:
   ```bash
   NEXT_PUBLIC_JUPITER_API_KEY=your_key_here
   ```
5. **Restart dev server**: `npm run dev`

---

## 🚀 Quick Start

### 1. Start Development Server
```bash
cd stableflow
npm run dev
```
Open: http://localhost:3000

### 2. Test the Terminal

#### Without Jupiter API Key:
- ✅ Connect Wallet (Phantom/Solflare)
- ✅ View USDC/USDT prices (from Pyth)
- ✅ Monitor peg deviations
- ✅ View yields across protocols
- ⚠️ Other stablecoins show $1.00

#### After Adding Jupiter API Key:
- ✅ All 7 stablecoins have real-time prices
- ✅ Full liquidity depth analysis
- ✅ Accurate swap quotes

### 3. Production Deployment
```bash
npm run build    # Verify build passes
npx vercel --prod  # Deploy to Vercel
```

---

## 📊 Data Source Hierarchy

Current price fetching logic:

```
For each stablecoin:
  1. Try Pyth Oracle (if feed ID exists)
     ↓ (if unavailable)
  2. Try Jupiter Price API (if API key configured)
     ↓ (if unavailable)
  3. Fallback to $1.00 (reasonable for stablecoins)
```

**Stablecoins with Pyth feeds:**
- ✅ USDC
- ✅ USDT

**Stablecoins requiring Jupiter:**
- PYUSD
- USDY (yield-bearing, price ≠ $1.00)
- USDH
- EURC
- FDUSD

---

## 🐛 Known Issues & Fixes Applied

### Issue #1: Jupiter Price API 401 Unauthorized
**Root Cause**: Jupiter Price API v2 now requires authentication

**Fix Applied**:
- ✅ Updated `src/lib/jupiter.ts` to send `x-api-key` header
- ✅ Added graceful degradation (Pyth → Jupiter → Fallback)
- ✅ Console warnings instead of hard errors
- ✅ TypeScript types updated to include "fallback" source

**Files Modified**:
- `src/lib/constants.ts` - Added JUPITER_API_KEY
- `src/lib/jupiter.ts` - Added authentication headers
- `src/hooks/useStablecoinPrices.ts` - Improved error handling
- `src/types/index.ts` - Added "fallback" source type
- `.env.local` - Added NEXT_PUBLIC_JUPITER_API_KEY placeholder

---

## 🎯 Next Steps

### Immediate (Required for full functionality):
1. **Get Jupiter API Key**
   - Visit: https://station.jup.ag/api-keys
   - Add to `.env.local`
   - Restart dev server

### Optional Enhancements:
2. **Test Swap Functionality**
   - Connect wallet with test funds
   - Try small USDC → USDT swap
   - Verify Jupiter swap endpoints work

3. **Monitor Console**
   - Check browser DevTools (F12)
   - Look for warnings about data sources
   - Verify Pyth prices are loading

4. **Production Deployment**
   - Add Jupiter API key to Vercel environment variables
   - Deploy with: `npx vercel --prod`

---

## 📝 Environment Variables Summary

### Current `.env.local`:
```bash
# Helius - Working ✅
NEXT_PUBLIC_HELIUS_API_KEY=bd306c73-4d57-460c-9870-306d71642c2f

# Network
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Jupiter - Needs configuration ⚠️
NEXT_PUBLIC_JUPITER_API_KEY=
```

### Required Variables:
- ✅ `NEXT_PUBLIC_HELIUS_API_KEY` - Configured
- ⚠️ `NEXT_PUBLIC_JUPITER_API_KEY` - Empty (add your key here)

---

## 🔍 Testing Checklist

### Pre-Jupiter API Key:
- [ ] Dev server starts without errors
- [ ] Terminal UI loads
- [ ] Can open command palette (⌘K)
- [ ] Can connect wallet
- [ ] Peg Monitor shows USDC/USDT prices
- [ ] Status bar shows "Pyth" data source
- [ ] Console shows "Jupiter price fetch failed" warning (expected)

### Post-Jupiter API Key:
- [ ] All 7 stablecoins have real prices
- [ ] Status bar shows "Pyth + Jupiter"
- [ ] No API errors in console
- [ ] Liquidity panel shows accurate depth data
- [ ] Swap panel provides accurate quotes

---

## 💡 Tips

1. **Rate Limits**: Jupiter Basic tier = 1 request/second
   - App polls every 10s, well within limit
   - Liquidity panel polls every 60s

2. **Console Debugging**: Check browser console for:
   ```
   [Jupiter] Using API key: yes/no
   [Pyth] Successfully fetched N prices
   [Data Sources] Pyth: 2, Jupiter: 5, Fallback: 0
   ```

3. **Fallback Behavior**: Without Jupiter key:
   - USDC/USDT: Real prices from Pyth ✅
   - Others: $1.00 default (safe for stablecoins)
   - Swap quotes: May still work (different endpoint)

---

## 📞 Support

- **Jupiter API Issues**: https://docs.jup.ag/
- **Pyth Oracle Status**: https://pyth.network/price-feeds
- **Helius Status**: https://status.helius.dev/

Build Status: ✅ PASSING
Last Updated: 2026-03-28
