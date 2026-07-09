"use client";
 
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";
import ResumeAnalyzerPage from "@/src/components/ResumeUpload/ResumeAnalyzerPage";
import Loading from "@/app/loading";
 
import ResumeStudioShell from "@/src/components/ResumeStudio/ResumeStudioShell";
 
export default function ResumePage() {
  const { role, authReady } = useAppStore();
  const router = useRouter();
 
  useEffect(() => {
    if (authReady && role === "guest") {
      localStorage.setItem("ciq-redirect-after-login", "resume");
      router.push("/login");
    }
  }, [authReady, role, router]);
 
  if (!authReady || role === "guest") {
    return <Loading />;
  }
 
  return <ResumeStudioShell />;
}
