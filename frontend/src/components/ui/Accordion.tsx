"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950/20 transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4.5 flex justify-between items-center bg-transparent border-none cursor-pointer text-left focus:outline-none"
      >
        <span className="text-sm font-semibold text-[#F4F4F5]">{title}</span>
        <div className="w-6 h-6 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-400">
          <ChevronDown
            size={14}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  items: { q: string; a: string }[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => (
        <AccordionItem key={idx} title={item.q}>
          {item.a}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
