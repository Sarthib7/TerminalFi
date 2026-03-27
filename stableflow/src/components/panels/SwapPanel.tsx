"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, ArrowDown } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { useJupiterSwap } from "@/hooks/useJupiterSwap";
import { STABLECOINS } from "@/lib/stablecoins";
import { formatTokenAmount, formatPercent } from "@/lib/format";

export function SwapPanel() {
  const { publicKey } = useWallet();
  const { state, getQuote, executeSwap, reset } = useJupiterSwap();

  const [inputSymbol, setInputSymbol] = useState("USDC");
  const [outputSymbol, setOutputSymbol] = useState("USDT");
  const [inputAmount, setInputAmount] = useState("");
  const [debouncedAmount, setDebouncedAmount] = useState("");

  const stablecoinOptions = Object.keys(STABLECOINS);
  const inputDecimals = STABLECOINS[inputSymbol]?.decimals ?? 6;
  const outputDecimals = STABLECOINS[outputSymbol]?.decimals ?? 6;

  // Debounce amount input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(inputAmount);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputAmount]);

  // Fetch quote when debounced amount changes
  useEffect(() => {
    const amount = parseFloat(debouncedAmount);
    if (
      amount > 0 &&
      inputSymbol !== outputSymbol &&
      inputSymbol &&
      outputSymbol
    ) {
      getQuote(inputSymbol, outputSymbol, amount);
    }
  }, [debouncedAmount, inputSymbol, outputSymbol, getQuote]);

  const handleSwap = () => {
    if (state.quote && publicKey) {
      executeSwap(state.quote);
    }
  };

  const outputAmount = state.quote
    ? parseFloat(state.quote.outAmount) / 10 ** outputDecimals
    : null;

  const priceImpact = state.quote
    ? parseFloat(state.quote.priceImpactPct) * 100
    : null;

  const route = state.quote?.routePlan?.[0]?.swapInfo?.label || null;

  const getButtonText = () => {
    if (!publicKey) return "Connect Wallet";
    if (state.status === "quoting") return "Fetching quote...";
    if (state.status === "signing") return "Sign in wallet...";
    if (state.status === "confirming") return "Confirming...";
    if (state.status === "success") return "Success ✓";
    if (state.status === "error") return "Error — Try again";
    if (!inputAmount || parseFloat(inputAmount) <= 0) return "Enter amount";
    if (inputSymbol === outputSymbol) return "Select different tokens";
    if (!state.quote) return "Get quote";
    return "Execute Swap";
  };

  const isButtonDisabled =
    !publicKey ||
    !inputAmount ||
    parseFloat(inputAmount) <= 0 ||
    inputSymbol === outputSymbol ||
    !state.quote ||
    state.status === "quoting" ||
    state.status === "signing" ||
    state.status === "confirming";

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Swap" icon={ArrowRightLeft} />

      <div
        className="flex-1 flex flex-col p-4 gap-4 overflow-auto"
        style={{ background: "var(--bg-panel)" }}
      >
        {/* Input section */}
        <div
          className="p-3 rounded"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            className="text-xs mb-2"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-sans)",
              textTransform: "uppercase",
              fontSize: "9px",
              letterSpacing: "0.05em",
            }}
          >
            You Pay
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "20px",
                fontWeight: 600,
              }}
            />
            <select
              value={inputSymbol}
              onChange={(e) => {
                setInputSymbol(e.target.value);
                reset();
              }}
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "6px 10px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {stablecoinOptions.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Arrow separator */}
        <div className="flex justify-center">
          <div
            className="flex items-center justify-center rounded"
            style={{
              width: "32px",
              height: "32px",
              background: "var(--bg-input)",
              border: "1px solid var(--border-color)",
            }}
          >
            <ArrowDown size={16} style={{ color: "var(--text-muted)" }} />
          </div>
        </div>

        {/* Output section */}
        <div
          className="p-3 rounded"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            className="text-xs mb-2"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-sans)",
              textTransform: "uppercase",
              fontSize: "9px",
              letterSpacing: "0.05em",
            }}
          >
            You Receive
          </div>
          <div className="flex items-center gap-2">
            <div
              style={{
                flex: 1,
                color: outputAmount
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              {state.status === "quoting"
                ? "..."
                : outputAmount
                ? formatTokenAmount(outputAmount, 4)
                : "0.00"}
            </div>
            <select
              value={outputSymbol}
              onChange={(e) => {
                setOutputSymbol(e.target.value);
                reset();
              }}
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "6px 10px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {stablecoinOptions.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quote details */}
        {state.quote && outputAmount && (
          <div
            className="p-3 rounded space-y-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--text-secondary)" }}>Rate</span>
              <span style={{ color: "var(--text-primary)" }}>
                1 {inputSymbol} ≈{" "}
                {formatTokenAmount(
                  outputAmount / parseFloat(inputAmount || "1"),
                  4
                )}{" "}
                {outputSymbol}
              </span>
            </div>
            {priceImpact !== null && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>
                  Price Impact
                </span>
                <span
                  style={{
                    color:
                      Math.abs(priceImpact) > 0.5
                        ? "var(--peg-danger)"
                        : Math.abs(priceImpact) > 0.1
                        ? "var(--peg-warning)"
                        : "var(--peg-safe)",
                  }}
                >
                  {formatPercent(priceImpact)}
                </span>
              </div>
            )}
            {route && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Route</span>
                <span style={{ color: "var(--text-primary)" }}>{route}</span>
              </div>
            )}
          </div>
        )}

        {/* Error display */}
        {state.error && (
          <div
            className="p-3 rounded text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--accent-red)",
              color: "var(--accent-red)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            {state.error}
          </div>
        )}

        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={isButtonDisabled}
          style={{
            padding: "12px 16px",
            background: isButtonDisabled
              ? "var(--bg-input)"
              : "var(--accent-cyan)",
            border: "1px solid var(--border-color)",
            color: isButtonDisabled
              ? "var(--text-muted)"
              : "var(--bg-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "4px",
            cursor: isButtonDisabled ? "not-allowed" : "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isButtonDisabled) {
              e.currentTarget.style.background = "var(--accent-blue)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isButtonDisabled) {
              e.currentTarget.style.background = "var(--accent-cyan)";
            }
          }}
        >
          {getButtonText()}
        </button>

        {/* Success message */}
        {state.status === "success" && state.txSignature && (
          <a
            href={`https://solscan.io/tx/${state.txSignature}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 12px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--accent-green)",
              color: "var(--accent-green)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              borderRadius: "4px",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            View on Solscan →
          </a>
        )}
      </div>
    </div>
  );
}
