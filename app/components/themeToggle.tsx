"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="relative p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Toggle theme"
            >
                <div className="relative w-5 h-5">
                    <Sun
                        size={20}
                        className="absolute inset-0 text-yellow-500 opacity-100"
                    />
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    size={20}
                    className={`absolute inset-0 text-yellow-500 transition-all duration-300 ${theme === "light" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                        }`}
                />
                <Moon
                    size={20}
                    className={`absolute inset-0 text-blue-400 transition-all duration-300 ${theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                        }`}
                />
            </div>
        </button>
    );
}
