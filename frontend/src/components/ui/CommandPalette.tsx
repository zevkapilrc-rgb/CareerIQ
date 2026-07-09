"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Compass, MessageSquare, BarChart2, Globe, Layout, User, Settings, ArrowRight } from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: "dashboard", title: "AI Command Center", description: "Go to your career headquarters", icon: <Layout className="w-4 h-4" />, url: "/dashboard" },
    { id: "resume", title: "Resume Forge", description: "Analyze & optimize your resume for ATS", icon: <FileText className="w-4 h-4" />, url: "/resume" },
    { id: "roadmap", title: "Career Radar", description: "Explore your personalized career strategy", icon: <Compass className="w-4 h-4" />, url: "/career-path" },
    { id: "interview", title: "Interview Arena", description: "Practice mock interview simulations", icon: <MessageSquare className="w-4 h-4" />, url: "/interview" },
    { id: "market", title: "Market Intelligence", description: "View salary and skill trends", icon: <BarChart2 className="w-4 h-4" />, url: "/analytics" },
    { id: "jobs", title: "Job Matches", description: "Search for open international positions", icon: <Globe className="w-4 h-4" />, url: "/global-scanner" },
    { id: "profile", title: "Career Identity", description: "Manage your digital professional profile", icon: <User className="w-4 h-4" />, url: "/profile" },
    { id: "settings", title: "Settings", description: "Update preferences and configuration", icon: <Settings className="w-4 h-4" />, url: "/profile" },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filtered.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filtered[selectedIndex]) {
            handleSelect(filtered[selectedIndex].url);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filtered]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    router.push(url);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Palette container */}
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-[var(--bg)]/95 shadow-2xl backdrop-blur-xl z-10 flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-white/[0.05] px-4 py-3.5">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands, pages, or actions... (Esc to close)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-500 outline-none border-none font-medium"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold bg-black/5 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08] text-zinc-555 dark:text-zinc-400 rounded-md">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-[350px] overflow-y-auto p-2.5 flex flex-col gap-1 no-scrollbar">
              {filtered.length > 0 ? (
                filtered.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.url)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-zinc-900 dark:text-white"
                          : "bg-transparent border border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isSelected ? "bg-[var(--color-primary)]/20 text-[var(--color-accent)] dark:text-white" : "bg-black/5 dark:bg-white/[0.02] text-zinc-400"
                        }`}>
                          {cmd.icon}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                            {cmd.title}
                          </span>
                          <span className="text-xs text-zinc-450 dark:text-zinc-400 leading-normal">
                            {cmd.description}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-[var(--color-accent)] animate-pulse mr-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-zinc-500 text-sm">
                  No commands found matching &quot;{query}&quot;
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="border-t border-zinc-200 dark:border-white/[0.05] bg-black/[0.01] dark:bg-white/[0.01] px-4 py-2.5 flex items-center justify-between text-[10px] text-zinc-500 font-semibold tracking-wide">
              <div className="flex items-center gap-2">
                <span>↑↓ Navigate</span>
                <span>•</span>
                <span>Enter Select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Universal Search</span>
                <kbd className="px-1.5 py-0.5 bg-black/[0.02] dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] rounded text-[9px]">
                  Ctrl+K
                </kbd>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;

