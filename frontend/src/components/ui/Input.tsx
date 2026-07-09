"use client";

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", style = {}, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5" style={style}>
        {label && (
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-display">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full 
              h-11 
              bg-white/[0.015] 
              backdrop-blur-xl 
              border 
              ${error ? "border-red-500/30 focus:border-red-500/70 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/[0.06] focus:border-[var(--color-primary)]/60 focus:shadow-[0_0_15px_rgba(122,23,48,0.15)]"} 
              text-[#F4F4F5] 
              text-sm 
              rounded-xl 
              ${icon ? "pl-10" : "px-3.5"} 
              pr-3.5 
              placeholder:text-zinc-600 
              outline-none 
              transition-all 
              duration-300 
              hover:border-white/[0.12]
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-red-400 font-semibold mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", style = {}, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5" style={style}>
        {label && (
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-display">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full 
            bg-white/[0.015] 
            backdrop-blur-xl 
            border 
            ${error ? "border-red-500/30 focus:border-red-500/70 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/[0.06] focus:border-[var(--color-primary)]/60 focus:shadow-[0_0_15px_rgba(122,23,48,0.15)]"} 
            text-[#F4F4F5] 
            text-sm 
            rounded-xl 
            p-3.5 
            placeholder:text-zinc-600 
            outline-none 
            transition-all 
            duration-300 
            resize-none 
            hover:border-white/[0.12]
            min-h-[100px] 
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400 font-semibold mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", style = {}, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5" style={style}>
        {label && (
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-display">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full 
            h-11 
            bg-white/[0.015] 
            backdrop-blur-xl 
            border 
            ${error ? "border-red-500/30 focus:border-red-500/70 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/[0.06] focus:border-[var(--color-primary)]/60 focus:shadow-[0_0_15px_rgba(122,23,48,0.15)]"} 
            text-[#F4F4F5] 
            text-sm 
            rounded-xl 
            px-3.5 
            outline-none 
            transition-all 
            duration-300 
            hover:border-white/[0.12]
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0C0C0E] text-[#F4F4F5]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-red-400 font-semibold mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

