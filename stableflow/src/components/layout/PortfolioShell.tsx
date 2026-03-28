"use client";

import { useState } from "react";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import type { MosaicNode } from "react-mosaic-component";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { PortfolioPanel } from "@/components/panels/PortfolioPanel";
import { SwapPanel } from "@/components/panels/SwapPanel";

type PortfolioPanelId = "portfolio" | "swap";

const DEFAULT_LAYOUT: MosaicNode<PortfolioPanelId> = {
  type: "split",
  direction: "row",
  splitPercentages: [60, 40],
  children: ["portfolio", "swap"],
};

export function PortfolioShell() {
  const [currentLayout, setCurrentLayout] =
    useState<MosaicNode<PortfolioPanelId> | null>(DEFAULT_LAYOUT);

  const renderTile = (id: PortfolioPanelId) => {
    let content: React.ReactNode;

    switch (id) {
      case "portfolio":
        content = <PortfolioPanel />;
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
      <MosaicWindow<PortfolioPanelId>
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
      <TopBar onSearchClick={() => {}} />
      <div className="flex-1 overflow-hidden">
        <Mosaic<PortfolioPanelId>
          renderTile={renderTile}
          value={currentLayout}
          onChange={setCurrentLayout}
          className="mosaic-blueprint-theme"
        />
      </div>
      <StatusBar />
    </div>
  );
}
