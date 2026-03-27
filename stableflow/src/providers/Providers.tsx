"use client";

import { WalletProvider } from "./WalletProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <WalletProvider>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--bg-panel)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
            },
          }}
        />
      </WalletProvider>
    </QueryProvider>
  );
}
