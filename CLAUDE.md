# CLAUDE.md — StableFlow Terminal

## What Is This Project

StableFlow is a wallet-connected stablecoin operations terminal for Solana. Think Bloomberg Terminal but for stablecoin liquidity — dark themed, keyboard-first, multi-panel, with real-time data and swap execution.

**Target**: Hackathon-ready demo in 1-2 weeks.
**Users**: Treasury managers and stablecoin operators on Solana.
**Core Loop**: Connect wallet → see positions → monitor peg stability → compare yields → execute swaps.

## Tech Stack

- **Framework**: Next.js 15 (App Router, `src/` directory)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + CSS custom properties for terminal dark theme
- **UI Library**: shadcn/ui (already initialized)
- **Tiling Layout**: `react-mosaic-component` for Bloomberg-style resizable panels
- **Command Palette**: `cmdk` for ⌘K navigation
- **Charts**: `lightweight-charts` (TradingView) for sparklines and price charts
- **Data Fetching**: `@tanstack/react-query` with polling intervals
- **Tables**: `@tanstack/react-table` (headless)
- **Wallet**: `@solana/wallet-adapter-react` + `@solana/wallet-adapter-wallets`
- **Solana SDK**: `@solana/web3.js`, `@solana/spl-token`
- **Swap**: Jupiter API (REST, no SDK needed)
- **Notifications**: `sonner` for toasts

## Architecture Rules

1. **No backend.** Everything is client-side. Data comes from public APIs (Jupiter, Helius, Pyth, DefiLlama). No database, no auth, no server routes.
2. **No API routes.** Do not create `app/api/` routes. All API calls happen client-side via TanStack Query hooks.
3. **Environment variables** are `NEXT_PUBLIC_*` only since everything is client-side.
4. **One page app.** The terminal lives entirely on `app/page.tsx`. No routing needed.
5. **Panel architecture.** Each panel is a self-contained React component in `src/components/panels/`. Panels receive no props — they use hooks for data.
6. **Hooks for data.** Every data source has a dedicated hook in `src/hooks/` that wraps TanStack Query.
7. **Lib for API wrappers.** Raw API call functions live in `src/lib/`. Hooks consume these functions.

## Coding Standards

- Use `async/await` everywhere, never raw `.then()` chains
- All numbers from APIs are strings or BigInt — parse carefully with explicit decimal handling
- Use `Intl.NumberFormat` for display formatting, wrapped in `src/lib/format.ts` helpers
- Never use `any` type — define proper interfaces in `src/types/index.ts`
- Components use named exports, not default exports
- File names use PascalCase for components, camelCase for utilities and hooks
- Tailwind classes only — no inline styles, no CSS modules
- Error boundaries around each panel so one failing panel doesn't crash the terminal

## Key Gotchas

1. **Solana token amounts are in lamports.** USDC has 6 decimals, so 1 USDC = 1,000,000 lamports. Always divide by `10 ** decimals` for display.
2. **Jupiter amounts are in lamports too.** The `amount` param in quote API is the input amount in smallest units.
3. **Jupiter Price API returns strings.** Parse with `parseFloat()`.
4. **Wallet adapter needs `WalletModalProvider` wrapping.** Without it, the connect button won't open the wallet selection modal.
5. **`VersionedTransaction` not `Transaction`.** Jupiter returns v0 transactions. Use `VersionedTransaction.deserialize()`.
6. **Pyth feed IDs don't have `0x` prefix** in the Hermes API. Strip it if present.
7. **DefiLlama yields endpoint** returns ALL pools across ALL chains. Filter for `chain === "Solana"` client-side.
8. **react-mosaic** requires explicit CSS import: `import 'react-mosaic-component/react-mosaic-component.css'`
9. **Next.js App Router**: wallet adapter is a client component. Mark with `"use client"` at the top of provider files and any component using hooks.

## File Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout — wraps Providers
│   ├── page.tsx              # Main terminal page — renders TerminalShell
│   └── globals.css           # Tailwind base + terminal CSS variables
├── components/
│   ├── layout/
│   │   ├── TerminalShell.tsx  # Top bar + Mosaic + Status bar
│   │   ├── TopBar.tsx         # Logo, search trigger, SOL price, wallet button
│   │   ├── StatusBar.tsx      # Network, slot, connection indicator
│   │   ├── CommandPalette.tsx # ⌘K overlay with cmdk
│   │   └── PanelHeader.tsx    # Reusable panel title bar
│   ├── panels/
│   │   ├── PortfolioPanel.tsx  # Wallet stablecoin balances
│   │   ├── PegMonitorPanel.tsx # All stablecoin prices vs $1 peg
│   │   ├── LiquidityPanel.tsx  # Slippage depth for a pair
│   │   ├── YieldPanel.tsx      # Lending APY comparison matrix
│   │   └── SwapPanel.tsx       # Jupiter swap form + execution
│   └── ui/                     # shadcn/ui generated components
├── hooks/
│   ├── useStablecoinPrices.ts
│   ├── useTokenBalances.ts
│   ├── useLiquidityDepth.ts
│   ├── useYields.ts
│   ├── useJupiterSwap.ts
│   └── useSolanaSlot.ts
├── lib/
│   ├── stablecoins.ts         # Stablecoin registry (mint addresses, metadata)
│   ├── jupiter.ts             # Jupiter API functions
│   ├── helius.ts              # Helius RPC/API functions
│   ├── pyth.ts                # Pyth Hermes API functions
│   ├── defillama.ts           # DefiLlama API functions
│   ├── format.ts              # Number/currency formatters
│   └── constants.ts           # Env vars, URLs, config
├── providers/
│   ├── Providers.tsx           # Combines all providers into one wrapper
│   ├── WalletProvider.tsx      # Solana wallet adapter setup
│   └── QueryProvider.tsx       # TanStack Query client setup
└── types/
    └── index.ts               # All TypeScript interfaces
```

## Running the Project

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

## Deployment

Deploy to Vercel:
```bash
npx vercel --prod
```

No build configuration needed — Vercel auto-detects Next.js.

## PRD Location

The full Product Requirements Document with every component implementation, API details, and acceptance criteria is at `docs/PRD.md`. Read it before building any feature.
