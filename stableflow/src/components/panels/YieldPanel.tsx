"use client";

import { Coins } from "lucide-react";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { useYields } from "@/hooks/useYields";
import { formatPercent, formatCompact } from "@/lib/format";

export function YieldPanel() {
  const { data: yields, isLoading, error } = useYields();

  // Group yields by protocol for matrix display
  const protocols = Array.from(
    new Set(yields?.map((y) => y.protocol) || [])
  ).sort();
  const symbols = ["USDC", "USDT", "PYUSD"];

  // Create a matrix: protocol → symbol → yield data
  const yieldMatrix = new Map<string, Map<string, typeof yields>>();

  yields?.forEach((y) => {
    if (!yieldMatrix.has(y.protocol)) {
      yieldMatrix.set(y.protocol, new Map());
    }
    const protocolMap = yieldMatrix.get(y.protocol)!;
    if (!protocolMap.has(y.symbol)) {
      protocolMap.set(y.symbol, []);
    }
    protocolMap.get(y.symbol)!.push(y);
  });

  // Find best APY per symbol for highlighting
  const bestApyPerSymbol = new Map<string, number>();
  symbols.forEach((symbol) => {
    const allApys = yields?.filter((y) => y.symbol === symbol).map((y) => y.apy) || [];
    if (allApys.length > 0) {
      bestApyPerSymbol.set(symbol, Math.max(...allApys));
    }
  });

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Lending Yields" icon={Coins} />

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
            Loading yields...
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
            Error loading yields
          </div>
        ) : !yields || yields.length === 0 ? (
          <div
            className="flex items-center justify-center h-full"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            No yield data available
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
                  Protocol
                </th>
                {symbols.map((symbol) => (
                  <th
                    key={symbol}
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
                    {symbol}
                  </th>
                ))}
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
                  TVL
                </th>
              </tr>
            </thead>
            <tbody>
              {protocols.map((protocol) => {
                const protocolYields = yieldMatrix.get(protocol)!;
                // Get max TVL for this protocol
                const maxTvl = Math.max(
                  ...Array.from(protocolYields.values())
                    .flat()
                    .map((y) => y.tvl)
                );

                return (
                  <tr
                    key={protocol}
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
                    <td
                      className="px-3 py-2"
                      style={{
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {protocol}
                    </td>
                    {symbols.map((symbol) => {
                      const symbolYields = protocolYields.get(symbol);
                      const yieldData = symbolYields?.[0]; // Take first (highest) if multiple
                      const isBest =
                        yieldData &&
                        yieldData.apy === bestApyPerSymbol.get(symbol);

                      return (
                        <td
                          key={symbol}
                          className="text-right px-3 py-2"
                          style={{
                            color: yieldData
                              ? isBest
                                ? "var(--accent-green)"
                                : "var(--text-primary)"
                              : "var(--text-muted)",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            fontWeight: isBest ? 700 : 400,
                          }}
                        >
                          {yieldData ? `${yieldData.apy.toFixed(2)}%` : "—"}
                        </td>
                      );
                    })}
                    <td
                      className="text-right px-3 py-2"
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                      }}
                    >
                      {formatCompact(maxTvl)}
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
