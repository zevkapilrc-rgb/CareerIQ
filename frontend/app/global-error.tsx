"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Card from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error caught:", error);
    const errorMessage = error.message ? error.message.toLowerCase() : "";
    if (
      errorMessage.includes("cannot find module") ||
      errorMessage.includes("loading chunk") ||
      errorMessage.includes("chunkloaderror") ||
      errorMessage.includes("fail to fetch")
    ) {
      console.warn("Global chunk load failure detected. Performing recovery reload...");
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="m-0 p-0 bg-[#0A0A0B] text-[#F4F4F5] min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-[480px] w-full p-8 text-center space-y-6">
          {/* Warning Icon */}
          <div className="w-14 h-14 rounded-full bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} className="text-[#FCA5A5]" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-zinc-100 font-serif mb-2">
              System Recovery Mode
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A critical system error occurred in the platform root. Attempting recovery.
            </p>
          </div>

          {/* Error Details Box */}
          <div className="bg-[#0A0A0B] border border-zinc-800 rounded-lg p-4 text-left space-y-1.5 max-h-[150px] overflow-y-auto">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Error Details
            </div>
            <div className="font-mono text-xs text-zinc-300 break-all leading-normal">
              {error.message || "Unknown root layout crash"}
            </div>
            {error.digest && (
              <div className="font-mono text-[10px] text-zinc-500 mt-2">
                Digest: {error.digest}
              </div>
            )}
          </div>

          <Button
            onClick={() => reset()}
            variant="primary"
            className="w-full h-11"
          >
            <RefreshCw size={14} /> Recover System
          </Button>
        </Card>
      </body>
    </html>
  );
}
