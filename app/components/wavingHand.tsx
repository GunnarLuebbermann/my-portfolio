"use client";

import { motion } from "framer-motion";

export default function WavingHand() {
    return (
        <motion.span
            animate={{ 
                rotate: [0, 20, -10, 20, -5, 15, 0],
                scale: [1, 1.1, 1, 1.1, 1, 1.05, 1]
            }}
            transition={{ 
                repeat: Infinity, 
                duration: 2.5, 
                ease: "easeInOut",
                repeatDelay: 1
            }}
            className="inline-block origin-bottom-right"
            style={{ transformOrigin: "70% 70%" }}
        >
            👋
        </motion.span>
    );
}
