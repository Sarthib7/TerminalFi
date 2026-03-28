"use client";

import dynamic from "next/dynamic";

const DashboardShell = dynamic(
  () => import("@/components/layout/DashboardShell").then((mod) => ({ default: mod.DashboardShell })),
  { ssr: false }
);

export default function Home() {
  return <DashboardShell />;
}
