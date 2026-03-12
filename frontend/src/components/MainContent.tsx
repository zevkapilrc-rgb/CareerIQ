"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const NO_SIDEBAR_ROUTES = ["/login"];

export default function MainContent({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = NO_SIDEBAR_ROUTES.includes(pathname);

    if (isLoginPage) {
        // Full-screen, no sidebar margin, no padding, no footer
        return (
            <div style={{ minHeight: "100vh" }}>
                {children}
            </div>
        );
    }

    return (
        <div className="main-content">
            {children}
            <footer style={{
                marginTop: 60,
                paddingTop: 20,
                paddingBottom: 24,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                textAlign: "center",
                fontSize: "0.72rem",
                color: "rgba(148,163,184,0.5)",
                letterSpacing: "0.04em",
            }}>
                © 2026 CareerIQ — All Rights Reserved
            </footer>
        </div>
    );
}
