"use client";

import React from "react";
import PremiumButton from "./PremiumButton";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  style = {},
  disabled,
  ...props
}) => {
  // Map Button's variants to PremiumButton's variants
  let mappedVariant: "primary" | "secondary" | "ghost" | "glow" = "primary";
  if (variant === "ghost") {
    mappedVariant = "ghost";
  } else if (variant === "danger") {
    mappedVariant = "glow"; // Or use styled classes for danger
  }

  return (
    <PremiumButton
      variant={mappedVariant}
      size={size}
      magnetic={true}
      className={className}
      disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </PremiumButton>
  );
};

export default Button;
