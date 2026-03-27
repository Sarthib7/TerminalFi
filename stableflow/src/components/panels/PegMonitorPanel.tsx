"use client";

import { Activity, Circle } from "lucide-react";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { useStablecoinPrices } from "@/hooks/useStablecoinPrices";
import { formatUSD, formatPegDeviation } from "@/lib/format";
import { STABLECOIN_LIST } from "@/lib/stablecoins";

export function PegMonitorPanel() {
  const { data: prices, isLoading, error } = useStablecoinPrices();

  const priceMap = new Map(prices?.map((p) => [p.mint, p]) || []);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Peg Monitor" icon={Activity} />

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
              {STABLECOIN_LIST.map((coin) => {
                const priceData = priceMap.get(coin.mint);
                const price = priceData?.price ?? 1.0;
                const isYieldBearing = coin.type === "yield-bearing";
                const pegDev = formatPegDeviation(price);

                let statusColor = "var(--peg-safe)";
                if (!isYieldBearing) {
                  if (pegDev.color === "danger") statusColor = "var(--peg-danger)";
                  else if (pegDev.color === "warning")
                    statusColor = "var(--peg-warning)";
                }

                return (
                  <tr
                    key={coin.mint}
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
                          src={coin.logoUrl}
                          alt={coin.symbol}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              color: "var(--text-primary)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {coin.symbol}
                          </div>
                          <div
                            style={{
                              color: "var(--text-muted)",
                              fontFamily: "var(--font-sans)",
                              fontSize: "9px",
                            }}
                          >
                            {coin.issuer}
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
                      {formatUSD(price, 4)}
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
                      {isYieldBearing ? "N/A" : pegDev.text}
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
