"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AuthGate from "./AuthGate";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <div style={{ minHeight: "100vh" }}>
                <AuthGate>{children}</AuthGate>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#1a1a2e",
                            color: "#e2e8f0",
                            border: "1px solid rgba(167,139,250,0.3)",
                        },
                    }}
                />
            </div>
        </QueryClientProvider>
    );
}
