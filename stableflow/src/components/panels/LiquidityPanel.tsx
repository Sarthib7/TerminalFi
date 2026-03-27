"use client";

import { TrendingUp } from "lucide-react";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { useLiquidityDepth } from "@/hooks/useLiquidityDepth";
import { formatUSD, formatTokenAmount, formatPercent } from "@/lib/format";
import { STABLECOINS } from "@/lib/stablecoins";

export function LiquidityPanel() {
  const {
    data: tiers,
    isLoading,
    error,
    inputSymbol,
    outputSymbol,
    setInputSymbol,
    setOutputSymbol,
  } = useLiquidityDepth();

  const stablecoinOptions = Object.keys(STABLECOINS);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Liquidity Depth" icon={TrendingUp}>
        <div className="flex items-center gap-2">
          <select
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
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
            {stablecoinOptions.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          <span
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
            }}
          >
            →
          </span>
          <select
            value={outputSymbol}
            onChange={(e) => setOutputSymbol(e.target.value)}
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
            {stablecoinOptions.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
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
            Loading liquidity data...
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
            Error loading liquidity
          </div>
        ) : inputSymbol === outputSymbol ? (
          <div
            className="flex items-center justify-center h-full"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            Select different input and output tokens
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
                  Amount
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
                  Output
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
                  Slippage
                </th>
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
                  Route
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers?.map((tier) => {
                const absSlippage = Math.abs(tier.priceImpactPercent || 0);
                let slippageColor = "var(--peg-safe)";
                if (absSlippage > 0.5) slippageColor = "var(--peg-danger)";
                else if (absSlippage > 0.05)
                  slippageColor = "var(--peg-warning)";

                return (
                  <tr
                    key={tier.inputAmount}
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
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {formatUSD(tier.inputAmount, 0)}
                    </td>
                    <td
                      className="text-right px-3 py-2"
                      style={{
                        color: tier.outputAmount
                          ? "var(--text-primary)"
                          : "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                      }}
                    >
                      {tier.outputAmount
                        ? formatTokenAmount(tier.outputAmount, 2)
                        : "N/A"}
                    </td>
                    <td
                      className="text-right px-3 py-2"
                      style={{
                        color: tier.priceImpactPercent
                          ? slippageColor
                          : "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {tier.priceImpactPercent !== null
                        ? formatPercent(tier.priceImpactPercent)
                        : "N/A"}
                    </td>
                    <td
                      className="px-3 py-2"
                      style={{
                        color: tier.route
                          ? "var(--text-secondary)"
                          : "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                      }}
                    >
                      {tier.route || tier.error || "Unknown"}
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
