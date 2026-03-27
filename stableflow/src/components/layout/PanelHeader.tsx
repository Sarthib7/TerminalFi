"use client";

import { LucideIcon } from "lucide-react";

interface PanelHeaderProps {
  title: string;
  icon: LucideIcon;
  children?: React.ReactNode; // optional controls on the right side
}

export function PanelHeader({ title, icon: Icon, children }: PanelHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-3 py-1.5 border-b"
      style={{
        background: "var(--bg-panel-header)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: "var(--accent-cyan)" }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          {title}
        </span>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
