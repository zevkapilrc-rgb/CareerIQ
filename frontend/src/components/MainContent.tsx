"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import TopNav from "@/src/components/TopNav";
import Link from "next/link";
import { PremiumLoader } from "@/src/components/ui/PremiumLoader";
import PageTransition from "@/src/components/PageTransition";
import CommandPalette from "@/src/components/ui/CommandPalette";
import { HelixAIButton } from "@/src/components/HelixAI/HelixAIButton";
import { HelixAIPanel } from "@/src/components/HelixAI/HelixAIPanel";
import { useAuth } from "@/src/context/AuthContext";

const NO_NAV_ROUTES = ["/login", "/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password"];
const PUBLIC_ROUTES = ["/", "/home", "/login", "/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/contact", "/resume"];
const ADMIN_ONLY_ROUTES = ["/admin"];
// Routes that need to fill full viewport height (no scroll on page level)
const FULL_HEIGHT_ROUTES = ["/chatbot", "/interview"];

function InlineLoader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ background: "var(--bg)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "radial-gradient(circle at 30% 30%, rgba(122, 23, 48, 0.06), transparent 50%), radial-gradient(circle at 70% 70%, rgba(201, 151, 90, 0.04), transparent 50%)"
            }} />
            <PremiumLoader message="HIREVIX" submessage="Aligning Workspace" />
        </div>
    );
}

export default function MainContent({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { role, authReady } = useAppStore();
    const { isAdmin } = useAuth();
    const isFullScreen = NO_NAV_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    const [mounted, setMounted] = useState(false);
    const [everAuthed, setEverAuthed] = useState(false);
    const [showLoaderOverlay, setShowLoaderOverlay] = useState(true);
    const [aiOpen, setAiOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        setShowLoaderOverlay(false);

        const t = setTimeout(() => {
            useAppStore.getState().setAuthReady(true);
            setShowLoaderOverlay(false);
        }, 2000);

        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (authReady && role !== "guest") {
            setEverAuthed(true);
        }
    }, [authReady, role]);

    // Redirect guest users from protected routes
    useEffect(() => {
        if (!mounted || !authReady) return;

        if (role === "guest" && !PUBLIC_ROUTES.includes(pathname)) {
            const target = pathname.startsWith("/") ? pathname.slice(1) : pathname;
            localStorage.setItem("ciq-redirect-after-login", target);
            router.replace("/login");
            return;
        }

        const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
        if (isAdminRoute && !isAdmin) {
            router.replace("/dashboard");
        }
    }, [role, pathname, router, mounted, authReady, isAdmin]);

    if (!mounted || showLoaderOverlay) {
        return <InlineLoader />;
    }

    if (!everAuthed && !authReady && !isPublicRoute) {
        return <InlineLoader />;
    }

    if (role === "guest" && !isPublicRoute && authReady) {
        return <InlineLoader />;
    }

    if (isFullScreen) {
        return (
            <div className="min-h-screen" style={{ background: "var(--bg)" }}>
                <PageTransition>{children}</PageTransition>
            </div>
        );
    }

    const isFullHeightPage = FULL_HEIGHT_ROUTES.some((r) => pathname.startsWith(r));

    return (
        <div
            className="min-h-screen"
            style={{
                background: "var(--bg)",
                display: "flex",
                flexDirection: "column",
                ...(isFullHeightPage ? { overflow: "hidden", height: "100vh" } : {}),
            }}
        >
            {/* Global navigation */}
            <TopNav />

            {/* Page content */}
            <PageTransition>
                <div
                    className={isFullHeightPage ? "" : "px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full"}
                    style={isFullHeightPage ? { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" } : { minHeight: "100%" }}
                >
                    {children}
                </div>
            </PageTransition>

            {/* Global AI Assistant */}
            {role !== "guest" && (
                <div className="fixed bottom-5 right-5 z-[60]">
                    <HelixAIButton onClick={() => setAiOpen(true)} isOpen={aiOpen} />
                    <HelixAIPanel isOpen={aiOpen} onClose={() => setAiOpen(false)} />
                </div>
            )}
            <CommandPalette />

            {/* Footer — only on non-full-height pages */}
            {!isFullHeightPage && (
                <footer
                    className="mt-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-semibold tracking-wide"
                    style={{ borderTop: "1px solid rgba(247, 244, 236, 0.05)", color: "var(--text-muted)" }}
                >
                    <div>© 2026 HIREVIX. All rights reserved.</div>
                    <div className="flex items-center gap-6">
                        <Link href="/contact" className="hover:text-[var(--text)] transition-colors">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-[var(--text)] transition-colors">Terms of Service</Link>
                        <Link href="/contact" className="hover:text-[var(--text)] transition-colors">Support Center</Link>
                    </div>
                </footer>
            )}
        </div>
    );
}
