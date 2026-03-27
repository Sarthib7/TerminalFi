"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import {
  fetchJupiterQuote,
  fetchJupiterSwapTransaction,
} from "@/lib/jupiter";
import { STABLECOINS } from "@/lib/stablecoins";
import type { JupiterQuote, SwapState } from "@/types";
import { toast } from "sonner";

export function useJupiterSwap() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [state, setState] = useState<SwapState>({
    status: "idle",
    quote: null,
    txSignature: null,
    error: null,
  });

  const getQuote = useCallback(
    async (
      inputSymbol: string,
      outputSymbol: string,
      amountHuman: number
    ): Promise<JupiterQuote | null> => {
      const input = STABLECOINS[inputSymbol];
      const output = STABLECOINS[outputSymbol];
      if (!input || !output) return null;

      setState((s) => ({ ...s, status: "quoting", error: null }));
      try {
        const amountLamports = Math.floor(
          amountHuman * 10 ** input.decimals
        ).toString();
        const quote = await fetchJupiterQuote(input.mint, output.mint, amountLamports);
        setState((s) => ({ ...s, status: "idle", quote }));
        return quote;
      } catch (err: any) {
        setState((s) => ({
          ...s,
          status: "error",
          error: err.message || "Quote failed",
        }));
        return null;
      }
    },
    []
  );

  const executeSwap = useCallback(
    async (quote: JupiterQuote) => {
      if (!publicKey || !signTransaction) {
        toast.error("Wallet not connected");
        return null;
      }

      setState((s) => ({ ...s, status: "signing", error: null }));
      try {
        // Get swap transaction
        const swapTxBase64 = await fetchJupiterSwapTransaction(
          quote,
          publicKey.toBase58()
        );

        // Deserialize and sign
        const txBuf = Buffer.from(swapTxBase64, "base64");
        const tx = VersionedTransaction.deserialize(txBuf);

        setState((s) => ({ ...s, status: "signing" }));
        const signedTx = await signTransaction(tx);

        setState((s) => ({ ...s, status: "confirming" }));
        const txid = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: true,
          maxRetries: 2,
        });

        // Confirm
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          signature: txid,
        });

        setState({
          status: "success",
          quote,
          txSignature: txid,
          error: null,
        });

        toast.success("Swap successful!", {
          description: `TX: ${txid.slice(0, 8)}...`,
          action: {
            label: "View",
            onClick: () =>
              window.open(`https://solscan.io/tx/${txid}`, "_blank"),
          },
        });

        return txid;
      } catch (err: any) {
        const msg = err.message || "Swap failed";
        setState((s) => ({ ...s, status: "error", error: msg }));
        toast.error("Swap failed", { description: msg });
        return null;
      }
    },
    [publicKey, signTransaction, connection]
  );

  const reset = useCallback(() => {
    setState({ status: "idle", quote: null, txSignature: null, error: null });
  }, []);

  return { state, getQuote, executeSwap, reset };
}
