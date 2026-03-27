"use client";

import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Search } from "lucide-react";
import { fetchJupiterPrices } from "@/lib/jupiter";
import { formatUSD } from "@/lib/format";

const SOL_MINT = "So11111111111111111111111111111111111111112";

interface TopBarProps {
  onSearchClick: () => void;
}

export function TopBar({ onSearchClick }: TopBarProps) {
  const [solPrice, setSolPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const prices = await fetchJupiterPrices([SOL_MINT]);
        setSolPrice(prices[SOL_MINT] || null);
      } catch {
        // Silently fail — SOL price is nice-to-have
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 30_000); // Every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-4 border-b"
      style={{
        height: "40px",
        background: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left: Logo */}
      <div
        className="text-sm font-bold tracking-tight"
        style={{
          color: "var(--accent-cyan)",
          fontFamily: "var(--font-mono)",
        }}
      >
        STABLEFLOW
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={onSearchClick}
        className="flex items-center gap-2 px-3 py-1 rounded transition-colors"
        style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-color)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-hover)";
          e.currentTarget.style.borderColor = "var(--border-active)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg-input)";
          e.currentTarget.style.borderColor = "var(--border-color)";
        }}
      >
        <Search size={12} />
        <span>⌘K to search...</span>
      </button>

      {/* Right: SOL price + Wallet button */}
      <div className="flex items-center gap-3">
        {solPrice && (
          <div
            className="text-xs"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            SOL {formatUSD(solPrice)}
          </div>
        )}
        <WalletMultiButton />
      </div>
    </div>
  );
}
