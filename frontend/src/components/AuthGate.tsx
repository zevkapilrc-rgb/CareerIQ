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
        // Wait for Zustand persist to rehydrate from localStorage
        // We use a longer delay to ensure rehydration is complete
        const timer = setTimeout(() => {
            setHydrated(true);
            const currentRole = useAppStore.getState().role;
            const isPublic = PUBLIC_ROUTES.includes(pathname);
            
            if (currentRole === "guest" && !isPublic) {
                router.push("/login");
            }
            if (currentRole === "user" && pathname === "/admin") {
                router.push("/dashboard");
            }
        }, 150); // Increased from 50ms to 150ms for reliable rehydration
        return () => clearTimeout(timer);
    }, [role, pathname]);

    // Always render children — no loading gate (prevents flash)
    return <>{children}</>;
}
