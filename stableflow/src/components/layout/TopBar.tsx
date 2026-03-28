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

      {/* Center: Navigation */}
      <div className="flex items-center gap-6">
        <a
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            padding: "4px 12px",
            borderRadius: "2px",
            transition: "all 0.2s",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--accent-cyan)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          Dashboard
        </a>
        <a
          href="/portfolio"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            padding: "4px 12px",
            borderRadius: "2px",
            transition: "all 0.2s",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--accent-cyan)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          Portfolio
        </a>
        <button
          onClick={onSearchClick}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <Search size={14} />
        </button>
      </div>

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
