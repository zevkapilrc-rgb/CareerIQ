"use client";

import React from "react";

interface SkeletonLoaderProps {
  variant?: "card" | "list" | "chart" | "circle" | "timeline" | "line";
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "card",
  count = 1,
  className = "",
}) => {
  const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent bg-white/[0.02] border border-white/[0.04]";

  const renderSkeleton = () => {
    if (variant === "card") {
      return (
        <div className={`p-6 rounded-2xl flex flex-col gap-4 ${shimmerClass} ${className}`}>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-white/[0.04] rounded w-1/3" />
              <div className="h-3 bg-white/[0.04] rounded w-1/5" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 mt-2">
            <div className="h-3.5 bg-white/[0.04] rounded w-full" />
            <div className="h-3.5 bg-white/[0.04] rounded w-11/12" />
            <div className="h-3.5 bg-white/[0.04] rounded w-4/5" />
          </div>
        </div>
      );
    }

    if (variant === "circle") {
      return (
        <div className={`rounded-full ${shimmerClass} ${className}`} />
      );
    }

    if (variant === "chart") {
      return (
        <div className={`p-6 rounded-2xl flex flex-col gap-4 h-64 justify-end ${shimmerClass} ${className}`}>
          <div className="flex items-end gap-3 h-full px-2">
            <div className="w-full h-[60%] bg-white/[0.04] rounded-t-lg" />
            <div className="w-full h-[85%] bg-white/[0.04] rounded-t-lg" />
            <div className="w-full h-[40%] bg-white/[0.04] rounded-t-lg" />
            <div className="w-full h-[70%] bg-white/[0.04] rounded-t-lg" />
            <div className="w-full h-[95%] bg-white/[0.04] rounded-t-lg" />
            <div className="w-full h-[55%] bg-white/[0.04] rounded-t-lg" />
          </div>
        </div>
      );
    }

    if (variant === "timeline") {
      return (
        <div className={`flex flex-col gap-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/[0.03] ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="relative flex flex-col gap-2">
              <div className={`absolute -left-6 w-4 h-4 rounded-full border border-white/[0.08] ${shimmerClass}`} />
              <div className={`h-4 bg-white/[0.04] rounded w-1/4 ${shimmerClass}`} />
              <div className={`h-3 bg-white/[0.04] rounded w-2/3 ${shimmerClass}`} />
            </div>
          ))}
        </div>
      );
    }

    if (variant === "list") {
      return (
        <div className={`flex flex-col gap-3 ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={`p-4 rounded-xl flex items-center justify-between gap-4 ${shimmerClass}`}>
              <div className="h-4 bg-white/[0.04] rounded w-1/3" />
              <div className="h-4 bg-white/[0.04] rounded w-12" />
            </div>
          ))}
        </div>
      );
    }

    // Default line
    return (
      <div className={`h-4 bg-white/[0.02] rounded-md ${shimmerClass} ${className}`} />
    );
  };

  if (variant === "list" || variant === "timeline" || variant === "line") {
    return renderSkeleton();
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SkeletonLoader;
