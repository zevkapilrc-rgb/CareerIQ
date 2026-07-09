"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";

const PUBLIC_ROUTES = [
    "/",
    "/home",
    "/login",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/contact",
    "/resume",
];

function isAdminRoute(pathname: string) {
    return ["/admin"].some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

const ADMIN_ONLY_ROUTES = ["/admin"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const role = useAppStore(s => s.role);
    const authReady = useAppStore(s => s.authReady);
    const rehydrateFromToken = useAppStore(s => s.rehydrateFromToken);
    const [hydrated, setHydrated] = useState(false);

    // ── Auto-login: check JWT on mount ──────────────────────────
    useEffect(() => {
        rehydrateFromToken().finally(() => setHydrated(true));
    }, [rehydrateFromToken]);

    // ── Route protection ────────────────────────────────────────
    // Only redirect AFTER both hydrated AND authReady to prevent race conditions
    useEffect(() => {
        if (!hydrated || !authReady) return;
        const isPublic = PUBLIC_ROUTES.includes(pathname);
        if (role === "guest" && !isPublic) {
            const target = pathname.startsWith("/") ? pathname.slice(1) : pathname;
            localStorage.setItem("ciq-redirect-after-login", target);
            router.push("/login");
        }

        if (isAdminRoute(pathname) && role !== "admin") {
            router.push("/dashboard");
        }
    }, [role, pathname, router, hydrated, authReady]);

    return <>{children}</>;
}
