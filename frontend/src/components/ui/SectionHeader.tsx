"use client";

import React from "react";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/[0.05] ${className}`} {...props}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-semibold tracking-tight font-display text-[var(--text)]">
            {title}
          </h2>
          {badge && (
            <div className="flex items-center">
              {typeof badge === "string" ? (
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] dark:text-[var(--color-accent)] border border-[var(--color-primary)]/30 rounded-md font-sans">
                  {badge}
                </span>
              ) : (
                badge
              )}
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default SectionHeader;

