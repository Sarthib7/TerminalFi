"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { useLiquidityDepth } from "@/hooks/useLiquidityDepth";
import { useStablecoinPrices } from "@/hooks/useStablecoinPrices";
import { formatUSD, formatPercent } from "@/lib/format";
import { ASSETS } from "@/lib/assets";

interface LiquidityFlowItem {
  id: string;
  direction: "buy" | "sell";
  amount: number;
  timestamp: number;
  y: number;
}

export function LiveLiquidityPanel() {
  const {
    data: tiers,
    isLoading,
    error,
    inputSymbol,
    outputSymbol,
    setInputSymbol,
    setOutputSymbol,
  } = useLiquidityDepth();

  const { data: prices } = useStablecoinPrices();
  const [flows, setFlows] = useState<LiquidityFlowItem[]>([]);
  const flowIdRef = useRef(0);

  // Simulate live liquidity flows
  useEffect(() => {
    if (!tiers || tiers.length === 0) return;

    const interval = setInterval(() => {
      // Generate random flow
      const direction = Math.random() > 0.5 ? "buy" : "sell";
      const tierIndex = Math.floor(Math.random() * tiers.length);
      const tier = tiers[tierIndex];

      if (!tier.outputAmount) return;

      const newFlow: LiquidityFlowItem = {
        id: `flow-${flowIdRef.current++}`,
        direction,
        amount: tier.inputAmount,
        timestamp: Date.now(),
        y: Math.random() * 80 + 10, // Random vertical position
      };

      setFlows((prev) => {
        const updated = [...prev, newFlow];
        // Keep only last 10 flows
        return updated.slice(-10);
      });

      // Remove after 3 seconds
      setTimeout(() => {
        setFlows((prev) => prev.filter((f) => f.id !== newFlow.id));
      }, 3000);
    }, 1500); // New flow every 1.5 seconds

    return () => clearInterval(interval);
  }, [tiers]);

  const assetOptions = Object.keys(ASSETS);

  // Calculate total liquidity
  const totalLiquidity = tiers?.reduce((sum, tier) => sum + (tier.inputAmount || 0), 0) || 0;

  // Get current price
  const inputPrice = prices?.find((p) => p.symbol === inputSymbol)?.price ?? 1.0;
  const outputPrice = prices?.find((p) => p.symbol === outputSymbol)?.price ?? 1.0;
  const priceSpread = ((outputPrice - inputPrice) / inputPrice) * 100;

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Live Liquidity" icon={Activity}>
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
            {assetOptions.map((symbol) => (
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
            {assetOptions.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>
      </PanelHeader>

      <div
        className="flex-1 overflow-hidden relative"
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
            className="flex flex-col items-center justify-center h-full gap-2"
            style={{
              color: "var(--accent-red)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            <div>Error loading liquidity</div>
            <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
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
          <>
            {/* Live stats bar */}
            <div
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{
                background: "var(--bg-panel-header)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "9px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Depth
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      color: "var(--accent-cyan)",
                      fontWeight: 700,
                    }}
                  >
                    {formatUSD(totalLiquidity, 0)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "9px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Spread
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: Math.abs(priceSpread) > 0.1 ? "var(--accent-amber)" : "var(--peg-safe)",
                      fontWeight: 600,
                    }}
                  >
                    {formatPercent(priceSpread, 4)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Activity
                  size={12}
                  style={{ color: "var(--accent-green)" }}
                  className="animate-pulse"
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    color: "var(--accent-green)",
                  }}
                >
                  LIVE
                </span>
              </div>
            </div>

            {/* Depth visualization */}
            <div className="flex-1 flex">
              {/* Left: Depth bars */}
              <div className="flex-1 flex flex-col justify-center gap-2 px-4">
                {tiers?.map((tier, index) => {
                  const maxAmount = tiers[0]?.inputAmount || 1;
                  const widthPercent = (tier.inputAmount / maxAmount) * 100;
                  const absSlippage = Math.abs(tier.priceImpactPercent || 0);
                  let slippageColor = "var(--peg-safe)";
                  if (absSlippage > 0.5) slippageColor = "var(--peg-danger)";
                  else if (absSlippage > 0.05) slippageColor = "var(--peg-warning)";

                  return (
                    <div
                      key={tier.inputAmount}
                      className="flex items-center gap-2"
                      style={{
                        opacity: 0.9 - index * 0.15,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "var(--text-muted)",
                          width: "60px",
                          textAlign: "right",
                        }}
                      >
                        {formatUSD(tier.inputAmount, 0)}
                      </div>
                      <div className="flex-1 relative h-8">
                        <div
                          className="absolute inset-y-0 left-0 transition-all duration-500"
                          style={{
                            width: `${widthPercent}%`,
                            background: `linear-gradient(90deg, ${slippageColor}40, ${slippageColor}10)`,
                            border: `1px solid ${slippageColor}60`,
                            borderRadius: "2px",
                          }}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-end px-2"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "9px",
                            color: slippageColor,
                            fontWeight: 600,
                          }}
                        >
                          {tier.priceImpactPercent !== null
                            ? formatPercent(tier.priceImpactPercent)
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Live flow animation */}
              <div
                className="w-1/3 relative border-l"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at center, var(--bg-hover) 0%, transparent 70%)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Flow Activity
                  </div>
                </div>

                {flows.map((flow) => (
                  <div
                    key={flow.id}
                    className="absolute flex items-center gap-1 px-2 py-1 animate-fade-in-out"
                    style={{
                      top: `${flow.y}%`,
                      left: flow.direction === "buy" ? "10%" : "60%",
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      color: flow.direction === "buy" ? "var(--accent-green)" : "var(--accent-red)",
                      background: flow.direction === "buy"
                        ? "var(--accent-green)20"
                        : "var(--accent-red)20",
                      border: `1px solid ${
                        flow.direction === "buy" ? "var(--accent-green)" : "var(--accent-red)"
                      }40`,
                      borderRadius: "2px",
                      animation: "slideFlow 3s ease-out forwards",
                    }}
                  >
                    {flow.direction === "buy" ? (
                      <TrendingUp size={10} />
                    ) : (
                      <TrendingDown size={10} />
                    )}
                    <span>{formatUSD(flow.amount, 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideFlow {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          10% {
            opacity: 1;
            transform: translateX(0);
          }
          90% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(20px);
          }
        }

        .animate-fade-in-out {
          animation: slideFlow 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
