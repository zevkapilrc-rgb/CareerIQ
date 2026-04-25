"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";

const PUBLIC_ROUTES = ["/login", "/", "/contact"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const role = useAppStore(s => s.role);
    useEffect(() => {
        const isPublic = PUBLIC_ROUTES.includes(pathname);
        if (role === "guest" && !isPublic) {
            router.push("/login");
        }
        if (role === "user" && pathname === "/admin") {
            router.push("/dashboard");
        }
    }, [role, pathname, router]);

    return <>{children}</>;
}
