"use client";

import React from "react";
import GlassCard from "./GlassCard";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  highlighted?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverEffect = false,
  highlighted = false,
  children,
  className = "",
  style = {},
  ...props
}) => {
  return (
    <GlassCard
      hoverLift={hoverEffect}
      glow={highlighted}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

export default Card;
