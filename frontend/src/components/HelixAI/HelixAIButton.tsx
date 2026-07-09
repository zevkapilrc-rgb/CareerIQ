"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface HelixAIButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const HelixAIButton: React.FC<HelixAIButtonProps> = ({ onClick, isOpen = false }) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
          }}
          exit={{ scale: 0.85, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-[var(--color-primary)] shadow-lg transition-all duration-300"
          style={{ boxShadow: "0 0 16px 2px rgba(122, 23, 48, 0.2)" }}
          aria-label="Helix AI Assistant"
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-6 h-6 text-[var(--color-primary)] dark:text-[var(--color-accent)]" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default HelixAIButton;
