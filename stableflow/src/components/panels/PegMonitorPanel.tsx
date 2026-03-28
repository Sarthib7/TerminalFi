"use client";

import { useEffect, useState } from "react";
import { Activity, Circle, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { useStablecoinPrices } from "@/hooks/useStablecoinPrices";
import { formatUSD, formatPegDeviation, formatCompact } from "@/lib/format";
import { ASSET_LIST, STABLECOINS, RWAS, YIELD_BEARING, WRAPPED_ASSETS, CRYPTO_ASSETS, type AssetInfo } from "@/lib/assets";

interface PriceHistory {
  [mint: string]: number[];
}

export function PegMonitorPanel() {
  const { data: prices, isLoading, error } = useStablecoinPrices();
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({});
  const [filter, setFilter] = useState<"all" | "stablecoin" | "rwa" | "yield-bearing" | "wrapped-asset" | "crypto">("all");

  // Track price history for sparklines
  useEffect(() => {
    if (!prices) return;

    setPriceHistory((prev) => {
      const updated = { ...prev };
      prices.forEach((p) => {
        if (!updated[p.mint]) {
          updated[p.mint] = [];
        }
        updated[p.mint] = [...updated[p.mint], p.price].slice(-20); // Keep last 20 points
      });
      return updated;
    });
  }, [prices]);

  const priceMap = new Map(prices?.map((p) => [p.mint, p]) || []);

  // Filter assets by category
  const filteredAssets = ASSET_LIST.filter((asset) => {
    if (filter === "all") return true;
    return asset.category === filter;
  });

  // Mini sparkline renderer
  const renderSparkline = (mint: string) => {
    const history = priceHistory[mint];
    if (!history || history.length < 2) return null;

    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 0.001;

    const points = history
      .map((value, index) => {
        const x = (index / (history.length - 1)) * 40;
        const y = 12 - ((value - min) / range) * 12;
        return `${x},${y}`;
      })
      .join(" ");

    const trend = history[history.length - 1] > history[0];

    return (
      <svg width="40" height="12" className="inline-block ml-2">
        <polyline
          points={points}
          fill="none"
          stroke={trend ? "var(--accent-green)" : "var(--accent-red)"}
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Asset Monitor" icon={Activity}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            padding: "4px 8px",
            borderRadius: "2px",
          }}
        >
          <option value="all">All Assets ({ASSET_LIST.length})</option>
          <option value="stablecoin">Stablecoins ({STABLECOINS.length})</option>
          <option value="rwa">RWAs ({RWAS.length})</option>
          <option value="yield-bearing">Yield ({YIELD_BEARING.length})</option>
          <option value="wrapped-asset">Wrapped ({WRAPPED_ASSETS.length})</option>
          <option value="crypto">Crypto ({CRYPTO_ASSETS.length})</option>
        </select>
      </PanelHeader>

      <div
        className="flex-1 overflow-auto"
        style={{ background: "var(--bg-panel)" }}
      >
        {isLoading ? (
          <div
            className="flex items-center justify-center h-full"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            Loading prices...
          </div>
        ) : error ? (
          <div
            className="flex items-center justify-center h-full"
            style={{
              color: "var(--accent-red)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            Error loading prices
          </div>
        ) : (
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "var(--bg-panel-header)",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <tr>
                <th
                  className="text-left px-3 py-2"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Asset
                </th>
                <th
                  className="text-right px-3 py-2"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Price
                </th>
                <th
                  className="text-right px-3 py-2"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Deviation
                </th>
                <th
                  className="text-center px-3 py-2"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const priceData = priceMap.get(asset.mint);
                const price = priceData?.price ?? 1.0;
                const isStablecoin = asset.category === "stablecoin";
                const isYieldBearing = asset.type === "yield-bearing";
                const pegDev = isStablecoin ? formatPegDeviation(price) : { text: "N/A", color: "safe" as const };

                let statusColor = "var(--peg-safe)";
                if (isStablecoin && !isYieldBearing) {
                  if (pegDev.color === "danger") statusColor = "var(--peg-danger)";
                  else if (pegDev.color === "warning")
                    statusColor = "var(--peg-warning)";
                }

                // Category badge color
                let categoryColor = "var(--text-muted)";
                if (asset.category === "rwa") categoryColor = "var(--accent-amber)";
                else if (asset.category === "yield-bearing") categoryColor = "var(--accent-green)";
                else if (asset.category === "crypto") categoryColor = "var(--accent-cyan)";

                return (
                  <tr
                    key={asset.mint}
                    className="border-b transition-colors"
                    style={{
                      borderColor: "var(--border-color)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={asset.logoUrl}
                          alt={asset.symbol}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/20?text=" + asset.symbol[0];
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span
                              style={{
                                color: "var(--text-primary)",
                                fontFamily: "var(--font-mono)",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {asset.symbol}
                            </span>
                            {asset.category !== "stablecoin" && (
                              <span
                                style={{
                                  color: categoryColor,
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "8px",
                                  textTransform: "uppercase",
                                  padding: "1px 3px",
                                  background: `${categoryColor}15`,
                                  borderRadius: "2px",
                                }}
                              >
                                {asset.category === "rwa" ? "RWA" : asset.category === "yield-bearing" ? "YIELD" : asset.category.slice(0, 4)}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              color: "var(--text-muted)",
                              fontFamily: "var(--font-sans)",
                              fontSize: "9px",
                            }}
                          >
                            {asset.issuer}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="text-right px-3 py-2"
                      style={{
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                      }}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {price > 100 ? formatCompact(price) : formatUSD(price, price < 1 ? 6 : 4)}
                        {renderSparkline(asset.mint)}
                      </div>
                    </td>
                    <td
                      className="text-right px-3 py-2"
                      style={{
                        color: isYieldBearing
                          ? "var(--text-muted)"
                          : statusColor,
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {isStablecoin && !isYieldBearing ? pegDev.text : "N/A"}
                    </td>
                    <td className="text-center px-3 py-2">
                      <div className="flex justify-center">
                        <Circle
                          size={8}
                          fill={statusColor}
                          style={{ color: statusColor }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
