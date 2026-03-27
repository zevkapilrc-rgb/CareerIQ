"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";

const PUBLIC_ROUTES = ["/login", "/", "/contact"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const role = useAppStore(s => s.role);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // Mark as hydrated immediately on mount (client side)
        // Zustand persist rehydrates synchronously from localStorage on first render
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        const isPublic = PUBLIC_ROUTES.includes(pathname);
        if (role === "guest" && !isPublic) {
            router.push("/login");
        }
        if (role === "user" && pathname === "/admin") {
            router.push("/dashboard");
        }
    }, [hydrated, role, pathname, router]);

    if (!hydrated) {
        return (
            <div style={{
                display: "flex",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg, #1a0e2e)"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16
                }}>
                    <div style={{ fontSize: "2.5rem", animation: "pulse 1.5s infinite" }}>🚀</div>
                    <div style={{ color: "var(--text-muted, #8a6d8a)", fontSize: "0.85rem" }}>Loading CareerIQ...</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
