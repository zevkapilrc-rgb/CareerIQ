"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "warning" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  let icon = <Info className="w-5 h-5 text-blue-500 dark:text-blue-450" />;
  let borderClass = "border-blue-500/25 bg-blue-50/80 dark:bg-blue-950/10";
  if (type === "success") {
    icon = <CheckCircle className="w-5 h-5 text-emerald-650 dark:text-emerald-400" />;
    borderClass = "border-emerald-500/25 bg-emerald-50/80 dark:bg-emerald-950/10";
  } else if (type === "warning") {
    icon = <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-450" />;
    borderClass = "border-yellow-500/25 bg-yellow-50/80 dark:bg-yellow-950/10";
  } else if (type === "error") {
    icon = <AlertCircle className="w-5 h-5 text-red-650 dark:text-red-400" />;
    borderClass = "border-red-500/25 bg-red-50/80 dark:bg-red-950/10";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-center gap-3.5 p-4 rounded-xl border backdrop-blur-xl shadow-xl z-50 ${borderClass}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <p className="text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-100 mr-4 leading-normal">
        {message}
      </p>
      <button
        onClick={onClose}
        className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white rounded-lg p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
