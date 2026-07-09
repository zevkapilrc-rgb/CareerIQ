import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_20px_80px_rgba(2,6,23,0.35)] rounded-2xl transition-all duration-300 ${
        hover ? "hover:bg-white/10 hover:border-white/20" : ""
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export default GlassCard;
