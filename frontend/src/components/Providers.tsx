/* eslint-disable */
"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AuthGate from "./AuthGate";
import ThemeProvider from "./Theme/ThemeProvider";
import { AuthProvider } from "@/src/context/AuthContext";

// SessionProvider is loaded lazily so it doesn't break if next-auth is not yet installed
let SessionProvider: any = ({ children }: any) => children;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    SessionProvider = require("next-auth/react").SessionProvider;
} catch { /* next-auth not installed yet */ }

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <div style={{ minHeight: "100vh" }}>
                            <AuthGate>{children}</AuthGate>
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    style: {
                                        background: "#111827",
                                        color: "#F1F5F9",
                                        border: "1px solid rgba(255,243,230,0.2)",
                                    },
                                }}
                            />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
