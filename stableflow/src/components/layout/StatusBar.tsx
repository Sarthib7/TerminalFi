"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useSolanaSlot } from "@/hooks/useSolanaSlot";
import { formatTokenAmount } from "@/lib/format";

export function StatusBar() {
  const { data: slot, isError } = useSolanaSlot();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const connectionStatus = isError ? "error" : slot ? "connected" : "connecting";

  return (
    <div
      className="flex items-center justify-between px-4 border-t"
      style={{
        height: "28px",
        background: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
      }}
    >
      {/* Left: Network + Connection status */}
      <div className="flex items-center gap-4">
        <span style={{ color: "var(--text-secondary)" }}>
          Network:{" "}
          <span style={{ color: "var(--text-primary)" }}>Mainnet</span>
        </span>
        <div className="flex items-center gap-1.5">
          <Circle
            size={8}
            fill={
              connectionStatus === "connected"
                ? "var(--accent-green)"
                : connectionStatus === "error"
                ? "var(--accent-red)"
                : "var(--accent-amber)"
            }
            style={{
              color:
                connectionStatus === "connected"
                  ? "var(--accent-green)"
                  : connectionStatus === "error"
                  ? "var(--accent-red)"
                  : "var(--accent-amber)",
            }}
          />
          <span style={{ color: "var(--text-secondary)" }}>
            {connectionStatus === "connected"
              ? "Connected"
              : connectionStatus === "error"
              ? "Error"
              : "Connecting"}
          </span>
        </div>
      </div>

      {/* Center: Slot */}
      {slot && (
        <span style={{ color: "var(--text-secondary)" }}>
          Slot:{" "}
          <span style={{ color: "var(--text-primary)" }}>
            {formatTokenAmount(slot, 0)}
          </span>
        </span>
      )}

      {/* Right: Timestamp */}
      <span style={{ color: "var(--text-muted)" }}>{timeString} UTC</span>
    </div>
  );
}
