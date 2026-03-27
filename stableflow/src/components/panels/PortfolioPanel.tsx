"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { formatUSD, formatTokenAmount } from "@/lib/format";

export function PortfolioPanel() {
  const { publicKey } = useWallet();
  const { data: balances, isLoading, error } = useTokenBalances();

  const totalValue =
    balances?.reduce((sum, token) => sum + token.usdValue, 0) || 0;

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Portfolio" icon={Wallet} />

      {!publicKey ? (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4"
          style={{ background: "var(--bg-panel)" }}
        >
          <div
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            Connect your wallet to view balances
          </div>
          <WalletMultiButton />
        </div>
      ) : (
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ background: "var(--bg-panel)" }}
        >
          {isLoading ? (
            <div
              className="flex-1 flex items-center justify-center"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
              }}
            >
              Loading balances...
            </div>
          ) : error ? (
            <div
              className="flex-1 flex items-center justify-center"
              style={{
                color: "var(--accent-red)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
              }}
            >
              Error loading balances
            </div>
          ) : !balances || balances.length === 0 ? (
            <div
              className="flex-1 flex items-center justify-center"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
              }}
            >
              No stablecoin balances found
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
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
                        Balance
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
                        USD Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {balances.map((token) => (
                      <tr
                        key={token.mint}
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
                              src={token.logoUrl}
                              alt={token.symbol}
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
                                {token.symbol}
                              </div>
                              <div
                                style={{
                                  color: "var(--text-muted)",
                                  fontFamily: "var(--font-sans)",
                                  fontSize: "10px",
                                }}
                              >
                                {token.name}
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
                          {formatTokenAmount(token.amount, 2)}
                        </td>
                        <td
                          className="text-right px-3 py-2"
                          style={{
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {formatUSD(token.usdValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer with total */}
              <div
                className="px-3 py-2 border-t flex items-center justify-between"
                style={{
                  background: "var(--bg-panel-header)",
                  borderColor: "var(--border-color)",
                }}
              >
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Total Value
                </span>
                <span
                  style={{
                    color: "var(--accent-cyan)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {formatUSD(totalValue)}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
