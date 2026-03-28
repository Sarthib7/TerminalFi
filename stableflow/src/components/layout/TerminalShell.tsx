"use client";

import { useState } from "react";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import type { MosaicNode } from "react-mosaic-component";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { CommandPalette } from "./CommandPalette";
import { PortfolioPanel } from "@/components/panels/PortfolioPanel";
import { PegMonitorPanel } from "@/components/panels/PegMonitorPanel";
import { LiveLiquidityPanel } from "@/components/panels/LiveLiquidityPanel";
import { YieldPanel } from "@/components/panels/YieldPanel";
import { SwapPanel } from "@/components/panels/SwapPanel";
import type { PanelId } from "@/types";

const DEFAULT_LAYOUT: MosaicNode<PanelId> = {
  type: "split",
  direction: "row",
  splitPercentages: [40, 60],
  children: [
    {
      type: "split",
      direction: "column",
      splitPercentages: [50, 50],
      children: ["portfolio", "yield"],
    },
    {
      type: "split",
      direction: "column",
      splitPercentages: [50, 50],
      children: [
        "peg-monitor",
        {
          type: "split",
          direction: "row",
          splitPercentages: [50, 50],
          children: ["liquidity", "swap"],
        },
      ],
    },
  ],
};

export function TerminalShell() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [currentLayout, setCurrentLayout] =
    useState<MosaicNode<PanelId> | null>(DEFAULT_LAYOUT);

  const renderTile = (id: PanelId) => {
    let content: React.ReactNode;

    switch (id) {
      case "portfolio":
        content = <PortfolioPanel />;
        break;
      case "peg-monitor":
        content = <PegMonitorPanel />;
        break;
      case "liquidity":
        content = <LiveLiquidityPanel />;
        break;
      case "yield":
        content = <YieldPanel />;
        break;
      case "swap":
        content = <SwapPanel />;
        break;
      default:
        content = (
          <div className="flex items-center justify-center h-full">
            Unknown panel
          </div>
        );
    }

    return (
      <MosaicWindow<PanelId>
        path={[]}
        title=""
        createNode={() => "portfolio"}
        renderToolbar={() => <></>}
      >
        {content}
      </MosaicWindow>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <TopBar onSearchClick={() => setCommandOpen(true)} />
      <div className="flex-1 overflow-hidden">
        <Mosaic<PanelId>
          renderTile={renderTile}
          value={currentLayout}
          onChange={setCurrentLayout}
          className="mosaic-blueprint-theme"
        />
      </div>
      <StatusBar />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
