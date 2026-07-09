"use client";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  circle = false,
  className = "",
  style = {},
  ...props
}) => {
  return (
    <div
      className={`animate-pulse bg-zinc-800/60 ${circle ? "rounded-full" : "rounded-md"} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export default Skeleton;
