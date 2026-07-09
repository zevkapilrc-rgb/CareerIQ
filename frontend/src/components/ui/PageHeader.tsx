"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/[0.05] pb-6 mb-8 mt-2">
      <div className="flex-1 min-w-0">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[10px] font-bold tracking-wider text-[var(--color-primary-light)] dark:text-[var(--color-accent)] uppercase mb-3 font-display">
            {badge}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F4F4F5] tracking-tight leading-tight mb-2 font-display">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-zinc-400 font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;

