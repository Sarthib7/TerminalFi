#!/bin/bash
# StableFlow Terminal — Bootstrap Script
# Run this FIRST before writing any code.

set -e

echo "=== Creating Next.js project ==="
npx create-next-app@latest stableflow \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack

cd stableflow

echo "=== Installing Solana dependencies ==="
npm install \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets \
  @solana/wallet-adapter-base \
  @solana/web3.js \
  @solana/spl-token

echo "=== Installing UI dependencies ==="
npm install \
  react-mosaic-component \
  cmdk \
  lucide-react \
  sonner \
  class-variance-authority \
  clsx \
  tailwind-merge

echo "=== Installing data dependencies ==="
npm install \
  @tanstack/react-query \
  @tanstack/react-table \
  lightweight-charts

echo "=== Installing dev dependencies ==="
npm install -D @types/node

echo "=== Initializing shadcn/ui ==="
npx shadcn@latest init -d

echo "=== Adding shadcn components ==="
npx shadcn@latest add button input label select card badge dialog popover separator tooltip dropdown-menu tabs scroll-area

echo "=== Creating directory structure ==="
mkdir -p src/components/layout
mkdir -p src/components/panels
mkdir -p src/components/charts
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/providers
mkdir -p src/types
mkdir -p public/tokens
mkdir -p docs

echo "=== Creating .env.local ==="
cat > .env.local << 'EOF'
# Get a free API key at https://dev.helius.xyz/dashboard/app
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key_here
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
EOF

echo "=== Setup complete! ==="
echo "Next steps:"
echo "1. Add your Helius API key to .env.local"
echo "2. Copy CLAUDE.md to the project root"
echo "3. Copy docs/PRD.md to the docs/ directory"
echo "4. Run: npm run dev"
