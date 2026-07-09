"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Card from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error caught:", error);
    const errorMessage = error.message ? error.message.toLowerCase() : "";
    if (
      errorMessage.includes("cannot find module") ||
      errorMessage.includes("loading chunk") ||
      errorMessage.includes("chunkloaderror") ||
      errorMessage.includes("fail to fetch")
    ) {
      console.warn("Dynamic module chunk load failure detected. Performing recovery reload...");
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <Card className="max-w-[480px] w-full p-8 text-center space-y-6">
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} className="text-[#FCA5A5]" />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-zinc-100 font-serif mb-2">
            Something went wrong
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            An unexpected error occurred during rendering. We&apos;ve logged the incident and are working to resolve it.
          </p>
        </div>

        {/* Error Details Box */}
        <div className="bg-[#0A0A0B] border border-zinc-800 rounded-lg p-4 text-left space-y-1.5 max-h-[150px] overflow-y-auto">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Error Message
          </div>
          <div className="font-mono text-xs text-zinc-300 break-all leading-normal">
            {error.message || "Unknown error occurred"}
          </div>
          {error.digest && (
            <div className="font-mono text-[10px] text-zinc-500 mt-2">
              Digest: {error.digest}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="w-full h-11"
          >
            <RefreshCw size={14} /> Try Again
          </Button>
          
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            variant="ghost"
            className="w-full h-11"
          >
            <Home size={14} /> Return Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
