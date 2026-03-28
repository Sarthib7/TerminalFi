"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { fetchGlobalMarketData } from "@/lib/coingecko";
import { formatCompact } from "@/lib/format";

interface GlobalData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

export function MarketOverview() {
  const [data, setData] = useState<GlobalData | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchGlobalMarketData().then(setData);
    const interval = setInterval(() => {
      fetchGlobalMarketData().then(setData);
    }, 60000); // Update every minute

    const timeInterval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  if (!data) return null;

  const marketCapChange = data.market_cap_change_percentage_24h_usd || 0;
  const isPositive = marketCapChange >= 0;

  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b"
      style={{
        background: "linear-gradient(to right, #0a0e1a, #121826)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left: Market Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <DollarSign size={14} style={{ color: "var(--accent-cyan)" }} />
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Market Cap
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--accent-cyan)",
                fontWeight: 700,
              }}
            >
              {formatCompact(data.total_market_cap.usd)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp size={14} style={{ color: "var(--accent-green)" }} />
          ) : (
            <TrendingDown size={14} style={{ color: "var(--accent-red)" }} />
          )}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              24h Change
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: isPositive ? "var(--accent-green)" : "var(--accent-red)",
                fontWeight: 700,
              }}
            >
              {isPositive ? "+" : ""}
              {marketCapChange.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: "var(--accent-amber)" }} />
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              24h Volume
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--accent-amber)",
                fontWeight: 700,
              }}
            >
              {formatCompact(data.total_volume.usd)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-muted)",
              }}
            >
              BTC:{" "}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#f7931a",
                fontWeight: 600,
              }}
            >
              {data.market_cap_percentage.btc.toFixed(1)}%
            </span>
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--text-muted)",
              }}
            >
              ETH:{" "}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#627eea",
                fontWeight: 600,
              }}
            >
              {data.market_cap_percentage.eth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Right: Time */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 px-3 py-1"
          style={{
            background: "var(--accent-green)15",
            borderRadius: "2px",
            border: "1px solid var(--accent-green)40",
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--accent-green)" }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--accent-green)",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            LIVE MARKET
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          {time.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}{" "}
          UTC
        </div>
      </div>
    </div>
  );
}
