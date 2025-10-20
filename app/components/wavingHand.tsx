"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WavingHand() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="text-2xl">👋</span>;

  return (
    <motion.span
      animate={{ rotate: [0, 20, -10, 20, -5, 15, 0], scale: [1, 1.1, 1, 1.1, 1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
      className="inline-block text-2xl sm:text-3xl md:text-4xl cursor-default select-none"
      style={{ transformOrigin: "70% 70%" }}
    >
      👋
    </motion.span>
  );
}
