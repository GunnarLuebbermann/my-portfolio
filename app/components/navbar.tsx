"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projekte" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Kontakt" },
  ];

  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-md rounded-xl mt-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Gunnar
      </h1>

      <ul className="flex gap-8 text-base font-medium">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
