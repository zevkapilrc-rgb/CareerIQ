import "@/src/styles/globals.css";
import { ReactNode } from "react";
import Providers from "@/src/components/Providers";
import MainContent from "@/src/components/MainContent";

export const metadata = {
  title: "HIREVIX — From Resume to Results",
  description:
    "AI-powered career intelligence platform. Analyze your resume, plan your career path, prepare for interviews, and track market trends — all in one place.",
  keywords:
    "resume analyzer, ATS score, career intelligence, interview prep, skill gap analysis, job matching",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "HIREVIX — AI Career Intelligence",
    description:
      "Analyze resumes, plan career paths, and prepare for interviews with AI.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — Fraunces (headings), Inter (body), IBM Plex Mono (data) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          background: "var(--bg)",
          color: "var(--text)",
          minHeight: "100vh",
        }}
      >
        <Providers>
          <MainContent>{children}</MainContent>
        </Providers>
      </body>
    </html>
  );
}
