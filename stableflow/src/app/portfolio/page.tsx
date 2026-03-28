"use client";

import dynamic from "next/dynamic";

const PortfolioShell = dynamic(
  () => import("@/components/layout/PortfolioShell").then((mod) => mod.PortfolioShell),
  { ssr: false }
);

export default function PortfolioPage() {
  return <PortfolioShell />;
}
