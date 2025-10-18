"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./themeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projekte" },
    { href: "/skills", label: "Skills" },
    { href: "/games", label: "Spiele" },
    { href: "/contact", label: "Kontakt" },
  ];

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-6xl px-6 py-4">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/20 rounded-2xl shadow-lg shadow-gray-900/5 dark:shadow-gray-900/20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Gunnar Lübbermann
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-2 text-sm font-medium">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:scale-105"
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
            <li className="ml-2">
              <ThemeToggle />
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/20 dark:border-gray-700/20">
            <ul className="p-4 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2 border-t border-gray-200/20 dark:border-gray-700/20 mt-2">
                <div className="px-4">
                  <ThemeToggle />
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
