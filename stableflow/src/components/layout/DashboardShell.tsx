"use client";

import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { NewsTicker } from "@/components/dashboard/NewsTicker";
import { PegMonitorPanel } from "@/components/panels/PegMonitorPanel";
import { LiveLiquidityPanel } from "@/components/panels/LiveLiquidityPanel";
import { YieldPanel } from "@/components/panels/YieldPanel";

export function DashboardShell() {
  return (
    <div className="h-screen flex flex-col">
      <TopBar onSearchClick={() => {}} />
      <MarketOverview />
      <NewsTicker />

      {/* Main Dashboard Grid */}
      <div className="flex-1 overflow-auto" style={{ background: "var(--bg-primary)" }}>
        <div className="grid grid-cols-12 gap-2 p-2 h-full">
          {/* Left: Asset Monitor - spans 7 columns */}
          <div className="col-span-7 flex flex-col min-h-0">
            <PegMonitorPanel />
          </div>

          {/* Right Column: 2 panels stacked */}
          <div className="col-span-5 flex flex-col gap-2 min-h-0">
            {/* Top: Live Liquidity */}
            <div className="flex-1 min-h-0">
              <LiveLiquidityPanel />
            </div>

            {/* Bottom: Yields */}
            <div className="flex-1 min-h-0">
              <YieldPanel />
            </div>
          </div>
        </div>
      </div>

      <StatusBar />
    </div>
  );
}
