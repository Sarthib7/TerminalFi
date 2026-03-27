"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  Wallet,
  TrendingUp,
  Activity,
  Coins,
  ArrowRightLeft,
} from "lucide-react";
import { STABLECOIN_LIST } from "@/lib/stablecoins";
import type { PanelId } from "@/types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PANEL_COMMANDS = [
  { id: "portfolio" as PanelId, title: "Portfolio", icon: Wallet },
  { id: "peg-monitor" as PanelId, title: "Peg Monitor", icon: Activity },
  { id: "liquidity" as PanelId, title: "Liquidity", icon: TrendingUp },
  { id: "yield" as PanelId, title: "Yield", icon: Coins },
  { id: "swap" as PanelId, title: "Swap", icon: ArrowRightLeft },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "640px",
          maxHeight: "60vh",
          background: "var(--bg-panel)",
          border: "1px solid var(--border-active)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Command
          style={{
            background: "transparent",
            color: "var(--text-primary)",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid var(--border-color)",
              padding: "12px 16px",
            }}
          >
            <Command.Input
              placeholder="Search panels and stablecoins..."
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
              }}
            />
          </div>
          <Command.List
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "8px",
            }}
          >
            <Command.Empty
              style={{
                padding: "24px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
            >
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Panels"
              style={{
                padding: "8px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {PANEL_COMMANDS.map((panel) => {
                const Icon = panel.icon;
                return (
                  <Command.Item
                    key={panel.id}
                    onSelect={() => {
                      // In a real implementation, this would focus the panel
                      console.log(`Focus panel: ${panel.id}`);
                      onOpenChange(false);
                    }}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      marginBottom: "2px",
                    }}
                    className="command-item"
                  >
                    <Icon size={16} style={{ color: "var(--accent-cyan)" }} />
                    <span>{panel.title}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Separator
              style={{
                height: "1px",
                background: "var(--border-color)",
                margin: "8px 0",
              }}
            />

            <Command.Group
              heading="Stablecoins"
              style={{
                padding: "8px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {STABLECOIN_LIST.map((coin) => (
                <Command.Item
                  key={coin.mint}
                  onSelect={() => {
                    console.log(`Selected stablecoin: ${coin.symbol}`);
                    onOpenChange(false);
                  }}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    marginBottom: "2px",
                  }}
                  className="command-item"
                >
                  <img
                    src={coin.logoUrl}
                    alt={coin.symbol}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "var(--text-primary)" }}>
                      {coin.symbol}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {coin.name}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-secondary)",
                      textTransform: "capitalize",
                    }}
                  >
                    {coin.type}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>

        <style jsx global>{`
          .command-item:hover {
            background: var(--bg-hover) !important;
          }
          .command-item[aria-selected="true"] {
            background: var(--bg-hover) !important;
          }
        `}</style>
      </div>
    </div>
  );
}
