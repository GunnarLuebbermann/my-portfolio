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
    <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
      <h1 className="text-xl font-bold">
        <Link href="/">Gunnar</Link>
      </h1>
      <ul className="flex gap-6 text-sm">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:underline transition ${
                  isActive
                    ? "text-blue-500 font-semibold"
                    : "text-gray-700 dark:text-gray-300"
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
