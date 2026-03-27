"use client";

import dynamic from "next/dynamic";

const TerminalShell = dynamic(
  () => import("@/components/layout/TerminalShell").then((mod) => ({ default: mod.TerminalShell })),
  { ssr: false }
);

export default function Home() {
  return <TerminalShell />;
}
