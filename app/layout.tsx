import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Mein Portfolio",
  description: "Portfolio von Gunnar – Webentwicklung & Design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-background text-foreground font-sans antialiased">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <h1 className="text-xl font-bold">
              <Link href="/">Gunnar</Link>
            </h1>
            <ul className="flex gap-6 text-sm">
              <li>
                <Link href="/projects" className="hover:underline">
                  Projekte
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:underline">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Kontakt
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl p-6">{children}</main>

        <footer className="border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 py-6">
          © {new Date().getFullYear()} Gunnar – Alle Rechte vorbehalten.
        </footer>
      </body>
    </html>
  );
}