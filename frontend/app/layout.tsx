import "@/src/styles/globals.css";
import { ReactNode } from "react";
import Providers from "@/src/components/Providers";
import Sidebar from "@/src/components/Sidebar";
import MainContent from "@/src/components/MainContent";

export const metadata = {
  title: "CareerIQ v3 — AI Career Growth Engine",
  description: "AI-powered career intelligence platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </Providers>
      </body>
    </html>
  );
}


