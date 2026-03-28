"use client";

import { useEffect, useState } from "react";
import { fetchTrendingCoins } from "@/lib/coingecko";

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    price_btc: number;
  };
}

export function NewsTicker() {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);

  useEffect(() => {
    fetchTrendingCoins().then(setTrending);
    const interval = setInterval(() => {
      fetchTrendingCoins().then(setTrending);
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (trending.length === 0) return null;

  return (
    <div
      className="overflow-hidden border-b"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
        height: "32px",
      }}
    >
      <div className="flex items-center h-full animate-scroll">
        <div className="flex items-center gap-8 px-4">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--accent-amber)",
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            🔥 TRENDING
          </div>
          {trending.map((coin) => (
            <div key={coin.item.id} className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                {coin.item.symbol.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "var(--text-muted)",
                }}
              >
                #{coin.item.market_cap_rank}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
